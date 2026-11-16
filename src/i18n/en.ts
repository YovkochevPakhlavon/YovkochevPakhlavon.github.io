/**
 * English UI strings. Every key here must also exist in uz.ts (TypeScript checks this).
 * Page content (bios, papers, courses) lives in content files, not here.
 */
const en = {
  // Navigation
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.research': 'Research',
  'nav.publications': 'Publications',
  'nav.projects': 'Projects',
  'nav.teaching': 'Teaching',
  'nav.contact': 'Contact',
  'nav.label': 'Main',
  'nav.sections': 'Sections',
  'nav.menu': 'Menu',
  'nav.close': 'Close menu',
  'lang.label': 'Language',
  'lang.en': 'English',
  'lang.uz': 'Uzbek',
  'a11y.skip': 'Skip to content',
  'nav.breadcrumb': 'Breadcrumb',

  // Home
  'home.field': 'PhD · Theoretical Physics',
  'portrait.placeholder': '[Photo]',
  'cv.placeholder': '[cv.pdf]',

  // Calls to action
  'cta.cv': 'Download CV',
  'cta.publications': 'View publications',

  // About
  'about.path': 'Academic path',
  'about.interests': 'Scientific interests',
  'about.beyond': 'Beyond research',
  'about.achievements': 'Achievements',
  'about.cvPdf': 'Download CV (PDF)',

  // Research
  'research.methods': 'Methods & tools',
  'research.related': 'Related papers',
  'research.tools': 'Interactive tools',
  'research.talks': 'Talks & conferences',
  'research.notes': 'Notes',

  // Publications
  'pubs.all': 'All',
  'pubs.published': 'Published',
  'pubs.review': 'Under review',
  'pubs.thesis': 'Thesis',
  'pubs.textbooks': 'Textbooks',
  'pubs.bibAll': 'Download all (BibTeX)',
  'status.revision': 'Under revision',
  'status.submitted': 'Submitted',
  'pubs.nextPhase':
    'The full list — with filters, DOI/arXiv links and BibTeX export — is generated from publications.bib in the next phase.',

  // Projects
  'projects.featured': 'Featured',
  'projects.roadmap': 'Roadmap',
  'projects.docs': 'Documentation',
  'projects.more': 'More projects',
  'projects.repo': 'Repository',
  'projects.allRepos': 'All repositories on GitHub',
  'projects.placeholderName': '[Project name]',
  'projects.placeholderText': '[One-line description, language, licence and repository]',
  'projects.repoMissing': '[repository URL]',
  'projects.docsMissing': '[documentation URL]',

  // Teaching
  'teaching.approach': 'Teaching approach',
  'teaching.another': '[Another course]',
  'teaching.anotherText': '[Short description]',
  'teaching.year': '[Year]',
  'teachLang.uz': 'Uzbek',
  'teachLang.en': 'English',

  // Courses
  'course.overview': 'Overview',
  'course.lectures': 'Lectures',
  'course.books': 'Textbooks',
  'course.videos': 'Video lessons',
  'course.tasks': 'Assignments',
  'course.open': 'Open course',
  'course.about': 'About the course',
  'course.syllabus': 'Download syllabus (PDF)',
  'course.syllabusMissing': '[Syllabus PDF]',
  'course.level': 'level',
  'course.language': 'language',
  'course.semester': 'semester',
  'course.hours': 'hours',
  'course.nextPhase':
    'Lectures, textbooks, video lessons and assignments are added in the next phase.',

  // Contact
  'contact.title': 'Get in touch',
  'contact.send': 'Send a message',
  'contact.name': 'Name',
  'contact.email': 'Email',
  'contact.message': 'Message',
  'contact.submit': 'Send',
  'contact.emailLabel': 'email',
  'contact.emailMissing': '[professional email]',
  'contact.writeEmail': 'Write me an email',
  'contact.profiles': 'Academic profiles',
  'contact.affiliation': 'Affiliation',
  'contact.noscriptEmail': 'Turn on JavaScript to see the email address.',

  // Footer
  'footer.next': 'Next',
  'footer.home': 'Home',
  'footer.license': 'Code: MIT licence · Content ©',
  'footer.notes': 'Notes',

  // Misc
  'fallback.english': '(English)',
  'page.later': 'This section arrives in a later phase.',
  'site.description':
    'theoretical physicist studying black holes surrounded by anisotropic matter, gravitational lensing and quasi-periodic oscillations.',

  // 404
  'notFound.title': 'Lost beyond the event horizon',
  'notFound.text': 'This page does not exist or has moved.',
  'notFound.home': 'Back to Home',
} as const;

export type UiKey = keyof typeof en;
export default en;
