/**
 * Economy page: GDP trend and sector composition, both driven by the year
 * selector, plus the full national accounts table.
 */

import { YEARS, ECONOMY, gdpPerCapita } from '../data.js';
import { lineChart, sectorBars, COLORS } from '../charts.js';
import { formatInt, formatSignedPercent } from '../format.js';

const SECTORS = [
  ['agriculture', 'Agriculture', 'Agriculture', COLORS.teal],
  ['industry', 'Industry', 'Industry', COLORS.navy],
  ['services', 'Services', 'Services', COLORS.sky],
  ['taxes', 'Net taxes on products', 'Net taxes', COLORS.amber],
];

export function initEconomy() {
  const select = document.getElementById('economy-year');
  const trend = document.getElementById('gdp-trend');
  const sectors = document.getElementById('sector-chart');
  const tbody = document.getElementById('gdp-rows');

  if (!select || !trend || !sectors || !tbody) return;

  select.innerHTML = YEARS.map((year) => `<option value="${year}">${year}</option>`).join('');
  select.value = String(YEARS[YEARS.length - 1]);

  tbody.innerHTML = YEARS.map((year, index) => {
    const growth = ECONOMY.growth[index];
    const tone = growth < 0 ? ' is-bad' : '';
    return `<tr data-gdp-year="${year}">
              <th scope="row">${year}</th>
              <td class="num">${ECONOMY.gdp[index].toFixed(1)}</td>
              <td class="num${tone}">${formatSignedPercent(growth)}</td>
              <td class="num">${formatInt(gdpPerCapita(index))}</td>
              <td class="num">${ECONOMY.inflation[index].toFixed(1)}</td>
            </tr>`;
  }).join('');

  const gdpValue = document.getElementById('selected-gdp');
  const growthValue = document.getElementById('selected-growth');
  const capitaValue = document.getElementById('selected-capita');
  const yearLabels = document.querySelectorAll('[data-selected-year]');
  const rows = tbody.querySelectorAll('[data-gdp-year]');

  const render = (year) => {
    const index = YEARS.indexOf(Number(year));
    if (index < 0) return;

    const shares = ECONOMY.sectors[year];

    lineChart(trend, {
      years: YEARS,
      series: [
        {
          name: 'Nominal GDP',
          values: ECONOMY.gdp,
          color: COLORS.navy,
        },
      ],
      height: 320,
      tickCount: 5,
      yLabel: 'US$ billions',
      axisFormat: (value) => `$${Math.round(value)}B`,
      valueFormat: (value) => `$${value.toFixed(1)} billion`,
      highlightYear: Number(year),
      label: 'Nominal gross domestic product of Vantara, 2016 to 2025, with the selected year marked',
    });

    sectorBars(sectors, {
      items: SECTORS.map(([key, label, shortLabel, color]) => ({
        label,
        shortLabel,
        value: shares[key],
        color,
      })),
      max: 70,
      axisFormat: (value) => `${value}%`,
      valueFormat: (value) => `${value.toFixed(1)}%`,
      label: `Share of gross domestic product by sector, ${year}`,
    });

    if (growthValue) growthValue.textContent = formatSignedPercent(ECONOMY.growth[index]);
    if (gdpValue) gdpValue.textContent = `$${ECONOMY.gdp[index].toFixed(1)}B`;
    if (capitaValue) capitaValue.textContent = `$${formatInt(gdpPerCapita(index))}`;
    for (const element of yearLabels) element.textContent = String(year);
    for (const row of rows) {
      row.classList.toggle('is-selected', Number(row.dataset.gdpYear) === Number(year));
    }
  };

  select.addEventListener('change', () => render(select.value));
  render(select.value);
}
