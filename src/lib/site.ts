import people from '../data/people.json';

export const siteName = 'Smart City Research Group';
export const { university, department, email, office } = people.investigator;

export const navigation = [
  { label: 'Home', path: '' },
  { label: 'Research', path: 'research/' },
  { label: 'Publications', path: 'publications/' },
  { label: 'People', path: 'people/' },
  { label: 'Teaching', path: 'teaching/' },
  { label: 'Join Us', path: 'join-us/' },
];

export function sitePath(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export function formatMonth(date: string) {
  const [year, month] = date.split('-').map(Number);
  if (!month) return String(year);
  return new Intl.DateTimeFormat('en', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export interface Link { label: string; url: string }

export interface Publication {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  details?: string;
  links?: Link[];
  note?: string;
  type: string;
}

export interface StudyFigure {
  image: string;
  alt: string;
  caption?: string;
}

export interface StudySection {
  title: string;
  paragraphs?: string[];
  items?: string[];
  figures?: StudyFigure[];
  links?: Link[];
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  paragraphs?: string[];
  image?: string;
  imageAlt?: string;
  credit?: Link;
  links?: Link[];
  detail?: {
    source: string;
    title?: string;
    funding?: string;
    links?: Link[];
    intro: string[];
    sections: StudySection[];
  };
}
