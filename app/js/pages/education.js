/**
 * Education page: literacy and enrolment trends, plus the indicator table.
 */

import { YEARS, EDUCATION } from '../data.js';
import { lineChart, COLORS } from '../charts.js';
import { formatValue, formatChange } from '../format.js';

export function initEducation() {
  lineChart(document.getElementById('education-trend'), {
    years: YEARS,
    series: [
      { name: 'Adult literacy', values: EDUCATION.literacy, color: COLORS.teal },
      { name: 'Primary net enrolment', values: EDUCATION.primary, color: COLORS.navy },
      { name: 'Secondary net enrolment', values: EDUCATION.secondary, color: COLORS.sky },
      { name: 'Tertiary gross enrolment', values: EDUCATION.tertiary, color: COLORS.amber },
    ],
    height: 360,
    domain: [0, 100],
    tickCount: 5,
    yLabel: 'per cent',
    axisFormat: (value) => `${value}%`,
    valueFormat: (value) => `${value.toFixed(1)}%`,
    label:
      'Adult literacy and primary, secondary and tertiary enrolment rates in Vantara, 2016 to 2025',
  });

  const tbody = document.getElementById('education-rows');
  if (!tbody) return;

  tbody.innerHTML = EDUCATION.table
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
