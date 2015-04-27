macro makeLabel {
    
    case {_($lab)} => {
        var label = unwrapSyntax(#{$lab});
        return [makeIdent('_'+label, #{here})];
    }
}

macro instructions { 
    case {
      _ {
        $($tag ... $lab {
            $body ...
          }) ...
      } generate $fun
    } => {
        var len = #{$lab ...}.length;
        var numbers = new Array(len);
        for(var i = 0; i < len;) 
            numbers[i] = (makeValue(i++, #{here}));
        letstx $nbr ... = numbers;
        return #{
            $(define $lab $nbr) ...
            $(function makeLabel($lab)() {
                 $body ...
            }) ...
            function $fun(instr) {
                for(;instr;instr=FUNTAB[instr]());
            }
            var FUNTAB = [$(makeLabel($lab)) (,) ... ];
        }
     }
 } 

//example
instructions {

    test {
      var x = 2;
      return testp;
    }
    
    testp { 
        'nobodyhere'
    }
    
    test2 {
       var y = 3;
       stk.push(test2);
    }
    
    test3 {
       var z = 100;
    }

} generate run
