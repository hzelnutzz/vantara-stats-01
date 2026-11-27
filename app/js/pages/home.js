/**
 * Homepage controller: draws the six sparklines that sit inside the key
 * indicator cards. The headline figures themselves are in the markup so the
 * dashboard remains readable while the modules load.
 */

import { POPULATION, ECONOMY, HEALTH, EDUCATION, LABOR } from '../data.js';
import { sparkline, COLORS } from '../charts.js';

export function initHome() {
  const series = [
    ['population', POPULATION.total.map((value) => value / 1_000_000), COLORS.teal],
    ['gdp', ECONOMY.gdp, COLORS.navy],
    ['inflation', ECONOMY.inflation, COLORS.amber],
    ['unemployment', LABOR.unemployment, COLORS.rose],
    ['life', HEALTH.lifeExpectancy, COLORS.sky],
    ['literacy', EDUCATION.literacy, COLORS.teal],
  ];

  for (const [key, values, color] of series) {
    const target = document.querySelector(`[data-spark="${key}"]`);
    if (target) sparkline(target, values, color);
  }
}
