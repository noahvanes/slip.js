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

macro instructions {
    case {
      _ {
        $($lab {
            $body ...
          }) ...
      } generate $fun
    } => {
        var len = #{$lab ...}.length;
        var numbers = new Array(len);
        for(var i = 0; i < len; ++i)
            numbers[i] = (makeValue(i, #{here}));
        letstx $nbr ... = numbers;
        letstx $opc = [makeIdent('opc', #{$fun})];
        return #{
            $(define $lab $nbr) ...
            macro goto {
             case {_ $f:expr} => {
                return #{
                    $opc = $f;
                    continue dispatch
                }
              }
            }
            macro halt {
                rule {} => {
                break dispatch
                }
            }
            function $fun($opc) {
                $opc = $opc|0;
                dispatch:
                while(1) {
                    switch($opc|0) {
                        $(case $lab:
                            $body ...) ...
                        }
                    }
                }
            }
        }
    }

export define
export instructions
export typecheck
export goto
export halt
