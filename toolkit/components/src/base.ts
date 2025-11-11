import { Css } from "css/Css";

const sheet = new CSSStyleSheet();
sheet.replaceSync(
  new Css({
    body: {
      margin: "0",
      padding: "0",
      container: "section / inline-size",
    },
  }).toString()
);

document.adoptedStyleSheets = [sheet];
