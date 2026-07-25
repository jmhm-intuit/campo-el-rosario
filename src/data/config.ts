import type { AnimalCategory, Lot, PastureType } from '../types'

export const APP_NAME = 'Campo'
export const ESTABLISHMENT_NAME = 'El Rosario'
export const TARGET_LOAD_PER_HA = 0.8
export const SCHEMA_VERSION = 1

export const LOTS: Lot[] = [
  { id: 'ER-01', name: 'ER-01', shortName: '01', hectares: 150, sector: 'norte' },
  { id: 'ER-02', name: 'ER-02', shortName: '02', hectares: 150, sector: 'norte' },
  { id: 'ER-03', name: 'ER-03', shortName: '03', hectares: 150, sector: 'norte' },
  { id: 'ER-04', name: 'ER-04', shortName: '04', hectares: 50, sector: 'norte' },
  { id: 'ER-05', name: 'ER-05', shortName: '05', hectares: 60, sector: 'norte' },
  { id: 'ER-06', name: 'ER-06', shortName: '06', hectares: 50, sector: 'norte' },
  { id: 'ER-07', name: 'ER-07', shortName: '07', hectares: 65, sector: 'norte' },
  { id: 'ER-08-09', name: 'ER-08/09', shortName: '08/09', hectares: 150, sector: 'centro' },
  { id: 'ER-10', name: 'ER-10', shortName: '10', hectares: 150, sector: 'centro' },
  { id: 'ER-11', name: 'ER-11', shortName: '11', hectares: 65, sector: 'centro' },
  { id: 'ER-12', name: 'ER-12', shortName: '12', hectares: 55, sector: 'centro' },
  { id: 'ER-13', name: 'ER-13', shortName: '13', hectares: 50, sector: 'centro' },
  { id: 'ER-14', name: 'ER-14', shortName: '14', hectares: 60, sector: 'centro' },
  { id: 'ER-15-16', name: 'ER-15/16', shortName: '15/16', hectares: 70, sector: 'centro' },
  { id: 'ER-17', name: 'ER-17', shortName: '17', hectares: 70, sector: 'centro' },
  { id: 'ER-18', name: 'ER-18', shortName: '18', hectares: 60, sector: 'sur' },
  { id: 'ER-19', name: 'ER-19', shortName: '19', hectares: 150, sector: 'sur' },
  { id: 'ER-20-21', name: 'ER-20/21', shortName: '20/21', hectares: 180, sector: 'sur' },
]

export const TOTAL_HECTARES = LOTS.reduce((sum, lot) => sum + lot.hectares, 0)

export const CATEGORIES: AnimalCategory[] = [
  {
    id: 'toros-reproductores',
    name: 'Toros reproductores',
    shortName: 'Toros',
    loadFactor: 1.25,
    color: '#6b4a2f',
    description: 'Toros disponibles o activos para servicio.',
  },
  {
    id: 'vacas-cria',
    name: 'Vacas de cría',
    shortName: 'Vacas',
    loadFactor: 1,
    color: '#436b35',
    description: 'Vacas adultas que integran el rodeo reproductivo.',
  },
  {
    id: 'vaquillonas-reposicion',
    name: 'Vaquillonas de reposición',
    shortName: 'Vaquillonas',
    loadFactor: 1,
    color: '#749450',
    description: 'Hembras jóvenes retenidas para incorporarse al rodeo de cría.',
  },
  {
    id: 'terneros',
    name: 'Terneros',
    shortName: 'Terneros',
    loadFactor: 0.5,
    color: '#d49b2f',
    description: 'Crías macho; equivalen a media unidad animal en el MVP.',
  },
  {
    id: 'terneras',
    name: 'Terneras',
    shortName: 'Terneras',
    loadFactor: 0.5,
    color: '#e5b95a',
    description: 'Crías hembra; equivalen a media unidad animal en el MVP.',
  },
  {
    id: 'machos-recria-engorde',
    name: 'Machos de recría y engorde',
    shortName: 'Recría/engorde',
    loadFactor: 1,
    color: '#355e62',
    description: 'Novillitos y novillos no destinados a reproducción.',
  },
  {
    id: 'hembras-fuera-cria',
    name: 'Hembras fuera del rodeo de cría',
    shortName: 'Hembras no cría',
    loadFactor: 1,
    color: '#856aa1',
    description: 'Hembras que no están destinadas al rodeo reproductivo.',
  },
  {
    id: 'vacas-ultimo-ternero',
    name: 'Vacas de último ternero (CUT)',
    shortName: 'Vacas CUT',
    loadFactor: 1,
    color: '#9a5948',
    description: 'Vacas adultas en su último ciclo antes del descarte.',
  },
  {
    id: 'otros',
    name: 'Otros',
    shortName: 'Otros',
    loadFactor: 1,
    color: '#7a7a70',
    description: 'Clasificación temporal para casos excepcionales.',
  },
]

export const PASTURE_LABELS: Record<PastureType, string> = {
  'campo-natural': 'Campo natural',
  avena: 'Avena',
  sorgo: 'Sorgo',
  rastrojo: 'Rastrojo',
  'pastura-mejorada': 'Pastura mejorada',
  lotus: 'Lotus',
  descanso: 'En descanso',
  'sin-informacion': 'Sin información',
}

export const PASTURE_COLORS: Record<PastureType, string> = {
  'campo-natural': '#769b55',
  avena: '#1d7b32',
  sorgo: '#8aaa17',
  rastrojo: '#e5cb29',
  'pastura-mejorada': '#4a9b68',
  lotus: '#79a23e',
  descanso: '#aa8a58',
  'sin-informacion': '#9d9f93',
}

export const LOT_ALIASES: Record<string, string> = {
  'ER-08/09': 'ER-08-09',
  'ER-08-09': 'ER-08-09',
  'ER-08 Y 09': 'ER-08-09',
  'ER-8-9': 'ER-08-09',
  'ER-15/16': 'ER-15-16',
  'ER-15-16': 'ER-15-16',
  'ER-15 Y 16': 'ER-15-16',
  'ER-20/21': 'ER-20-21',
  'ER-20-21': 'ER-20-21',
  'ER-20 Y 21': 'ER-20-21',
}
