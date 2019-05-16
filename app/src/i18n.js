import i18n from 'i18n-js';
import {defaultLocale} from '../../app.json';

const translations = {
  en: () => require("./translations/en.json"),
  ru: () => require("./translations/ru.json"),
}

i18n.fallbacks = true;
i18n.translations = {[defaultLocale]: translations[defaultLocale]()};
i18n.locale = defaultLocale;
i18n.missingTranslation = (name) => name;

export default i18n;
