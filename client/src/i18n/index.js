// client/src/i18n/index.js
import en from "./en.json";
import hi from "./hi.json";

const messages = { en, hi };

let currentLang = "en";

export function setLanguage(lang) {
  if (messages[lang]) currentLang = lang;
}

export function t(path) {
  const parts = path.split(".");
  let value = messages[currentLang];

  for (const key of parts) {
    if (value && Object.prototype.hasOwnProperty.call(value, key)) {
      value = value[key];
    } else {
      return path;
    }
  }
  return value;
}
