function parseAPL(str, mode) {
  let regC = '0';
  let fnsC = '1'; let fns = "^⌹⍳⍴!%*+,-<=>?|~⊢⊣⌷≤≥≠∨∧÷×∊↑↓○⌈⌊⊂⊃∩∪⊥⊤⍱⍲⍒⍋⍉⌽⊖⍟⍕⍎⍪≡≢⍷⍸⊆⊇⍧⍮√ϼ…";
  let mopC = '2'; let mop = "¨⍨⌸⍁⍩ᑈᐵ⌶/\\";
  let dopC = '3'; let dop = ".@∘⌺⍫⍣⍢⍤⍛⍡⍥";
  let namC = '4'; let nam = "⎕⍞∆⍙ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_";
  let digC = '5'; let dig = "0123456789";
  let arrC = '5'; let arr = "⍬";
  let dfnC = '6'; let dfn = "⍺⍵⍶⍹∇{}";
  let strC = '7'; // '' ""
  let dmdC = 'D'; let dmd = "⋄←→";
  let comC = 'C'; // ⍝
  if (mode=='dzaima') fns+= "⌿⍀";
  else                mop+= "⌿⍀";
  if (!window.APLStyle) {
    let s = document.createElement("style");
    s.id = "APLStyle";
    s.innerText=`
      .A${regC} { color: #D2D2D2; }
      .A${namC} { color: #D2D2D2; }
      .A${comC} { color: #BBBBBB; }
      .A${digC} { color: #AA88BB; }
      .A${arrC} { color: #DD99FF; }
      .A${dmdC} { color: #FFFF00; }
      .A${strC} { color: #DDAAEE; }
      .A${fnsC} { color: #00FF00; }
      .A${mopC} { color: #FF9955; }
      .A${dopC} { color: #FFDD66; }
      .A${dfnC} { color: #AA77BB; }
    `;
    document.body.appendChild(s);
  }
  // let unkC = 9; let unk = "⍇⍂⊙⌻⌼⍃⍄⍅⍆⍈⍊⍌⍍⍏⍐⍑⍓⍔⍖⍗⍘⍚⍜⍠⍦⍭⍯⍰‽⊗∍⋾";
  let res = new Array(str.length).fill();
  res[0] = regC;
  for (let i = 0; i < str.length; ) {
    let p = str[i-1]||'\0';
    let c = str[i  ];
    let n = str[i+1]||'\0';
         if (fns.includes(c)) res[i] = fnsC;
    else if (mop.includes(c)) res[i] = mopC;
    else if (dop.includes(c)) res[i] = dopC;
    else if (dfn.includes(c)) res[i] = dfnC;
    else if (arr.includes(c)) res[i] = arrC;
    else if (dmd.includes(c)) res[i] = dmdC;
    else if ((c==')' || c==']') && /^\s+$/.test(str.substring(str.lastIndexOf('\n', i),i))) {
      res[i] = regC;
      while(str[i]) {
        i++;
        if (str[i]=='\n') break;
        if (str[i]=='"') { res[i] = strC; i++; while(str[i] && str[i]!='"') i++; res[i+1] = regC; }
        if (str[i]=="'") { res[i] = strC; i++; while(str[i] && str[i]!="'") i++; res[i+1] = regC; }
      }
    }
    else if (dig.includes(c) || c=='.'&&dig.includes(n)) {
      res[i] = digC;
      while(dig.includes(str[i]) || str[i]=='e' || str[i]=='E' || str[i]=='.') i++;
      continue;
    }
    else if (nam.includes(c)) {
      res[i] = namC;
      while(nam.includes(str[i]) || dig.includes(str[i])) i++;
      continue;
    }
    else if (c=="'") {
      res[i] = strC; i++;
      while(str[i] && str[i]!="'" && str[i]!='\n') i++;
    }
    else if (c=='"') {
      res[i] = strC; i++;
      while(str[i] && str[i]!='"' && str[i]!='\n') i+= str[i]=='\\'? 2 : 1;
    }
    else if (c=='⍝') {
      res[i] = comC;
      while(str[i] && str[i]!='\n') i++;
    }
    else if (!' \n\t'.includes(c)) res[i] = regC;
    i++;
  }
  return res;
}
langs.APL = (mode='dyalog') => {
  let str = main.value;
  colorCode(str, parseAPL(str, mode), 'A');
}