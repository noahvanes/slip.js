;;========================;;
;;     CEK-simulation     ;;
;;      - Noah Van Es     ;;
;;========================;;

;; 
;; == auxiliary procedures ==
;;

;;map for environments
(define (make-map) '())
(define (extend map s val)
  (cons (cons s val) map))
(define (lookup map symbol)
  (cdr (assoc symbol map)))

;;stack for continuation component
(define (make-stack) '())
(define push cons)
(define top car)
(define pop cdr)
(define empty-stack? null?)

;;continuation frames
(define (continuation-frame-constructor tag)
  (lambda elm (cons tag (list->vector elm))))
(define (continuation-type-checker tag)
  (lambda (frame) (eq? (car frame) tag)))
(define (continuation-frame-getter position)
  (lambda (frame) (vector-ref (cdr frame) position)))

(define OPR-tag 'OPR)
(define OPR-frame (continuation-frame-constructor OPR-tag))
(define OPR-frame? (continuation-type-checker OPR-tag))
(define OPR-closure  (continuation-frame-getter 0))

(define OPD-tag 'OPD)
(define OPD-frame (continuation-frame-constructor OPD-tag))
(define OPD-frame? (continuation-type-checker OPD-tag))
(define OPD-argument (continuation-frame-getter 0))
(define OPD-environment (continuation-frame-getter 1))

;;simple syntax procedures              
(define variable? symbol?)
(define (abstraction? exp)
  (and (pair? exp)  (eq? (car exp) 'λ)))
(define parameter cadr)
(define body caddr)
(define application? list?)
(define operator car)
(define operand cadr)

;;closures
(define closure-tag 'closure)
(define (make-closure exp env) 
  (list closure-tag exp env))
(define (closure? exp)
  (and (pair? exp)
       (eq? (car exp) closure-tag)))
(define closure-lambda cadr)
(define closure-env caddr)

;;values
(define (literal-value? v)
  (or (closure? v)
      (number? v)))

;;
;; == CEK-machine ==
;;

(define (make-CEK C E K) (vector C E K))
(define (c CEK) (vector-ref CEK 0))
(define (e CEK) (vector-ref CEK 1))
(define (k CEK) (vector-ref CEK 2))

(define (final? CEK)
  (and (literal-value? (c CEK))
       (empty-stack? (k CEK))))

(define (successor CEK)
  (define C (c CEK))
  (define E (e CEK))
  (define K (k CEK))
  (cond
    ;;case (1) => variable
    ((variable? C) 
     (make-CEK (lookup E C) E K))
    ;;case (2) => lambda abstraction
    ((abstraction? C) 
     (make-CEK (make-closure C E) E K))
    ;;cases (4) & (5)
    ((literal-value? C)
     (let ((frame (top K))
           (K* (pop K)))
       (cond
         ;;case (4) => evaluate operand
         ((OPD-frame? frame)
          (make-CEK (OPD-argument frame)
                    (OPD-environment frame)
                    (push (OPR-frame C) K*)))
         ;;case (5) => apply function
         ((OPR-frame? frame)
          (let* ((closure (OPR-closure frame))
                 (fun (closure-lambda closure))
                 (env (closure-env closure)))
            (make-CEK (body fun)
                      (extend env (parameter fun) C)
                      K*))))))
    ;;case (3) => application
    ((application? C) 
     (make-CEK (operator C) 
               E 
               (push (OPD-frame (operand C) E) K)))))

(define (evaluate prg)
  (let loop ((state (make-CEK prg (make-map) (make-stack)))
             (count 0))
    ;;print CEK to trace execution
    (display count) (display "/") (newline)
    (display "C = ") (display (c state)) (newline)
    (display "E = ") (display (e state)) (newline)
    (display "K = ") (display (k state)) (newline)
    (newline)
    ;;follow transitions until end
    (if (final? state)
        state
        (loop (successor state) (+ count 1)))))

;;
;; == TESTS ==
;;

(define TRUE `(λ a (λ b a)))
(define FALSE `(λ a (λ b b)))
(define IF '(λ p (λ c (λ a ((p c) a))))) 

(define CAR `(λ p (p ,TRUE)))
(define CDR `(λ p (p ,FALSE)))
(define CONS '(λ a (λ d (λ f ((f a) d)))))

;;let's evaluate ((if true car cdr) (cons 1 2))
(define program `((((,IF ,TRUE) ,CAR) ,CDR) ((,CONS 1) 2)))
           
(define res (evaluate program))
(display "=> ") (display (c res)) 
(newline)