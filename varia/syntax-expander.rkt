#lang racket

;;
;; LET / LET*
;; 

;;the proper way to convert a let
(define (let->lambda exp)
  (let* ((let-bindings (cadr exp))
         (let-body (cddr exp))
         (let-vars (map car let-bindings))
         (let-vals (map cadr let-bindings)))
    `((lambda ,let-vars ,@let-body) ,@let-vals)))

;(let->lambda '(let ((x 2) (y 3) (z 4)) (+ 1 x y z) x y))

;;expects no shadowing of previous variables
(define (let->define exp)
  (let ((let-bindings (cadr exp))
        (let-body (cddr exp)))
    `(begin ,@(map (lambda (binding)
                     (let ((var (car binding))
                           (val (cadr binding)))
                       `(define ,var ,val)))
                   let-bindings)
            ,@let-body)))

;(let->define '(let ((x 2) (y 3) (z 4)) (+ 1 x y z) x y))

;;
;; NAMED LET
;;

(define (named-let->loop exp)
  (let* ((nl-identifier (cadr exp))
         (nl-bindings (caddr exp))
         (nl-vars (map car nl-bindings))
         (nl-vals (map cadr nl-bindings))
         (nl-body (cdddr exp)))
    `(begin
       (define (,nl-identifier ,@nl-vars)
         ,@nl-body)
       (,nl-identifier ,@nl-vals))))

;(named-let->loop '(let test ((n 10) 
;                             (acc 1))
;                    (if (= n 0)
;                        acc
;                        (test (- n 1)
;                              (* acc n)))))

;;
;; DO ITERATION
;;

(define *current-id* 0)

(define (unique nam)
  (let ((str (symbol->string nam))
        (nbr (number->string *current-id*)))
    (set! *current-id* (+ *current-id* 1))
    (string->symbol (string-append str nbr))))

(define (do->loop exp)
  (let* ((do-bindings (cadr exp))
         (do-vars (map car do-bindings))
         (do-vals (map cadr do-bindings))
         (do-incr (map caddr do-bindings))
         (do-clause (caddr exp))
         (do-pred (car do-clause))
         (do-exit (cdr do-clause))
         (do-body (cdddr exp))
         (loop-nam (unique 'loop)))
    `(begin
       (define (,loop-nam ,@do-vars)
         (if ,do-pred
             (begin ,@do-exit)
             (begin
               ,@do-body
               (,loop-nam ,@do-incr))))
       (,loop-nam ,@do-vals))))

;(do->loop '(do ((n 10 (- n 1))
;                (acc 1 (* n acc)))
;             ((= n 0) acc)))

;;
;; COND
;;

(define (cond->if c)
  (define (loop exp)
    (if (null? exp)
        '()
        (let* ((first (car exp))
               (pred (car first))
               (body (cdr first)))
          (if (eq? pred 'else)
              `(begin ,@body)
              `(if ,pred
                   (begin ,@body)
                   ,(loop (cdr exp)))))))
  (loop (cdr c)))

;(cond->if '(cond ((= x 2) 'one)
;                ((= y 3) 'two)
;                 (else 'else)))

;;
;; MAIN TRANSFORM PROCEDURE
;;

(define (transform program)
  (if (pair? program)
      (let ((opr (car program))
            (opd (cdr program)))
        (cond ((or (eq? opr 'let) (eq? opr 'let*))
               (if (symbol? (car opd))
                   (transform (named-let->loop program))
                   (transform (let->define program))))
              ((eq? opr 'cond)
               (transform (cond->if program)))
              ((eq? opr 'do)
               (transform (do->loop program)))
              (else
               (cons (transform opr)
                     (transform opd)))))
      program))

;;
;; EXAMPLE/TEST
;;

(define PROGRAM
  '(begin
     (define div quotient)
     (define (odd? x) 
       (= (remainder x 2) 1))
     (define (max . args)
       (define (loop cur lrg)
         (if (null? cur) 
             lrg
             (let ((first (car cur)))
               (loop
                (cdr cur)
                (if (> first lrg)
                    first
                    lrg)))))
       (loop (cdr args) (car args)))
     
     (define (three-partitions m)
       (let loop1 ((lst '())
                   (nc1 (div m 3)))
         (if (< nc1 0)
             lst
             (let loop2 ((lst lst)
                         (nc2 (div (- m nc1) 2)))
               (if (< nc2 nc1)
                   (loop1 lst
                          (- nc1 1))
                   (loop2 (cons (vector nc1 nc2 (- m (+ nc1 nc2))) lst)
                          (- nc2 1)))))))
     
     (define (four-partitions m)
       (let loop1 ((lst '())
                   (nc1 (div m 4)))
         (if (< nc1 0)
             lst
             (let loop2 ((lst lst)
                         (nc2 (div (- m nc1) 3)))
               (if (< nc2 nc1)
                   (loop1 lst
                          (- nc1 1))
                   (let ((start (max nc2 (- (div (+ m 1) 2) (+ nc1 nc2)))))
                     (let loop3 ((lst lst)
                                 (nc3 (div (- m (+ nc1 nc2)) 2)))
                       (if (< nc3 start)
                           (loop2 lst (- nc2 1))
                           (loop3 (cons (vector nc1 nc2 nc3 (- m (+ nc1 (+ nc2 nc3)))) lst)
                                  (- nc3 1))))))))))
     
     (define (gen n)
       (let* ((n/2 (div n 2))
              (radicals (make-vector (+ n/2 1) '(H))))
         
         (define (rads-of-size n)
           (let loop1 ((ps
                        (three-partitions (- n 1)))
                       (lst
                        '()))
             (if (null? ps)
                 lst
                 (let* ((p (car ps))
                        (nc1 (vector-ref p 0))
                        (nc2 (vector-ref p 1))
                        (nc3 (vector-ref p 2)))
                   (let loop2 ((rads1
                                (vector-ref radicals nc1))
                               (lst
                                (loop1 (cdr ps)
                                       lst)))
                     (if (null? rads1)
                         lst
                         (let loop3 ((rads2
                                      (if (= nc1 nc2)
                                          rads1
                                          (vector-ref radicals nc2)))
                                     (lst
                                      (loop2 (cdr rads1)
                                             lst)))
                           (if (null? rads2)
                               lst
                               (let loop4 ((rads3
                                            (if (= nc2 nc3)
                                                rads2
                                                (vector-ref radicals nc3)))
                                           (lst
                                            (loop3 (cdr rads2)
                                                   lst)))
                                 (if (null? rads3)
                                     lst
                                     (cons (vector 'C
                                                   (car rads1)
                                                   (car rads2)
                                                   (car rads3))
                                           (loop4 (cdr rads3)
                                                  lst))))))))))))
         
         (define (bcp-generator j)
           (if (odd? j)
               '()
               (let loop1 ((rads1
                            (vector-ref radicals (div j 2)))
                           (lst
                            '()))
                 (if (null? rads1)
                     lst
                     (let loop2 ((rads2
                                  rads1)
                                 (lst
                                  (loop1 (cdr rads1)
                                         lst)))
                       (if (null? rads2)
                           lst
                           (cons (vector 'BCP
                                         (car rads1)
                                         (car rads2))
                                 (loop2 (cdr rads2)
                                        lst))))))))
         
         (define (ccp-generator j)
           (let loop1 ((ps
                        (four-partitions (- j 1)))
                       (lst
                        '()))
             (if (null? ps)
                 lst
                 (let* ((p (car ps))
                        (nc1 (vector-ref p 0))
                        (nc2 (vector-ref p 1))
                        (nc3 (vector-ref p 2))
                        (nc4 (vector-ref p 3)))
                   (let loop2 ((rads1
                                (vector-ref radicals nc1))
                               (lst
                                (loop1 (cdr ps)
                                       lst)))
                     (if (null? rads1)
                         lst
                         (let loop3 ((rads2
                                      (if (= nc1 nc2)
                                          rads1
                                          (vector-ref radicals nc2)))
                                     (lst
                                      (loop2 (cdr rads1)
                                             lst)))
                           (if (null? rads2)
                               lst
                               (let loop4 ((rads3
                                            (if (= nc2 nc3)
                                                rads2
                                                (vector-ref radicals nc3)))
                                           (lst
                                            (loop3 (cdr rads2)
                                                   lst)))
                                 (if (null? rads3)
                                     lst
                                     (let loop5 ((rads4
                                                  (if (= nc3 nc4)
                                                      rads3
                                                      (vector-ref radicals nc4)))
                                                 (lst
                                                  (loop4 (cdr rads3)
                                                         lst)))
                                       (if (null? rads4)
                                           lst
                                           (cons (vector 'CCP
                                                         (car rads1)
                                                         (car rads2)
                                                         (car rads3)
                                                         (car rads4))
                                                 (loop5 (cdr rads4)
                                                        lst))))))))))))))
         
         (let loop ((i 1))
           (if (> i n/2)
               (vector (bcp-generator n)
                       (ccp-generator n))
               (begin
                 (vector-set! radicals i (rads-of-size i))
                 (loop (+ i 1)))))))
     
     (define (nb n)
       (let ((x (gen n)))
         (+ (length (vector-ref x 0))
            (length (vector-ref x 1)))))))


(transform PROGRAM)