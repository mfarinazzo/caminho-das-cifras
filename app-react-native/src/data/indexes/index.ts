import catecumenato from './catecumenato.json';
import eleicao from './eleicao.json';
import liturgia from './liturgia.json';
import preCatecumenato from './pre-catecumenato.json';
import all from './all.json';

export const CATEGORY_INDEXES = {
  'catecumenato': catecumenato,
  'eleicao': eleicao,
  'liturgia': liturgia,
  'pre-catecumenato': preCatecumenato,
} as const;

export type CategoryKey = keyof typeof CATEGORY_INDEXES;
export type SongListItem = {
  slug: string;
  title: string;
  file: string;
  category: string;
  reference?: string | null;
  subtitle?: string | null;
  lyrics?: string | null;
  hasCapo?: boolean | null;
  capoHouse?: string | null;
  hasChords?: boolean | null;
};

export const ALL_SONGS = all as SongListItem[];
