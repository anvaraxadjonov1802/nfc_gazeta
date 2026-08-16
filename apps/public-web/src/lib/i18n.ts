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
  | "nav.issues"
  | "nav.articles"
  | "nav.videos"
  | "nav.about"
  | "nav.search"
  | "nav.searchPlaceholder"
  | "nav.language"
  | "nav.readingMode"
  | "nav.profile"
  | "mode.paper"
  | "mode.paperHint"
  | "mode.warm"
  | "mode.warmHint"
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
  | "articles.eyebrow"
  | "articles.title"
  | "howItWorks.eyebrow"
  | "howItWorks.title"
  | "howItWorks.step1Title"
  | "howItWorks.step1Text"
  | "howItWorks.step2Title"
  | "howItWorks.step2Text"
  | "howItWorks.step3Title"
  | "howItWorks.step3Text"
  | "partners.eyebrow"
  | "partners.title"
  | "testimonials.eyebrow"
  | "testimonials.title"
  | "featured.eyebrow"
  | "featured.title"
  | "featured.lead"
  | "featured.stat1Label"
  | "featured.stat2Label"
  | "featured.stat3Label"
  | "featured.stat4Label"
  | "featured.cta"
  | "video.modalHint"
  | "video.openYoutube"
  | "video.close"
  | "footer.sections"
  | "footer.home"
  | "footer.archive"
  | "footer.accessibility"
  | "footer.nfcTitle"
  | "footer.nfcText"
  | "footer.rights"
  | "footer.official"
  | "footer.editorInChief"
  | "footer.dutyEditor"
  | "footer.proofreader"
  | "footer.photoCorrespondent"
  | "footer.layoutDesigner"
  | "footer.founders"
  | "footer.address"
  | "footer.phone"
  | "footer.registration"
  | "footer.masthead"
  | "footer.issueLabel";

type Dictionary = Record<TranslationKey, string>;

const uz: Dictionary = {
  "nav.home": "Bosh sahifa",
  "nav.archive": "Gazeta arxivi",
  "nav.issues": "Nashrlar",
  "nav.articles": "Maqolalar",
  "nav.videos": "Videolar",
  "nav.about": "Biz haqimizda",
  "nav.search": "Qidiruv",
  "nav.searchPlaceholder": "Maqola yoki gazeta izlash...",
  "nav.language": "Til",
  "nav.readingMode": "O‘qish rejimi",
  "nav.profile": "Profil",
  "mode.paper": "Qog‘oz",
  "mode.paperHint": "Standart, och qaymoq fon",
  "mode.warm": "Iliq qog‘oz",
  "mode.warmHint": "Kindle uslubidagi yumshoq fon",
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
  "articles.eyebrow": "So‘nggi materiallar",
  "articles.title": "Maqolalar va tahlillar",
  "howItWorks.eyebrow": "Qanday ishlaydi",
  "howItWorks.title": "NFC orqali 3 qadamda",
  "howItWorks.step1Title": "NFC belgisini toping",
  "howItWorks.step1Text": "Bosma gazeta muqovasidagi NFC stikerini toping — u har bir sonda bor.",
  "howItWorks.step2Title": "Telefon bilan teging",
  "howItWorks.step2Text": "Telefoningizni stikerga yaqinlashtiring, ilova shart emas — brauzer avtomatik ochiladi.",
  "howItWorks.step3Title": "O‘qing va tinglang",
  "howItWorks.step3Text": "Gazetani varaqlab o‘qing, matn rejimiga o‘ting yoki audio shaklda tinglang.",
  "partners.eyebrow": "Hamkorlar",
  "partners.title": "Biz bilan ishlaydiganlar",
  "testimonials.eyebrow": "Fikr-mulohazalar",
  "testimonials.title": "O‘quvchilar bizni shunday baholaydi",
  "featured.eyebrow": "Uzoq kutilgan orzu",
  "featured.title": "“Jaloliddin Manguberdi” Toshkent — Xivaga yo‘l oldi",
  "featured.lead": "Joriy yilning 5 may kunidan boshlab xalqimiz uzoq kutgan yuqori tezlikda harakatlanuvchi zamonaviy “Jaloliddin Manguberdi” yo‘lovchi poyezdi “Toshkent-Markaziy” vokzalidan Xorazm viloyatining Xiva shahriga ilk qatnovini rasman boshladi. 1022 kilometrlik masofa endi 7 yarim soatda bosib o‘tilmoqda — avvalgi 14 soat o‘rniga.",
  "featured.stat1Label": "km/soat tezlik",
  "featured.stat2Label": "soatda Xivaga",
  "featured.stat3Label": "o‘rinli, 7 vagon",
  "featured.stat4Label": "km Toshkent — Xiva",
  "featured.cta": "To‘liq maqolani o‘qish",
  "video.modalHint": "Yopish uchun ESC tugmasini bosing",
  "video.openYoutube": "YouTube’da ochish",
  "video.close": "Yopish",
  "footer.sections": "Asosiy bo‘limlar",
  "footer.home": "Bosh sahifa",
  "footer.archive": "Gazeta arxivi",
  "footer.accessibility": "Maxsus imkoniyatlar",
  "footer.nfcTitle": "NFC gazeta tizimi",
  "footer.nfcText": "Bosma gazetadagi NFC stikerga telefonni yaqinlashtiring va aynan o‘sha elektron sonni oching.",
  "footer.rights": "Barcha huquqlar himoyalangan.",
  "footer.official": "Rasmiy elektron nashr",
  "footer.editorInChief": "Bosh muharrir",
  "footer.dutyEditor": "Navbatchi muharrir",
  "footer.proofreader": "Musahhih",
  "footer.photoCorrespondent": "Fotomuxbir",
  "footer.layoutDesigner": "Sahifalovchi",
  "footer.founders": "Muassislar",
  "footer.address": "Manzil",
  "footer.phone": "Telefon",
  "footer.registration": "Ro‘yxatga olingan",
  "footer.masthead": "Tahririyat",
  "footer.issueLabel": "Maxsus son",
};

const ru: Dictionary = {
  "nav.home": "Главная",
  "nav.archive": "Архив газеты",
  "nav.issues": "Номера",
  "nav.articles": "Статьи",
  "nav.videos": "Видео",
  "nav.about": "О нас",
  "nav.search": "Поиск",
  "nav.searchPlaceholder": "Поиск статьи или номера...",
  "nav.language": "Язык",
  "nav.readingMode": "Режим чтения",
  "nav.profile": "Профиль",
  "mode.paper": "Бумага",
  "mode.paperHint": "Стандартный кремовый фон",
  "mode.warm": "Тёплая бумага",
  "mode.warmHint": "Мягкий фон в стиле Kindle",
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
  "articles.eyebrow": "Последние материалы",
  "articles.title": "Статьи и аналитика",
  "howItWorks.eyebrow": "Как это работает",
  "howItWorks.title": "NFC за 3 шага",
  "howItWorks.step1Title": "Найдите метку NFC",
  "howItWorks.step1Text": "Найдите NFC-стикер на обложке печатной газеты — он есть в каждом номере.",
  "howItWorks.step2Title": "Поднесите телефон",
  "howItWorks.step2Text": "Поднесите телефон к стикеру, приложение не требуется — браузер откроется автоматически.",
  "howItWorks.step3Title": "Читайте и слушайте",
  "howItWorks.step3Text": "Листайте газету, переключитесь в текстовый режим или слушайте аудиоверсию.",
  "partners.eyebrow": "Партнёры",
  "partners.title": "С нами работают",
  "testimonials.eyebrow": "Отзывы",
  "testimonials.title": "Читатели оценивают нас так",
  "featured.eyebrow": "Долгожданная мечта",
  "featured.title": "«Жалолиддин Мангуберди» отправился в Ташкент — Хиву",
  "featured.lead": "С 5 мая этого года долгожданный современный скоростной поезд «Жалолиддин Мангуберди» официально начал курсировать от вокзала «Ташкент-Марказий» до города Хива Хорезмской области. Расстояние в 1022 км теперь преодолевается за 7,5 часов вместо прежних 14.",
  "featured.stat1Label": "км/ч скорость",
  "featured.stat2Label": "часов до Хивы",
  "featured.stat3Label": "мест, 7 вагонов",
  "featured.stat4Label": "км Ташкент — Хива",
  "featured.cta": "Читать статью полностью",
  "video.modalHint": "Нажмите ESC, чтобы закрыть",
  "video.openYoutube": "Открыть на YouTube",
  "video.close": "Закрыть",
  "footer.sections": "Основные разделы",
  "footer.home": "Главная",
  "footer.archive": "Архив газеты",
  "footer.accessibility": "Специальные возможности",
  "footer.nfcTitle": "Система NFC-газеты",
  "footer.nfcText": "Поднесите телефон к NFC-стикеру на печатной газете, чтобы открыть именно этот электронный номер.",
  "footer.rights": "Все права защищены.",
  "footer.official": "Официальное электронное издание",
  "footer.editorInChief": "Главный редактор",
  "footer.dutyEditor": "Дежурный редактор",
  "footer.proofreader": "Корректор",
  "footer.photoCorrespondent": "Фотокорреспондент",
  "footer.layoutDesigner": "Верстальщик",
  "footer.founders": "Учредители",
  "footer.address": "Адрес",
  "footer.phone": "Телефон",
  "footer.registration": "Зарегистрировано",
  "footer.masthead": "Редакция",
  "footer.issueLabel": "Спецвыпуск",
};

const en: Dictionary = {
  "nav.home": "Home",
  "nav.archive": "Newspaper archive",
  "nav.issues": "Issues",
  "nav.articles": "Articles",
  "nav.videos": "Videos",
  "nav.about": "About us",
  "nav.search": "Search",
  "nav.searchPlaceholder": "Search an article or issue...",
  "nav.language": "Language",
  "nav.readingMode": "Reading mode",
  "nav.profile": "Profile",
  "mode.paper": "Paper",
  "mode.paperHint": "Standard cream background",
  "mode.warm": "Warm paper",
  "mode.warmHint": "Soft Kindle-style background",
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
  "articles.eyebrow": "Latest material",
  "articles.title": "Articles & analysis",
  "howItWorks.eyebrow": "How it works",
  "howItWorks.title": "NFC in 3 steps",
  "howItWorks.step1Title": "Find the NFC tag",
  "howItWorks.step1Text": "Find the NFC sticker on the printed issue's cover — every issue has one.",
  "howItWorks.step2Title": "Tap your phone",
  "howItWorks.step2Text": "Tap your phone on the sticker, no app needed — your browser opens automatically.",
  "howItWorks.step3Title": "Read and listen",
  "howItWorks.step3Text": "Flip through the issue, switch to text mode, or listen to the audio version.",
  "partners.eyebrow": "Partners",
  "partners.title": "Who we work with",
  "testimonials.eyebrow": "Feedback",
  "testimonials.title": "What readers say",
  "featured.eyebrow": "The long-awaited dream",
  "featured.title": "“Jaloliddin Manguberdi” now runs Tashkent — Khiva",
  "featured.lead": "Starting May 5 this year, the long-awaited modern high-speed “Jaloliddin Manguberdi” passenger train officially began service from Tashkent-Markaziy station to the city of Khiva in the Khorezm region. The 1,022-kilometre distance is now covered in 7.5 hours — down from the previous 14.",
  "featured.stat1Label": "km/h top speed",
  "featured.stat2Label": "hours to Khiva",
  "featured.stat3Label": "seats, 7 carriages",
  "featured.stat4Label": "km Tashkent — Khiva",
  "featured.cta": "Read the full story",
  "video.modalHint": "Press ESC to close",
  "video.openYoutube": "Open on YouTube",
  "video.close": "Close",
  "footer.sections": "Main sections",
  "footer.home": "Home",
  "footer.archive": "Newspaper archive",
  "footer.accessibility": "Accessibility",
  "footer.nfcTitle": "NFC newspaper system",
  "footer.nfcText": "Tap your phone on the NFC sticker in the printed newspaper to open that exact digital issue.",
  "footer.rights": "All rights reserved.",
  "footer.official": "Official digital edition",
  "footer.editorInChief": "Editor-in-chief",
  "footer.dutyEditor": "Duty editor",
  "footer.proofreader": "Proofreader",
  "footer.photoCorrespondent": "Photo correspondent",
  "footer.layoutDesigner": "Layout designer",
  "footer.founders": "Founders",
  "footer.address": "Address",
  "footer.phone": "Phone",
  "footer.registration": "Registered",
  "footer.masthead": "Masthead",
  "footer.issueLabel": "Special issue",
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
