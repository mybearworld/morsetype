// @ts-check
(async () => {
  const getWord = () => {
    return new Promise((resolve) => {
      let word = "";
      /** @type {number | null} */
      let lastKeyDown = null;
      /** @type {number | null} */
      let iv = null;
      const kd = () => {
        if (!lastKeyDown) lastKeyDown = Date.now();
        if (iv) clearInterval(iv);
      };
      document.body.addEventListener("keydown", kd);
      const ku = () => {
        if (lastKeyDown === null) {
          throw new Error("keyup with lastKeyDown === null");
        }
        const dist = Date.now() - lastKeyDown;
        word += dist < 250 ? "." : "-";
        lastKeyDown = null;
        iv = setInterval(() => {
          resolve(word);
          document.body.removeEventListener("keydown", kd);
          document.body.removeEventListener("keyup", ku);
        }, 500);
      };
      document.body.addEventListener("keyup", ku);
    });
  };

  while (true) {
    console.log(await getWord());
  }
})();
