export const sectionIds = {
  es: {
    home: 'inicio',
    services: 'servicios',
    projects: 'proyectos',
    process: 'proceso',
    achievements: 'logros',
    testimonials: 'testimonios',
    team: 'equipo',
    aboutUs: 'nosotros',
    faqs: 'faqs',
    contact: 'contactanos',
  },
  en: {
    home: 'home',
    services: 'services',
    projects: 'projects',
    process: 'process',
    achievements: 'achievements',
    testimonials: 'testimonials',
    team: 'team',
    aboutUs: 'about-us',
    faqs: 'faqs',
    contact: 'contact',
  },
} as const

export type Lang = 'es' | 'en'
