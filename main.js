// @ts-check
(async () => {
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
    console.log(await getWord());
  }
})();
