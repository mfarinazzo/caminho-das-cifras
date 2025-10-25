export const CATEGORIES = [
  {
    id: 'pre-catecumenato',
    name: 'Pré-Catecumenato',
    icon: 'book-open-variant',
    // white-ish accent
    color: '#E0E0E0',
  },
  {
    id: 'catecumenato',
    name: 'Catecumenato',
    icon: 'book',
    // blue-ish accent
    color: '#64B5F6',
  },
  {
    id: 'eleicao',
    name: 'Eleição',
    icon: 'hands-pray',
    // green-ish accent
    color: '#81C784',
  },
  {
    id: 'liturgia',
    name: 'Liturgia',
    icon: 'church',
    // yellow-ish accent
    color: '#FFD54F',
  },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];
