// @ts-check
(async () => {
  // from https://en.wikipedia.org/w/index.php?title=Morse_code&diff=prev&oldid=1283847196
  // prettier-ignore
  /** @type {Record<string, string[]>} */
  const morseCodeMappings = {'.-': ['a'], '-...': ['b'], '-.-.': ['c'], '-..': ['d'], '.': ['e'], '..-.': ['f'], '--.': ['g'], '....': ['h'], '..': ['i'], '.---': ['j'], '.-..': ['l'], '--': ['m'], '-.': ['n'], '---': ['o'], '.--.': ['p'], '--.-': ['q'], '.-.': ['r'], '...': ['s'], '-': ['t'], '..-': ['u'], '...-': ['v'], '.--': ['w'], '-..-': ['x'], '-.--': ['y'], '--..': ['z'], '-----': ['0'], '.----': ['1'], '..---': ['2'], '...--': ['3'], '....-': ['4'], '.....': ['5'], '-....': ['6'], '--...': ['7'], '---..': ['8'], '----.': ['9'], '.-.-.-': ['.'], '--..--': [','], '..--..': ['?'], '.----.': ["'"], '-.-.--': ['!'], '-..-.': ['/'], '-.--.-': [')'], '---...': [':'], '-.-.-.': [';'], '-....-': ['-'], '..--.-': ['_'], '.-..-.': ['"'], '...-..-': ['$'], '.--.-.': ['@'], '.--.-': ['à', 'å'], '.-.-': ['ä', 'ą', 'æ'], '-.-..': ['ć', 'ĉ', 'ç'], '----': ['ch', 'ĥ', 'š'], '..-..': ['ð', 'é', 'ę'], '..--.': ['đ'], '.-..-': ['è', 'ł'], '--.-.': ['ĝ'], '.---.': ['ĵ'], '--.--': ['ń', 'ñ'], '---.': ['ó', 'ö', 'ø'], '...-...': ['ś'], '.--..': ['þ'], '..--': ['ü', 'ŭ'], '--..-.': ['ź'], '--..-': ['ż']};
  const checkMorseCode = (
    /** @type {string[]} */ morse,
    /** @type {string} */ word
  ) => {
    for (const letter of morse) {
      if (!(letter in morseCodeMappings)) return false;
      const meaning = morseCodeMappings[letter].find((meaning) =>
        word.startsWith(meaning)
      );
      if (!meaning) return false;
      word = word.slice(meaning.length);
    }
    return true;
  };

  const getWord = () => {
    return new Promise((resolve) => {
      /** @type {string[]} */
      const word = [];
      let letter = "";
      /** @type {number | null} */
      let lastKeyDown = null;
      /** @type {number | null} */
      let to = null;
      const kd = () => {
        if (!lastKeyDown) lastKeyDown = Date.now();
        if (to) clearInterval(to);
      };
      document.body.addEventListener("keydown", kd);
      const ku = () => {
        if (lastKeyDown === null) {
          throw new Error("keyup with lastKeyDown === null");
        }
        const dist = Date.now() - lastKeyDown;
        letter += dist < 250 ? "." : "-";
        lastKeyDown = null;
        to = setTimeout(() => {
          word.push(letter);
          letter = "";
          to = setTimeout(() => {
            resolve(word);
            document.body.removeEventListener("keydown", kd);
            document.body.removeEventListener("keyup", ku);
          }, 250);
        }, 250);
      };
      document.body.addEventListener("keyup", ku);
    });
  };

  while (true) {
    const word = await getWord();
    console.log(checkMorseCode(word, "sos"), checkMorseCode(word, "ä"), word);
  }
})();
