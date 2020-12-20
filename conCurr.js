function parsecnc(str) {
  const regC = "0";
  const fnsC = "1";
  /*
   const functions = ["[&|*+/]", "-", "cons", "l", "r", ""];
   */
  const prnC = "2";
  const parens = "()$";
  const braces = "{}";
  const brkC = "3";
  const brackets = "[]:";
  const namC = "4";
  const digC = "5";
  const digits = "1234567890.";
  const cm2C = "6";
  const escC = "7";
  const strC = "8";
  const modC = "D";
  const comC = "C";
  const metachars = '\t\n# :])}"\\';
  if (!window.cncStyle) {
    const s = document.createElement("style");
    s.id = "cncStyle";
    s.innerText = `
      body.dt .A${regC} { color: #D2D2D2; }  body.lt .A${regC} { color: #000000; }
      body.dt .A${namC} { color: #D2D2D2; }  body.lt .A${namC} { color: #000000; }
      body.dt .A${comC} { color: #999999; }  body.lt .A${comC} { color: #656565; }
      body.dt .A${digC} { color: #EEFFDD; }  body.lt .A${digC} { color: #332211; }
      body.dt .A${cm2C} { color: #887777; }  body.lt .A${cm2C} { color: #777788; }
      body.dt .A${modC} { color: #FFFF00; }  body.lt .A${modC} { color: #0000FF; }
      body.dt .A${strC} { color: #DDAAEE; }  body.lt .A${strC} { color: #772299; }
      body.dt .A${fnsC} { color: #00FF00; }  body.lt .A${fnsC} { color: #D73A49; }
      body.dt .A${brkC} { color: #FF9955; }  body.lt .A${brkC} { color: #ED5F00; }
      body.dt .A${prnC} { color: #FFDD66; }  body.lt .A${prnC} { color: #C82C00; }
      body.dt .A${escC} { color: #AA77BB; }  body.lt .A${escC} { color: #A906D4; }
    `;
    document.body.appendChild(s);
  }
  const res = new Array(str.length).fill();

  let comment = 0;
  let linecomment = false;
  let string = 0;

  let col = (i, c) => {
    if (res[i - 1] !== c) {
      res[i] = c;
    }
  };

  for (let i = 0; i < str.length; i++) {
    if (res[i] === fnsC || res[i] === modC) {
      continue;
    }
    if (str[i] === ":" && "($[:".includes(str[i - 1])) {
      res[i] = escC;
    } else if (
      str[i] === "!" &&
      str[i + 1] === "#" &&
      comment &&
      !linecomment
    ) {
      comment--;
      col(i, comC);
      i++;
    } else if (str[i] === "#") {
      col(i, comC);
      if (!linecomment) {
        comment++;
        if (str[i + 1] === "!") {
          res[++i] = comC;
          continue;
        } else {
          linecomment = true;
        }
      }
    } else if (comment > 0) {
      col(i, comment > 1 ? cm2C : comC);
      if (linecomment) {
        if (str[i] === "\n") {
          linecomment = false;
          comment--;
        }
      } else if (str[i] === "#") {
        if (str[i - 1] === "!") comment--;
      }
    } else if (string) {
      col(i, strC);

      if (string === 1) {
        // \ backslash
        if (metachars.includes(str[i])) {
          string = 0;
          i--;
          continue;
        }
      } else {
        if (str[i] === "\\") {
          col(i, escC);
          res[++i] = escC;
          continue;
        } else if (str[i] === '"') {
          string = 0;
        }
      }
    } else if (parens.includes(str[i])) {
      col(i, prnC);
    } else if (brackets.includes(str[i])) {
      col(i, brkC);
    } else if (braces.includes(str[i])) {
      col(i, escC);
    } else if (str[i] === '"') {
      col(i, strC);
      string = 2;
    } else if (str[i] === "\\") {
      col(i, strC);
      string = 1;
    } else if (digits.includes(str[i])) {
      col(i, digC);
    } else {
      col(i, regC);
    }
  }

  return res;
}
langs.cnc = () => {
  try {
    let str = main.value;
    genc.innerHTML = colorCode(str, parsecnc(str), "A");
  } catch (e) {
    console.log(e);
  }
};

htmlgen.cnc = (str, ...lang) => colorCode(str, parsecnc(str, lang), "B");
