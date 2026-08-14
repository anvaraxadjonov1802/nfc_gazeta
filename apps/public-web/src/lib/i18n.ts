export type Locale = "uz" | "ru" | "en";

export const LOCALES: {
  code: Locale;
  label: string;
  shortLabel: string;
}[] = [
  { code: "uz", label: "O‘zbekcha", shortLabel: "UZ" },
  { code: "ru", label: "Русский", shortLabel: "RU" },
  { code: "en", label: "English", shortLabel: "EN" },
];

export const DEFAULT_LOCALE: Locale = "uz";

type TranslationKey =
  | "nav.home"
  | "nav.archive"
  | "nav.search"
  | "nav.searchPlaceholder"
  | "nav.language"
  | "nav.readingMode"
  | "nav.profile"
  | "mode.paper"
  | "mode.paperHint"
  | "mode.white"
  | "mode.whiteHint"
  | "mode.night"
  | "mode.nightHint"
  | "profile.title"
  | "profile.namePlaceholder"
  | "profile.nameHint"
  | "profile.guest"
  | "profile.statsIssues"
  | "profile.statsPages"
  | "profile.statsStreak"
  | "profile.continueReading"
  | "profile.continueReadingEmpty"
  | "profile.pageOf"
  | "profile.continueLink"
  | "profile.archive"
  | "profile.settings"
  | "profile.help"
  | "profile.accessibility"
  | "profile.close"
  | "banner.tag"
  | "banner.title"
  | "banner.subtitle"
  | "carousel.eyebrow"
  | "carousel.title"
  | "carousel.viewAll"
  | "media.eyebrow"
  | "media.title"
  | "media.watch"
  | "media.videoBadge"
  | "footer.sections"
  | "footer.home"
  | "footer.archive"
  | "footer.accessibility"
  | "footer.nfcTitle"
  | "footer.nfcText"
  | "footer.rights"
  | "footer.official";

type Dictionary = Record<TranslationKey, string>;

const uz: Dictionary = {
  "nav.home": "Bosh sahifa",
  "nav.archive": "Gazeta arxivi",
  "nav.search": "Qidiruv",
  "nav.searchPlaceholder": "Maqola yoki gazeta izlash...",
  "nav.language": "Til",
  "nav.readingMode": "O‘qish rejimi",
  "nav.profile": "Profil",
  "mode.paper": "Qaymoq",
  "mode.paperHint": "Ko‘zga yumshoq, gazeta uslubi",
  "mode.white": "Oq fon",
  "mode.whiteHint": "Klassik, yorqin fon",
  "mode.night": "Tungi rejim",
  "mode.nightHint": "Qorong‘uda qulay o‘qish",
  "profile.title": "Profil",
  "profile.namePlaceholder": "Ismingizni kiriting",
  "profile.nameHint": "Bu qurilmada mahalliy saqlanadi",
  "profile.guest": "Mehmon",
  "profile.statsIssues": "o‘qilgan son",
  "profile.statsPages": "bet o‘qildi",
  "profile.statsStreak": "kunlik seriya",
  "profile.continueReading": "O‘qishni davom ettirish",
  "profile.continueReadingEmpty": "Hali hech qanday gazeta ochilmagan.",
  "profile.pageOf": "bet",
  "profile.continueLink": "davom ettirish",
  "profile.archive": "Gazeta arxivi",
  "profile.settings": "Sozlamalar",
  "profile.help": "Yordam",
  "profile.accessibility": "Maxsus imkoniyatlar",
  "profile.close": "Yopish",
  "banner.tag": "Maxsus son",
  "banner.title": "2026 — yubiley soni",
  "banner.subtitle": "Tez orada maxsus animatsiyali banner shu yerda joylashadi",
  "carousel.eyebrow": "Elektron arxivdan",
  "carousel.title": "So‘nggi sonlar",
  "carousel.viewAll": "Barchasini ko‘rish",
  "media.eyebrow": "Ko‘rish va o‘qish",
  "media.title": "Maqolalar va videolar",
  "media.watch": "Videoni ko‘rish",
  "media.videoBadge": "Video",
  "footer.sections": "Asosiy bo‘limlar",
  "footer.home": "Bosh sahifa",
  "footer.archive": "Gazeta arxivi",
  "footer.accessibility": "Maxsus imkoniyatlar",
  "footer.nfcTitle": "NFC gazeta tizimi",
  "footer.nfcText": "Bosma gazetadagi NFC stikerga telefonni yaqinlashtiring va aynan o‘sha elektron sonni oching.",
  "footer.rights": "Barcha huquqlar himoyalangan.",
  "footer.official": "Rasmiy elektron nashr",
};

const ru: Dictionary = {
  "nav.home": "Главная",
  "nav.archive": "Архив газеты",
  "nav.search": "Поиск",
  "nav.searchPlaceholder": "Поиск статьи или номера...",
  "nav.language": "Язык",
  "nav.readingMode": "Режим чтения",
  "nav.profile": "Профиль",
  "mode.paper": "Кремовый",
  "mode.paperHint": "Комфортно для глаз, газетный стиль",
  "mode.white": "Белый фон",
  "mode.whiteHint": "Классический, яркий фон",
  "mode.night": "Ночной режим",
  "mode.nightHint": "Удобно читать в темноте",
  "profile.title": "Профиль",
  "profile.namePlaceholder": "Введите имя",
  "profile.nameHint": "Сохраняется локально на этом устройстве",
  "profile.guest": "Гость",
  "profile.statsIssues": "номеров прочитано",
  "profile.statsPages": "страниц прочитано",
  "profile.statsStreak": "дней подряд",
  "profile.continueReading": "Продолжить чтение",
  "profile.continueReadingEmpty": "Вы ещё не открывали ни одной газеты.",
  "profile.pageOf": "стр.",
  "profile.continueLink": "продолжить",
  "profile.archive": "Архив газеты",
  "profile.settings": "Настройки",
  "profile.help": "Помощь",
  "profile.accessibility": "Специальные возможности",
  "profile.close": "Закрыть",
  "banner.tag": "Спецвыпуск",
  "banner.title": "2026 — юбилейный номер",
  "banner.subtitle": "Скоро здесь появится анимированный баннер",
  "carousel.eyebrow": "Из электронного архива",
  "carousel.title": "Последние номера",
  "carousel.viewAll": "Смотреть все",
  "media.eyebrow": "Смотреть и читать",
  "media.title": "Статьи и видео",
  "media.watch": "Смотреть видео",
  "media.videoBadge": "Видео",
  "footer.sections": "Основные разделы",
  "footer.home": "Главная",
  "footer.archive": "Архив газеты",
  "footer.accessibility": "Специальные возможности",
  "footer.nfcTitle": "Система NFC-газеты",
  "footer.nfcText": "Поднесите телефон к NFC-стикеру на печатной газете, чтобы открыть именно этот электронный номер.",
  "footer.rights": "Все права защищены.",
  "footer.official": "Официальное электронное издание",
};

const en: Dictionary = {
  "nav.home": "Home",
  "nav.archive": "Newspaper archive",
  "nav.search": "Search",
  "nav.searchPlaceholder": "Search an article or issue...",
  "nav.language": "Language",
  "nav.readingMode": "Reading mode",
  "nav.profile": "Profile",
  "mode.paper": "Cream",
  "mode.paperHint": "Easy on the eyes, newspaper style",
  "mode.white": "White",
  "mode.whiteHint": "Classic, bright background",
  "mode.night": "Night mode",
  "mode.nightHint": "Comfortable reading in the dark",
  "profile.title": "Profile",
  "profile.namePlaceholder": "Enter your name",
  "profile.nameHint": "Saved locally on this device",
  "profile.guest": "Guest",
  "profile.statsIssues": "issues read",
  "profile.statsPages": "pages read",
  "profile.statsStreak": "day streak",
  "profile.continueReading": "Continue reading",
  "profile.continueReadingEmpty": "You haven't opened any issue yet.",
  "profile.pageOf": "p.",
  "profile.continueLink": "continue",
  "profile.archive": "Newspaper archive",
  "profile.settings": "Settings",
  "profile.help": "Help",
  "profile.accessibility": "Accessibility",
  "profile.close": "Close",
  "banner.tag": "Special issue",
  "banner.title": "2026 — anniversary issue",
  "banner.subtitle": "An animated banner will appear here soon",
  "carousel.eyebrow": "From the digital archive",
  "carousel.title": "Latest issues",
  "carousel.viewAll": "View all",
  "media.eyebrow": "Watch and read",
  "media.title": "Articles and videos",
  "media.watch": "Watch video",
  "media.videoBadge": "Video",
  "footer.sections": "Main sections",
  "footer.home": "Home",
  "footer.archive": "Newspaper archive",
  "footer.accessibility": "Accessibility",
  "footer.nfcTitle": "NFC newspaper system",
  "footer.nfcText": "Tap your phone on the NFC sticker in the printed newspaper to open that exact digital issue.",
  "footer.rights": "All rights reserved.",
  "footer.official": "Official digital edition",
};

export const dictionaries: Record<Locale, Dictionary> = {
  uz,
  ru,
  en,
};

export function translate(
  locale: Locale,
  key: TranslationKey,
): string {
  return dictionaries[locale]?.[key] ?? dictionaries[DEFAULT_LOCALE][key];
}

export type { TranslationKey };
