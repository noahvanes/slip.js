macro define {
     rule { $nam $val } =>
        { macro $nam {
           rule {} => {$val}
          }
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

macro makeLabel {
    case {_($lab)} => {
        var label = unwrapSyntax(#{$lab});
        return [makeIdent('_'+label, #{here})];
    }
}

macro defun {
    rule {$f $v} => {
        macro $f {
          rule {()} => {makeLabel($f)()|0}
          rule {} => {$v}
        }
    }
}

macro instructions {
    case {
      _ {
        $($lab {
            $body ...
          }) ...
      } generate $fun
    } => {
        function nextPowTwo(x) {
          var current = 1;
          while(current < x)
            current = current<<1;
          return current;
        }
        var len = #{$lab ...}.length;
        var numbers = new Array(len);
        for(var i = 0; i < len;)
            numbers[i] = (makeValue(++i, #{here}));
        letstx $nbr ... = numbers;
        len = nextPowTwo(len+1);
        var diff = len - (i+1);
        var nops = new Array(diff);
        while(diff--)
          nops[diff] = (makeIdent('nop', #{here}));
        letstx $nop ... = nops;
        letstx $mask = [makeValue(len-1, #{here})];
        return #{
            $(defun $lab $nbr) ...
            $(function makeLabel($lab)() {
                 $body ...
            }) ...
            function nop() { halt; }
            function $fun(instr) {
                instr = instr|0;
                for(;instr;instr=FUNTAB[instr&$mask]()|0);
            }
            var FUNTAB = [nop, $(makeLabel($lab)) (,) ..., $nop (,) ...];
        }
     }
 }

macro goto {
    rule {$f} => {return $f}
}

macro halt {
    rule {} => {return 0}
}

macro struct {
    case {
            _ $nam {
                $($prop => $funs (,) ...) (;) ...
            } as $tag
        }
        =>
        {
            var siz = #{$prop ...}.length;
            letstx $siz = [makeValue(siz, #{here})];
            var idxs = new Array(siz);
            for(var i = 0; i < siz; ++i)
                idxs[i] = makeValue(((i+1)<<2), #{here});
            letstx $idx ... = idxs;
            letstx $ctor = [makeIdent('makeChunk', #{$nam})];
            letstx $s = [makeIdent('chunkSet', #{$nam})];
            return #{
                function $nam($prop (,) ...) {
                   $($prop = $prop|0) (;) ...
                   var chk = 0;
                   chk = $ctor($tag, $siz)|0;
                   $($s(chk, $idx, $prop)) (;) ...
                   return chk|0;
                }
                $(generate $funs (,) ... => $idx) ...
            }
        }
}

macro generate {
    case { _ $get => $idx }
        => { 
          letstx $g = [makeIdent('chunkGet', #{$get})];
          return #{ 
            function $get(chk) {
                chk = chk|0;
                return $g(chk, $idx)|0
            }}
          }
    case { _ $get, $set => $idx }
        => { 
            letstx $g = [makeIdent('chunkGet', #{$get})];
            letstx $s = [makeIdent('chunkSet', #{$set})];
            return #{
              function $get(chk) {
                chk = chk|0;
                return $g(chk, $idx)|0
              }
              function $set(chk, val) {
                chk = chk|0;
                val = val|0;
                $s(chk, $idx, val)
            }
           }
          }
}

export define
export typecheck
export instructions
export goto
export halt
export struct
