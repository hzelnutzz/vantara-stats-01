/**
 * Republic of Vantara — National Statistical Office, 2026 release.
 *
 * This module is the single source of truth for every figure on the site.
 * Pages, charts and tables all read from here so that a value appears only
 * once and cannot drift between views. Money is nominal US dollars unless a
 * field says otherwise; rates and ratios are percentages unless labelled.
 */

export const META = {
  country: 'Republic of Vantara',
  shortName: 'Vantara',
  capital: 'Velhara',
  officialLanguage: 'Vantaran',
  currency: 'Vantara mark (VTM)',
  population: 34_200_000,
  landAreaKm2: 354_300,
  referenceYear: 2025,
  releaseDate: '27 March 2026',
  source: 'Vantara National Statistical Office, 2026',
};

/** Reference years covered by the published series, oldest first. */
export const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export const POPULATION = {
  /** Total population at 31 December, persons. */
  total: [
    31_900_000,
    32_300_000,
    32_700_000,
    33_000_000,
    32_900_000,
    33_100_000,
    33_500_000,
    33_800_000,
    34_000_000,
    34_200_000,
  ],
  /** Annual growth, per cent, aligned with YEARS. */
  growth: [1.0, 1.3, 1.2, 0.9, -0.3, 0.6, 1.2, 0.9, 0.6, 0.6],
  femaleShare: 51.5,
  medianAge: 34.6,
  urbanShare: 68.4,
  density: 96.5,
  fertility: 1.78,
  dependencyRatio: 50.8,
  components: {
    births: 401_600,
    deaths: 266_900,
    naturalIncrease: 134_700,
    netMigration: 65_300,
    totalIncrease: 200_000,
  },
  /** Five-year age bands, persons. Bands sum to META.population. */
  pyramid: [
    { age: '0–4', male: 1_172_000, female: 1_124_000 },
    { age: '5–9', male: 1_247_000, female: 1_195_000 },
    { age: '10–14', male: 1_289_000, female: 1_242_000 },
    { age: '15–19', male: 1_211_000, female: 1_175_000 },
    { age: '20–24', male: 1_121_000, female: 1_108_000 },
    { age: '25–29', male: 1_155_000, female: 1_152_000 },
    { age: '30–34', male: 1_249_000, female: 1_260_000 },
    { age: '35–39', male: 1_286_000, female: 1_312_000 },
    { age: '40–44', male: 1_200_000, female: 1_242_000 },
    { age: '45–49', male: 1_116_000, female: 1_180_000 },
    { age: '50–54', male: 1_043_000, female: 1_130_000 },
    { age: '55–59', male: 941_000, female: 1_053_000 },
    { age: '60–64', male: 806_000, female: 941_000 },
    { age: '65–69', male: 651_000, female: 805_000 },
    { age: '70–74', male: 489_000, female: 653_000 },
    { age: '75–79', male: 326_000, female: 480_000 },
    { age: '80–84', male: 183_000, female: 310_000 },
    { age: '85+', male: 107_000, female: 246_000 },
  ],
};

export const ECONOMY = {
  /** Nominal gross domestic product, US$ billions. */
  gdp: [412.6, 435.6, 461.2, 482.7, 467.1, 511.9, 570.2, 618.5, 654.9, 687.4],
  /** Real GDP growth, per cent on the previous year. */
  growth: [3.1, 3.4, 3.2, 2.7, -4.1, 6.2, 3.9, 3.3, 3.0, 2.8],
  /** Consumer price inflation, annual average, per cent. */
  inflation: [2.1, 2.4, 2.9, 2.2, 1.3, 3.6, 7.8, 5.4, 3.1, 2.4],
  /** Sector shares of gross value added plus net taxes, per cent of GDP. Each year sums to 100. */
  sectors: {
    2016: { agriculture: 8.1, industry: 30.2, services: 57.0, taxes: 4.7 },
    2017: { agriculture: 7.9, industry: 30.0, services: 57.4, taxes: 4.7 },
    2018: { agriculture: 7.6, industry: 29.8, services: 57.8, taxes: 4.8 },
    2019: { agriculture: 7.3, industry: 29.5, services: 58.4, taxes: 4.8 },
    2020: { agriculture: 7.1, industry: 29.1, services: 59.0, taxes: 4.8 },
    2021: { agriculture: 6.9, industry: 28.9, services: 59.4, taxes: 4.8 },
    2022: { agriculture: 6.8, industry: 28.6, services: 59.8, taxes: 4.8 },
    2023: { agriculture: 6.6, industry: 28.3, services: 60.3, taxes: 4.8 },
    2024: { agriculture: 6.5, industry: 28.0, services: 60.7, taxes: 4.8 },
    2025: { agriculture: 6.4, industry: 27.8, services: 61.1, taxes: 4.7 },
  },
  /** General government gross debt, per cent of GDP. */
  debt: 51.8,
  /** Exports and imports of goods and services, per cent of GDP. */
  exports: 32.3,
  imports: 29.1,
};

export const HEALTH = {
  /** Life expectancy at birth, years, aligned with YEARS. */
  lifeExpectancy: [73.4, 73.7, 74.0, 74.4, 73.6, 73.9, 74.8, 75.4, 75.9, 76.4],
  maleLifeExpectancy: 73.5,
  femaleLifeExpectancy: 79.1,
  /** Indicators for the comparison table; lowerIsBetter flips the colour of the change. */
  table: [
    { indicator: 'Life expectancy at birth', unit: 'years', y2016: 73.4, y2025: 76.4 },
    { indicator: 'Male life expectancy', unit: 'years', y2016: 71.0, y2025: 73.5 },
    { indicator: 'Female life expectancy', unit: 'years', y2016: 75.9, y2025: 79.1 },
    { indicator: 'Infant mortality', unit: 'per 1,000 live births', y2016: 16.9, y2025: 10.8, lowerIsBetter: true },
    { indicator: 'Under-five mortality', unit: 'per 1,000 live births', y2016: 20.4, y2025: 13.1, lowerIsBetter: true },
    { indicator: 'Maternal mortality', unit: 'per 100,000 births', y2016: 31, y2025: 18, lowerIsBetter: true },
    { indicator: 'Physicians', unit: 'per 1,000 people', y2016: 2.7, y2025: 3.4 },
    { indicator: 'Hospital beds', unit: 'per 1,000 people', y2016: 3.5, y2025: 3.9 },
    { indicator: 'Health spending', unit: '% of GDP', y2016: 6.9, y2025: 7.8 },
    { indicator: 'DTP3 immunisation', unit: '% of 1-year-olds', y2016: 89, y2025: 94 },
    { indicator: 'Safe drinking water', unit: '% of population', y2016: 91.5, y2025: 96.2 },
  ],
};

export const EDUCATION = {
  /** Adult literacy rate, per cent of people aged 15 and over. */
  literacy: [97.1, 97.4, 97.6, 97.9, 98.0, 98.2, 98.3, 98.4, 98.5, 98.6],
  /** Net primary enrolment, per cent of primary-age children. */
  primary: [93.1, 93.5, 94.0, 94.4, 94.6, 95.1, 95.6, 96.0, 96.4, 96.8],
  /** Net secondary enrolment, per cent of secondary-age children. */
  secondary: [79.8, 80.9, 82.0, 83.1, 83.8, 84.9, 86.0, 87.0, 87.7, 88.4],
  /** Gross tertiary enrolment, per cent of the tertiary-age population. */
  tertiary: [31.5, 32.2, 33.0, 33.9, 34.6, 35.6, 36.8, 38.0, 39.6, 41.2],
  table: [
    { indicator: 'Adult literacy', unit: '% of people aged 15+', y2016: 97.1, y2025: 98.6 },
    { indicator: 'Youth literacy', unit: '% of people aged 15–24', y2016: 98.7, y2025: 99.5 },
    { indicator: 'Net primary enrolment', unit: '% of primary-age children', y2016: 93.1, y2025: 96.8 },
    { indicator: 'Net secondary enrolment', unit: '% of secondary-age children', y2016: 79.8, y2025: 88.4 },
    { indicator: 'Gross tertiary enrolment', unit: '% of tertiary-age population', y2016: 31.5, y2025: 41.2 },
    { indicator: 'Pupil–teacher ratio, primary', unit: 'pupils per teacher', y2016: 17.6, y2025: 14.2, lowerIsBetter: true },
    { indicator: 'Public spending on education', unit: '% of GDP', y2016: 4.4, y2025: 4.9 },
    { indicator: 'Mean years of schooling', unit: 'years, adults 25+', y2016: 9.7, y2025: 10.8 },
  ],
};

export const LABOR = {
  /** Unemployment rate, per cent of the labour force, annual average. */
  unemployment: [7.8, 7.5, 7.1, 6.9, 9.4, 8.2, 7.3, 6.8, 6.5, 6.2],
  /** Youth unemployment, per cent of the labour force aged 15–24. */
  youthUnemployment: [17.9, 17.2, 16.4, 16.0, 21.8, 19.3, 17.1, 15.9, 15.2, 14.6],
  /** Labour force participation, per cent of the population aged 15–64. */
  participation: [62.1, 62.4, 62.8, 63.0, 62.2, 62.6, 63.0, 63.2, 63.3, 63.4],
  /** Labour force, millions of people. */
  laborForce: [13.52, 13.71, 13.92, 14.01, 13.86, 14.02, 14.18, 14.27, 14.34, 14.38],
  workingAge: 22_681_000,
  employed: 13_490_000,
  unemployed: 892_000,
};

/** Nominal GDP per head for an index into YEARS, in US dollars. */
export function gdpPerCapita(index) {
  return Math.round((ECONOMY.gdp[index] * 1_000_000_000) / POPULATION.total[index]);
}
