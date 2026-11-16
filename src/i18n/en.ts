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

  // Home
  'home.field': 'PhD · Theoretical Physics',

  // Calls to action
  'cta.cv': 'Download CV',
  'cta.publications': 'View publications',

  // About
  'about.path': 'Academic path',
  'about.interests': 'Scientific interests',
  'about.beyond': 'Beyond research',
  'about.achievements': 'Achievements',

  // Research
  'research.methods': 'Methods & tools',

  // Publications
  'pubs.all': 'All',
  'pubs.published': 'Published',
  'pubs.review': 'Under review',
  'pubs.thesis': 'Thesis',
  'pubs.textbooks': 'Textbooks',
  'pubs.bibAll': 'Download all (BibTeX)',
  'status.revision': 'Under revision',
  'status.submitted': 'Submitted',

  // Courses
  'course.overview': 'Overview',
  'course.lectures': 'Lectures',
  'course.books': 'Textbooks',
  'course.videos': 'Video lessons',
  'course.tasks': 'Assignments',
  'course.open': 'Open course',

  // Contact
  'contact.title': 'Get in touch',
  'contact.send': 'Send a message',
  'contact.name': 'Name',
  'contact.email': 'Email',
  'contact.message': 'Message',

  // Footer
  'footer.next': 'Next',
  'footer.home': 'Home',
  'footer.license': 'Code: MIT licence · Content ©',

  // Misc
  'fallback.english': '(English)',
  'page.wip': 'This page is being built. Content arrives in the next phase.',
  'site.description':
    'theoretical physicist studying black holes surrounded by anisotropic matter, gravitational lensing and quasi-periodic oscillations.',

  // 404
  'notFound.title': 'Lost beyond the event horizon',
  'notFound.text': 'This page does not exist or has moved.',
  'notFound.home': 'Back to Home',
} as const;

export type UiKey = keyof typeof en;
export default en;
