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

(define DESTRUCT
  '(begin
     (define (append-to-tail! x y)
       (if (null? x)
           y
           (let loop ((a x) (b (cdr x)))
             (if (null? b)
                 (begin
                   (set-cdr! a y)
                   x)
                 (loop b (cdr b)))))) 
     (define (destructive n m)
       (let ((l (do ((i 10 (- i 1)) (a '() (cons '() a)))
                  ((= i 0) a))))
         (do ((i n (- i 1)))
           ((= i 0) l)
           (cond ((null? (car l))
                  (do ((l l (cdr l)))
                    ((null? l))
                    (if (null? (car l)) (set-car! l (cons '() '())))
                    (append-to-tail! (car l)
                                     (do ((j m (- j 1)) (a '() (cons '() a)))
                                       ((= j 0) a)))))
                 (else
                  (do ((l1 l (cdr l1)) (l2 (cdr l) (cdr l2)))
                    ((null? l2))
                    (set-cdr! (do ((j (quotient (length (car l2)) 2) (- j 1))
                                   (a (car l2) (cdr a)))
                                ((zero? j) a)
                                (set-car! a i))
                              (let ((n (quotient (length (car l1)) 2)))
                                (cond ((= n 0)
                                       (set-car! l1 '())
                                       (car l1))
                                      (else
                                       (do ((j n (- j 1)) (a (car l1) (cdr a)))
                                         ((= j 1)
                                          (let ((x (cdr a)))
                                            (set-cdr! a '())
                                            x))
                                         (set-car! a i))))))))))))))


(transform DESTRUCT)