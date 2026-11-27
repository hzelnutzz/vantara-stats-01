/**
 * Labour page: unemployment trend and the sortable annual labour-market table.
 */

import { YEARS, LABOR } from '../data.js';
import { lineChart, COLORS } from '../charts.js';

export function initLabor() {
  lineChart(document.getElementById('unemployment-trend'), {
    years: YEARS,
    series: [
      {
        name: 'Unemployment rate',
        values: LABOR.unemployment,
        color: COLORS.rose,
      },
    ],
    height: 320,
    domain: [0, 10],
    tickCount: 5,
    yLabel: 'per cent of labour force',
    axisFormat: (value) => `${value}%`,
    valueFormat: (value) => `${value.toFixed(1)}%`,
    label: 'Unemployment rate in Vantara, 2016 to 2025',
  });

  const tbody = document.getElementById('labor-rows');
  const button = document.getElementById('labor-sort');
  const status = document.getElementById('labor-sort-status');
  if (!tbody || !button) return;

  const rows = YEARS.map((year, index) => ({
    year,
    unemployment: LABOR.unemployment[index],
    youth: LABOR.youthUnemployment[index],
    participation: LABOR.participation[index],
    force: LABOR.laborForce[index],
    employed: LABOR.laborForce[index] * (1 - LABOR.unemployment[index] / 100),
  }));

  let mode = 'year';

  const draw = () => {
    const sorted = rows
      .slice()
      .sort(
        mode === 'rate'
          ? (a, b) => b.unemployment - a.unemployment
          : (a, b) => b.year - a.year,
      );

    tbody.innerHTML = sorted
      .map(
        (row) => `<tr${row.year === 2025 ? ' class="is-current"' : ''}>
                    <th scope="row">${row.year}</th>
                    <td class="num">${row.unemployment.toFixed(1)}</td>
                    <td class="num">${row.youth.toFixed(1)}</td>
                    <td class="num">${row.participation.toFixed(1)}</td>
                    <td class="num">${row.force.toFixed(2)}</td>
                    <td class="num">${row.employed.toFixed(2)}</td>
                  </tr>`,
      )
      .join('');

    const byRate = mode === 'rate';
    button.textContent = byRate ? 'Sort by year' : 'Sort by unemployment';
    button.setAttribute('aria-pressed', String(byRate));
    if (status) {
      status.textContent = byRate
        ? 'Table sorted by unemployment rate, highest first.'
        : 'Table sorted by year, newest first.';
    }
  };

  button.addEventListener('click', () => {
    mode = mode === 'rate' ? 'year' : 'rate';
    draw();
  });

  draw();
}
