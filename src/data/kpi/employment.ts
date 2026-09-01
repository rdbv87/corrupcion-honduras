import { KPIDataPoint } from '@/types/corruption';

export const employmentData: KPIDataPoint[] = [
  { indicator_id: 'desempleo', year: 2010, value: 4.4 },
  { indicator_id: 'desempleo', year: 2011, value: 4.3 },
  { indicator_id: 'desempleo', year: 2012, value: 4.2 },
  { indicator_id: 'desempleo', year: 2013, value: 4.0 },
  { indicator_id: 'desempleo', year: 2014, value: 3.9 },
  { indicator_id: 'desempleo', year: 2015, value: 3.8 },
  { indicator_id: 'desempleo', year: 2016, value: 3.9 },
  { indicator_id: 'desempleo', year: 2017, value: 4.1 },
  { indicator_id: 'desempleo', year: 2018, value: 4.3 },
  { indicator_id: 'desempleo', year: 2019, value: 4.5 },
  { indicator_id: 'desempleo', year: 2020, value: 8.5, notas: 'Pandemia COVID-19' },
  { indicator_id: 'desempleo', year: 2021, value: 7.2 },
  { indicator_id: 'desempleo', year: 2022, value: 6.5 },
  { indicator_id: 'desempleo', year: 2023, value: 6.8 },

  { indicator_id: 'informalidad', year: 2010, value: 68.0 },
  { indicator_id: 'informalidad', year: 2013, value: 69.0 },
  { indicator_id: 'informalidad', year: 2016, value: 70.0 },
  { indicator_id: 'informalidad', year: 2019, value: 71.0 },
  { indicator_id: 'informalidad', year: 2020, value: 73.0, notas: 'Incremento por pandemia' },
  { indicator_id: 'informalidad', year: 2022, value: 71.0 },

  { indicator_id: 'pobreza-550', year: 2010, value: 46.0 },
  { indicator_id: 'pobreza-550', year: 2014, value: 49.7 },
  { indicator_id: 'pobreza-550', year: 2017, value: 44.5 },
  { indicator_id: 'pobreza-550', year: 2019, value: 42.0 },
  { indicator_id: 'pobreza-550', year: 2020, value: 55.4, notas: 'Pandemia + huracanes Eta/Iota' },
  { indicator_id: 'pobreza-550', year: 2022, value: 48.0 },
];
