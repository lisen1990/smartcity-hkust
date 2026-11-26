import publications from '../data/publications.json';
import type { Publication } from './site';

function byPublicationNumber(a: Publication, b: Publication) {
  return Number(b.id.slice(1)) - Number(a.id.slice(1));
}

export const journalPublications = publications.filter((paper) => paper.type === 'journal').sort(byPublicationNumber);
export const conferencePublications = publications.filter((paper) => paper.type === 'conference').sort(byPublicationNumber);
export const patentPublications = publications.filter((paper) => paper.type === 'patent').sort(byPublicationNumber);

export const selectedPublications = [
  ...conferencePublications.filter((paper) => [
    'Advances in Neural Information Processing Systems (NeurIPS)',
    'International Conference on Learning Representations (ICLR)',
  ].includes(paper.venue)),
  ...journalPublications.filter((paper) => paper.venue === 'Transportation Science'),
  ...journalPublications.filter((paper) => paper.venue === 'Transportation Research Part B: Methodological'),
  ...journalPublications.filter((paper) => paper.venue === 'IEEE Transactions on Automatic Control'),
];
