function SchemeLexer() {

	var program, position, hold;
	var currentChar, currentCat;

	var charTab = new Array(128);
	var data = null;

	//d

	var category = {
		/* 'special' chars */
		end: 0,
		lpr: 1,
		rpr: 2,
		ill: 3,
		quo: 4,
		dqu: 5,
		smc: 6,
		per: 7,
		/* 'normal' chars */ 
		sgn: 8,
		ltr: 9,
		dgt: 10,
		sym: 11,
	}

	var token = {
		END: 0,
		TRU: 1,
		FLS: 2,
		LPR: 3,
		RPR: 4,
		PER: 5,
		NAM: 6,
		STR: 7,
		NBR: 8,
		QUO: 9,
		CHR: 10,
		FLT: 11,
	}

	function setup(str) {

		program = str + '\0';
		position = 0
	}	

	function scan() {

		hold = position;
		currentChar = program.charAt(position++);
		currentCat = charTable[currentChar];

		switch(currentCat) {

			case category.sgn: 
			case category.dgt:
				return scanNumber();

			case category.shr:
				currentChar = program.charAt(position++);
				switch (currentChar) {
					case 't': return token.TRU;
					case 'f': return token.FLS;
					case '(': return token.VCT;
				}

			case category.quo:
				return token.QUO;

			case category.dqo:
				scanString();
				return token.STR;

			case category.
		}

		function scanNumber() {

			currentCat = charTab[program.charAt(position)];
			while (currentCat == category.dgt]) {
				currentCat = charTab[program.charAt(++position)];
			}

			if (currentCat == category.per) {

				do {
					currentChar = program.charAt(++position);
					currentCat = charTab[currentChar];
				} while (currentCat == category.dgt);

				data = parseFloat(program.substring(hold, position));
				return token.FLT;

			} else {

				data = parseInt(prgram.substring(hold, position));
				return token.NBR;
			}
		}

		function scanString() {

			while(program.charAt(position++) != '\"');
			data = program.substring(hold + 1, position - 1);
		}

		function scanSymbol() {

			currentChar = program.charAt(position);
			while(charTab[currentChar] >= category.ltr)
		}

	}

}