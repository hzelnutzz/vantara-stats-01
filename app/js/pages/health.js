/**
 * Health page: life expectancy trend and the indicator comparison table.
 */

import { YEARS, HEALTH } from '../data.js';
import { lineChart, COLORS } from '../charts.js';
import { formatValue, formatChange } from '../format.js';

export function initHealth() {
  lineChart(document.getElementById('life-expectancy-trend'), {
    years: YEARS,
    series: [
      {
        name: 'Life expectancy at birth',
        values: HEALTH.lifeExpectancy,
        color: COLORS.sky,
      },
    ],
    height: 320,
    domain: [72, 78],
    tickCount: 4,
    yLabel: 'years',
    axisFormat: (value) => value.toFixed(0),
    valueFormat: (value) => `${value.toFixed(1)} years`,
    label: 'Life expectancy at birth in Vantara, 2016 to 2025',
  });

  const tbody = document.getElementById('health-rows');
  if (!tbody) return;

  tbody.innerHTML = HEALTH.table
    .map((row) => {
      const change = row.y2025 - row.y2016;
      const improved = row.lowerIsBetter ? change < 0 : change > 0;
      const tone = Math.abs(change) < 0.05 ? '' : improved ? ' is-good' : ' is-bad';
      return `<tr>
                <th scope="row">${row.indicator}</th>
                <td class="unit">${row.unit}</td>
                <td class="num">${formatValue(row.y2016)}</td>
                <td class="num">${formatValue(row.y2025)}</td>
                <td class="num${tone}">${formatChange(change)}</td>
              </tr>`;
    })
    .join('');
}
