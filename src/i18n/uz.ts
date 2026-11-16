/**
 * Uzbek UI strings — NEW Latin alphabet only (Ö ö, Ğ ğ, Ş ş, Ç ç; "ng" stays n+g;
 * tutuq belgisi is ʼ U+02BC). Must have exactly the same keys as en.ts.
 *
 * Strings marked "REVIEW" are Claude's translations (not from SITE_SPEC) — see TODO-CONTENT.md.
 */
import type { UiKey } from './en';

const uz: Record<UiKey, string> = {
  // Navigation
  'nav.home': 'Bosh sahifa',
  'nav.about': 'Men haqimda',
  'nav.research': 'Tadqiqotlar',
  'nav.publications': 'Nashrlar',
  'nav.projects': 'Loyihalar',
  'nav.teaching': 'Öqitiş',
  'nav.contact': 'Aloqa',
  'nav.label': 'Asosiy menyu', // REVIEW
  'nav.sections': 'Bölimlar', // REVIEW
  'nav.menu': 'Menyu', // REVIEW
  'nav.close': 'Menyuni yopiş', // REVIEW
  'lang.label': 'Til', // REVIEW
  'lang.en': 'Inglizça', // REVIEW
  'lang.uz': 'Özbekça', // REVIEW
  'a11y.skip': 'Asosiy mazmunga öting', // REVIEW

  // Home
  'home.field': 'PhD · Nazariy fizika',

  // Calls to action
  'cta.cv': 'CV yuklab oliş',
  'cta.publications': 'Nashrlarni köriş',

  // About
  'about.path': 'Akademik yöl',
  'about.interests': 'Ilmiy qiziqişlar',
  'about.beyond': 'Ilmdan taşqari',
  'about.achievements': 'Yutuqlar',

  // Research
  'research.methods': 'Usullar va vositalar',

  // Publications
  'pubs.all': 'Barçasi',
  'pubs.published': 'Çop etilgan',
  'pubs.review': 'Körib çiqilmoqda',
  'pubs.thesis': 'Dissertatsiya',
  'pubs.textbooks': 'Darsliklar',
  'pubs.bibAll': 'Barçasini yuklab oliş (BibTeX)',
  'status.revision': 'Qayta körib çiqişda',
  'status.submitted': 'Yuborilgan',

  // Courses
  'course.overview': 'Umumiy maʼlumot',
  'course.lectures': 'Maʼruzalar',
  'course.books': 'Darsliklar',
  'course.videos': 'Video darslar',
  'course.tasks': 'Topşiriqlar',
  'course.open': 'Kursni oçiş',

  // Contact
  'contact.title': 'Boğlaniş',
  'contact.send': 'Xabar yuboriş',
  'contact.name': 'Ism',
  'contact.email': 'Elektron poçta',
  'contact.message': 'Xabar',

  // Footer
  'footer.next': 'Keyingi',
  'footer.home': 'Bosh sahifa',
  'footer.license': 'Kod: MIT litsenziyasi · Kontent ©', // REVIEW

  // Misc
  'fallback.english': '(inglizça)', // REVIEW
  'page.wip': 'Bu sahifa tayyorlanmoqda. Mazmun keyingi bosqiçda qöşiladi.', // REVIEW
  'site.description':
    'anizotrop modda maydonlari bilan öralgan qora öralar, gravitatsion linzalaniş va kvaziperiodik tebranişlarni örganuvçi nazariy fizik.', // REVIEW

  // 404
  'notFound.title': 'Voqealar gorizonti ortida adaşib qoldingiz', // REVIEW
  'notFound.text': 'Bu sahifa mavjud emas yoki boşqa joyga köçirilgan.', // REVIEW
  'notFound.home': 'Bosh sahifaga qaytiş', // REVIEW
};

export default uz;
