/**
 * Uzbek UI strings — NEW Latin alphabet only (Ö ö, Ğ ğ, Ş ş, Ç ç; "ng" stays n+g;
 * tutuq belgisi is ʼ U+02BC). Must have exactly the same keys as en.ts.
 *
 * Strings marked "REVIEW" are Claude's translations (not from SITE_SPEC) — see TODO-CONTENT.md.
 */
import type { UiKey } from './en';

const uz: Record<UiKey, string> = {
  // Navigation
  'nav.home': 'Boş sahifa',
  'nav.about': 'Men haqimda',
  'nav.research': 'Tadqiqotlar',
  'nav.publications': 'Naşrlar',
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
  'nav.breadcrumb': 'Navigatsiya yöli', // REVIEW

  // Home
  'home.field': 'PhD · Nazariy fizika',
  'portrait.placeholder': '[Surat]',
  'cv.placeholder': '[cv.pdf]',

  // Calls to action
  'cta.cv': 'CV yuklab oliş',
  'cta.publications': 'Naşrlarni köriş',

  // About
  'about.path': 'Akademik yöl',
  'about.interests': 'Ilmiy qiziqişlar',
  'about.beyond': 'Ilmdan taşqari',
  'about.achievements': 'Yutuqlar',
  'about.cvPdf': 'CV yuklab oliş (PDF)',

  // Research
  'research.methods': 'Usullar va vositalar',
  'research.related': 'Tegişli maqolalar', // REVIEW
  'research.tools': 'Interaktiv vositalar', // REVIEW
  'research.talks': 'Çiqişlar va konferensiyalar', // REVIEW
  'research.notes': 'Qaydlar', // REVIEW

  // Publications
  'pubs.all': 'Barçasi',
  'pubs.published': 'Çop etilgan',
  'pubs.review': 'Körib çiqilmoqda',
  'pubs.thesis': 'Dissertatsiya',
  'pubs.textbooks': 'Darsliklar',
  'pubs.bibAll': 'Barçasini yuklab oliş (BibTeX)',
  'status.revision': 'Qayta körib çiqişda',
  'status.submitted': 'Yuborilgan',
  'status.accepted': 'Qabul qilingan', // REVIEW
  'status.published': 'Çop etilgan',
  'pubs.type.journal': 'Jurnal maqolasi', // REVIEW
  'pubs.type.preprint': 'Preprint', // REVIEW
  'pubs.type.thesis': 'PhD dissertatsiyasi', // REVIEW
  'pubs.type.textbook': 'Darslik', // REVIEW
  'pubs.filterLabel': 'Naşrlarni saralaş', // REVIEW
  'pubs.theme': 'Mavzu', // REVIEW
  'pubs.clearTheme': 'Barça mavzularni körsatiş', // REVIEW
  'pubs.empty': 'Bu bölimda hozirça naşrlar yöq.', // REVIEW
  'pubs.shown': 'Körsatilgan naşrlar:', // REVIEW
  'pubs.supervisor': 'Ilmiy rahbar', // REVIEW
  'pubs.copy': 'Nusxa oliş', // REVIEW
  'pubs.copied': 'Nusxa olindi', // REVIEW
  'pubs.copyFailed': 'Nusxa oliş uçun matnni belgilang', // REVIEW
  'pubs.download': '.bib yuklab oliş', // REVIEW
  'pubs.links': 'Havolalar:', // REVIEW

  // Projects
  'projects.featured': 'Asosiy loyiha', // REVIEW
  'projects.roadmap': 'Yöl xaritasi', // REVIEW
  'projects.docs': 'Hujjatlar', // REVIEW
  'projects.more': 'Boşqa loyihalar', // REVIEW
  'projects.repo': 'Repozitoriy', // REVIEW
  'projects.allRepos': 'GitHubdagi barça repozitoriylar', // REVIEW
  'projects.placeholderName': '[Loyiha nomi]',
  'projects.placeholderText': '[Qisqa tavsif, dasturlaş tili, litsenziya va repozitoriy]',
  'projects.repoMissing': '[repozitoriy havolasi]',
  'projects.docsMissing': '[hujjatlar havolasi]',

  // Teaching
  'teaching.approach': 'Öqitiş yondaşuvi', // REVIEW
  'teaching.another': '[Boşqa kurs]',
  'teaching.anotherText': '[Qisqa tavsif]',
  'teaching.year': '[Yil]',
  'teachLang.uz': 'Özbek tilida', // REVIEW
  'teachLang.en': 'Ingliz tilida', // REVIEW

  // Courses
  'course.overview': 'Umumiy maʼlumot',
  'course.lectures': 'Maʼruzalar',
  'course.books': 'Darsliklar',
  'course.videos': 'Video darslar',
  'course.tasks': 'Topşiriqlar',
  'course.open': 'Kursni oçiş',
  'course.about': 'Kurs haqida', // REVIEW
  'course.syllabus': 'Öquv dasturini yuklab oliş (PDF)', // REVIEW
  'course.syllabusMissing': '[Öquv dasturi PDF]',
  'course.level': 'kurs', // REVIEW
  'course.language': 'til', // REVIEW
  'course.semester': 'semestr', // REVIEW
  'course.hours': 'soat', // REVIEW
  'course.tabsLabel': 'Kurs bölimlari', // REVIEW
  'course.noLectures': 'Hozirça maʼruzalar qöşilmagan.', // REVIEW
  'course.noBooks': 'Hozirça darsliklar qöşilmagan.', // REVIEW
  'course.noVideos': 'Hozirça video darslar qöşilmagan.', // REVIEW
  'course.noTasks': 'Hozirça topşiriqlar yöq.', // REVIEW
  'course.slides': 'Slaydlar', // REVIEW
  'course.video': 'Video', // REVIEW
  'course.due': 'Muddat', // REVIEW
  'course.download': 'PDF yuklab oliş', // REVIEW
  'course.downloadFile': 'Yuklab oliş', // REVIEW
  'course.open.link': 'Oçiş', // REVIEW
  'course.cover': '[Muqova]', // REVIEW
  'video.play': 'Videoni ijro etiş', // REVIEW

  // Contact
  'contact.title': 'Boğlaniş',
  'contact.send': 'Xabar yuboriş',
  'contact.name': 'Ism',
  'contact.email': 'Elektron poçta',
  'contact.message': 'Xabar',
  'contact.submit': 'Yuboriş', // REVIEW
  'contact.emailLabel': 'elektron poçta', // REVIEW
  'contact.emailMissing': '[elektron poçta manzili]',
  'contact.writeEmail': 'Menga xat yozing', // REVIEW
  'contact.profiles': 'Akademik profillar', // REVIEW
  'contact.affiliation': 'Iş joyi', // REVIEW
  'contact.noscriptEmail': 'Elektron poçta manzilini köriş uçun JavaScriptni yoqing.', // REVIEW

  // Footer
  'footer.next': 'Keyingi',
  'footer.home': 'Boş sahifa',
  'footer.license': 'Kod: MIT litsenziyasi · Kontent ©', // REVIEW
  'footer.notes': 'Qaydlar', // REVIEW

  // Misc
  'fallback.english': '(inglizça)', // REVIEW
  'page.later': 'Bu bölim keyingi bosqiçlardan birida qöşiladi.', // REVIEW
  'site.description':
    'anizotrop modda maydonlari bilan öralgan qora öralar, gravitatsion linzalaniş va kvaziperiodik tebranişlarni örganuvçi nazariy fizik.', // REVIEW

  // 404
  'notFound.title': 'Hodisalar gorizonti ortida adaşib qoldingiz', // REVIEW
  'notFound.text': 'Bu sahifa mavjud emas yoki boşqa joyga köçirilgan.', // REVIEW
  'notFound.home': 'Boş sahifaga qaytiş', // REVIEW
};

export default uz;
