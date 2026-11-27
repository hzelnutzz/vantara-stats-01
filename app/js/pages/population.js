/**
 * Population page: the 2025 age–sex pyramid and the 2016–2025 trend line.
 */

import { YEARS, POPULATION } from '../data.js';
import { lineChart, populationPyramid, COLORS } from '../charts.js';

export function initPopulation() {
  populatePyramid();
  populateTrend();
}

function populatePyramid() {
  populationPyramid(document.getElementById('population-pyramid'), {
    bands: POPULATION.pyramid,
    label: 'Population of Vantara by five-year age band and sex, 2025',
  });
}

function populateTrend() {
  lineChart(document.getElementById('population-trend'), {
    years: YEARS,
    series: [
      {
        name: 'Total population',
        values: POPULATION.total.map((value) => value / 1_000_000),
        color: COLORS.teal,
      },
    ],
    height: 320,
    domain: [31, 35],
    tickCount: 4,
    yLabel: 'millions of people',
    axisFormat: (value) => value.toFixed(1),
    valueFormat: (value) => `${value.toFixed(1)} million`,
    label: 'Total population of Vantara, 2016 to 2025',
  });
}
