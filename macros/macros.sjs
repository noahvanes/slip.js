macro define {
     rule { $nam $val } =>
        { macro $nam {
           rule {} => {$val}
          }
        }
}

macro def {
    rule { $nam $val } => {
         define $nam $val
         export $nam
       }
}

macro typecheck {
    case { typecheck $t => $fun } => {
       letstx $tag = [makeIdent('tag', #{$t})];
       return #{function $fun(x) {
          x = x|0;
          return (($tag(x)|0) == $t)|0;
        }
      }
  }
}

export define
export typecheck

/* -- POINTER STRUCTURES -- */
def __PAIR_TAG__ 0x00
def __VECTOR_TAG__ 0x02
def __PROCEDURE_TAG__ 0x04
def __SEQUENCE_TAG__ 0x06
def __IFS_TAG__ 0x08
def __IFF_TAG__ 0x0A
def __DFV_TAG__ 0x0C
def __DFF_TAG__ 0x0E
def __APPLICATION_TAG__ 0x10
def __LAMBDA_TAG__ 0x12
def __SET_TAG__ 0x14
def __QUO_TAG__ 0x16

/* -- RAW CHUNKS -- */
def __FLOAT_TAG__ 0x01
def __SYMBOL_TAG__ 0x03
def __STRING_TAG__ 0x05

/* -- IMMEDIATES -- */
//(tags > maxTag = 0x3f)
def __CHAR_TAG__ 0x40
def __TRUE_TAG__ 0x41
def __FALSE_TAG__ 0x42
def __VOID_TAG__ 0x43
def __NULL_TAG__ 0x44
def __NUMBER_TAG__ 0x45
def __NATIVE_TAG__ 0x46

/* -- CONSTANT VALUES -- */
def __FALSE__ 0x7ffffff9
def __TRUE__ 0x7ffffffb
def __NULL__ 0x7ffffffd
def __VOID__ 0x7fffffff