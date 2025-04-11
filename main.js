// @ts-check
(async () => {
  // from https://en.wikipedia.org/w/index.php?title=Morse_code&diff=prev&oldid=1283847196
  // prettier-ignore
  /** @type {Record<string, string[]>} */
  const morseCodeMappings = {'.-': ['a'], '-...': ['b'], '-.-.': ['c'], '-..': ['d'], '.': ['e'], '..-.': ['f'], '--.': ['g'], '....': ['h'], '..': ['i'], '.---': ['j'], '-.-': ['k'], '.-..': ['l'], '--': ['m'], '-.': ['n'], '---': ['o'], '.--.': ['p'], '--.-': ['q'], '.-.': ['r'], '...': ['s'], '-': ['t'], '..-': ['u'], '...-': ['v'], '.--': ['w'], '-..-': ['x'], '-.--': ['y'], '--..': ['z'], '-----': ['0'], '.----': ['1'], '..---': ['2'], '...--': ['3'], '....-': ['4'], '.....': ['5'], '-....': ['6'], '--...': ['7'], '---..': ['8'], '----.': ['9'], '.-.-.-': ['.'], '--..--': [','], '..--..': ['?'], '.----.': ["'"], '-.-.--': ['!'], '-..-.': ['/'], '-.--.-': [')'], '---...': [':'], '-.-.-.': [';'], '-....-': ['-'], '..--.-': ['_'], '.-..-.': ['"'], '...-..-': ['$'], '.--.-.': ['@'], '.--.-': ['à', 'å'], '.-.-': ['ä', 'ą', 'æ'], '-.-..': ['ć', 'ĉ', 'ç'], '----': ['ch', 'ĥ', 'š'], '..-..': ['ð', 'é', 'ę'], '..--.': ['đ'], '.-..-': ['è', 'ł'], '--.-.': ['ĝ'], '.---.': ['ĵ'], '--.--': ['ń', 'ñ'], '---.': ['ó', 'ö', 'ø'], '...-...': ['ś'], '.--..': ['þ'], '..--': ['ü', 'ŭ'], '--..-.': ['ź'], '--..-': ['ż']};
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
    return word === "" ? true : false;
  };

  /** @type {HTMLFormElement | null} */
  const languageSelect = document.querySelector("#language-select");
  const languageDropdown = languageSelect?.querySelector("select");
  const main = document.querySelector("main");
  const mainWord = document.querySelector("#main-word");
  const morsePreview = document.querySelector("#morse-preview");
  /** @type {HTMLButtonElement | null} */
  const done = document.querySelector("#done");
  /** @type {HTMLButtonElement | null} */
  const again = document.querySelector("#again");
  if (
    !languageSelect ||
    !languageDropdown ||
    !main ||
    !mainWord ||
    !morsePreview ||
    !done ||
    !again
  ) {
    throw new Error("Required element doesn't exist");
  }

  const getWord = () => {
    return /** @type {Promise<{ morseCode: string[], again: boolean }>} */ (
      new Promise((resolve) => {
        /** @type {string[]} */
        const word = [];
        let letter = "";
        /** @type {number | null} */
        let lastKeyDown = null;
        /** @type {number | null} */
        let to = null;
        const kd = (/** @type {Event} */ e) => {
          if (
            e.target &&
            /** @type {HTMLElement} */ (e.target).closest("button")
          )
            return;
          e.preventDefault();
          if (!lastKeyDown) lastKeyDown = Date.now();
          if (to) clearInterval(to);
        };
        document.body.addEventListener("keydown", kd);
        document.body.addEventListener("touchstart", kd);
        const ku = (/** @type {Event} */ e) => {
          if (
            e.target &&
            /** @type {HTMLElement} */ (e.target).closest("button")
          )
            return;
          e.preventDefault();
          if (lastKeyDown === null) {
            throw new Error("keyup with lastKeyDown === null");
          }
          const dist = Date.now() - lastKeyDown;
          letter += dist < 250 ? "." : "-";
          lastKeyDown = null;
          morsePreview.textContent =
            [...word, letter].join(" / ") + " (listening)";
          to = setTimeout(() => {
            word.push(letter);
            morsePreview.textContent = word.join(" / ");
            letter = "";
          }, 500);
        };
        document.body.addEventListener("keyup", ku);
        document.body.addEventListener("touchend", ku);
        /** @param {Event} e */
        const cl = (e) => {
          resolve({ morseCode: word, again: e.target === again });
          document.body.removeEventListener("keydown", kd);
          document.body.removeEventListener("keyup", ku);
          morsePreview.textContent = "";
          done.removeEventListener("click", cl);
          again.removeEventListener("click", cl);
        };
        done.addEventListener("click", cl);
        again.addEventListener("click", cl);
      })
    );
  };

  /** @type {string[]} */
  const languages = await (
    await fetch(
      "https://raw.githubusercontent.com/monkeytypegame/monkeytype/refs/heads/master/frontend/static/languages/_list.json"
    )
  ).json();
  languages.forEach((language) => {
    const option = document.createElement("option");
    option.value = language;
    option.textContent = language;
    languageDropdown.append(option);
  });
  await /** @type {Promise<void>} */ (
    new Promise((resolve) =>
      languageSelect.addEventListener("submit", (e) => {
        e.preventDefault();
        if (languageDropdown.value !== "") resolve();
      })
    )
  );
  languageSelect.setAttribute("hidden", "");
  main.removeAttribute("hidden");
  /** @type {string[]} */
  const words = (
    await (
      await fetch(
        `https://raw.githubusercontent.com/monkeytypegame/monkeytype/refs/heads/master/frontend/static/languages/${languageDropdown.value}.json`
      )
    ).json()
  ).words;
  while (true) {
    const word = words[Math.floor(Math.random() * words.length)];
    mainWord.textContent = word;
    while (true) {
      const { morseCode, again } = await getWord();
      const correct = checkMorseCode(morseCode, word);
      alert(
        correct
          ? again
            ? "That was right"
            : "That's right!"
          : again
            ? "Sure, let's try that again!"
            : "Not quite!"
      );
      if (correct && !again) {
        break;
      }
    }
  }
})();
