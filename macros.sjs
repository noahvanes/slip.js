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
        len = nextPowTwo(len);
        var diff = len - (i+1);
        var nops = new Array(diff);
        while(diff--)
          nops[diff] = (makeIdent('nop', #{here}));
        letstx $nop ... = nops;
        letstx $mask = [makeValue(len-1, #{here})];
        return #{
            $(define $lab $nbr) ...
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

export define
export typecheck
export instructions
export goto
export halt