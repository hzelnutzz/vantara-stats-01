/**
 * Dependency-free SVG chart renderers.
 *
 * Every chart measures its container and draws at that pixel width, so text
 * keeps a readable size on phones instead of shrinking with a fixed viewBox.
 * A ResizeObserver redraws the chart when the container changes width.
 */

export const COLORS = {
  navy: '#10394d',
  teal: '#0d6f63',
  amber: '#b9762a',
  rose: '#9c4a62',
  sky: '#2f6f8f',
  grid: '#e3e7e4',
  axis: '#cbd5d0',
  ink: '#41525b',
};

const observers = new WeakMap();
let chartSequence = 0;

function escapeText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/**
 * Draw immediately, then keep the drawing in step with the container's width.
 * A second chart on the same container replaces the first observer, which is
 * what the economy page needs when its year selector redraws both charts.
 */
function mount(target, render) {
  if (!target) return;
  const previous = observers.get(target);
  if (previous) previous.disconnect();

  const draw = () => {
    const width = Math.max(280, Math.round(target.clientWidth || 720));
    target.innerHTML = render(width);
  };

  draw();

  if (typeof ResizeObserver === 'function') {
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    });
    observer.observe(target);
    observers.set(target, observer);
  }
}

/** Choose a round tick interval covering [min, max]; returns the snapped domain too. */
function axisTicks(min, max, count) {
  const span = max - min || 1;
  const rough = span / Math.max(1, count);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalised = rough / magnitude;
  const step =
    (normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 2.5 ? 2.5 : normalised <= 5 ? 5 : 10) *
    magnitude;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const values = [];
  for (let value = start; value <= end + step / 1000; value += step) {
    values.push(Number(value.toFixed(6)));
  }
  return { min: start, max: end, values };
}

/**
 * A line chart of one or more series sharing the year axis.
 *
 * options:
 *   years         number[]            x values, oldest first
 *   series        {name, values, color}[]
 *   height        number              drawing height in px (default 330)
 *   yLabel        string              rotated axis title on wide screens
 *   domain        [min, max]          fixed y range, else taken from the data
 *   tickCount     number              approximate y ticks (default 5)
 *   axisFormat    (value) => string   y tick labels
 *   valueFormat   (value) => string   point tooltip labels
 *   highlightYear number              draw a marker at this year
 *   label         string              accessible chart description
 */
export function lineChart(target, options) {
  const {
    years,
    series,
    height = 330,
    yLabel = '',
    domain = null,
    tickCount = 5,
    axisFormat = (value) => String(Math.round(value)),
    valueFormat = (value) => String(value),
    highlightYear = null,
    label = '',
  } = options;

  if (!target || !Array.isArray(years) || years.length < 2) return;
  if (!Array.isArray(series) || series.length === 0) return;

  mount(target, (width) => {
    const narrow = width < 560;
    const legendColumns = series.length > 1 ? (narrow ? 1 : 2) : 0;
    const legendRows = legendColumns ? Math.ceil(series.length / legendColumns) : 0;
    const margin = {
      top: legendRows ? 16 + legendRows * 19 : 18,
      right: narrow ? 12 : 20,
      bottom: 44,
      left: narrow ? 46 : 62,
    };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const heightPx = height;

    let axis;
    if (domain) {
      axis = axisTicks(domain[0], domain[1], tickCount);
    } else {
      const values = series.flatMap((entry) => entry.values);
      axis = axisTicks(Math.min(...values), Math.max(...values), tickCount);
    }

    const x = (index) => margin.left + (index / (years.length - 1)) * plotWidth;
    const y = (value) =>
      margin.top + plotHeight - ((value - axis.min) / (axis.max - axis.min)) * plotHeight;

    const grid = axis.values
      .map(
        (value) => `
          <line class="chart-grid-line" x1="${margin.left}" y1="${y(value).toFixed(1)}"
                x2="${(margin.left + plotWidth).toFixed(1)}" y2="${y(value).toFixed(1)}" />
          <text class="chart-axis" x="${margin.left - 9}" y="${(y(value) + 3.5).toFixed(1)}"
                text-anchor="end">${escapeText(axisFormat(value))}</text>`,
      )
      .join('');

    const labelEvery = Math.max(1, Math.ceil(years.length / (narrow ? 4 : 10)));
    const xLabels = years
      .map((year, index) =>
        index % labelEvery === 0 || index === years.length - 1
          ? `<text class="chart-axis" x="${x(index).toFixed(1)}" y="${heightPx - 16}"
                   text-anchor="middle">${year}</text>`
          : '',
      )
      .join('');

    const highlightIndex = highlightYear == null ? -1 : years.indexOf(Number(highlightYear));
    const highlight =
      highlightIndex >= 0
        ? `<line class="chart-highlight" x1="${x(highlightIndex).toFixed(1)}"
                 y1="${margin.top}" x2="${x(highlightIndex).toFixed(1)}"
                 y2="${(margin.top + plotHeight).toFixed(1)}" />`
        : '';

    const gradientId = `chart-area-${++chartSequence}`;
    const area =
      series.length === 1
        ? `<defs>
             <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0" stop-color="${series[0].color}" stop-opacity="0.22" />
               <stop offset="1" stop-color="${series[0].color}" stop-opacity="0.02" />
             </linearGradient>
           </defs>
           <path d="M${x(0).toFixed(1)} ${y(axis.min).toFixed(1)}
                    L${series[0].values
                      .map((value, index) => `${x(index).toFixed(1)} ${y(value).toFixed(1)}`)
                      .join(' L')}
                    L${x(years.length - 1).toFixed(1)} ${y(axis.min).toFixed(1)} Z"
                 fill="url(#${gradientId})" />`
        : '';

    const lines = series
      .map((entry) => {
        const path = entry.values
          .map(
            (value, index) =>
              `${index === 0 ? 'M' : 'L'}${x(index).toFixed(1)} ${y(value).toFixed(1)}`,
          )
          .join(' ');
        const dots = entry.values
          .map((value, index) => {
            const highlighted = highlightYear != null && Number(highlightYear) === years[index];
            return `<circle class="chart-point" cx="${x(index).toFixed(1)}" cy="${y(value).toFixed(1)}"
                            r="${highlighted ? 5 : 3}" fill="${entry.color}">
                      <title>${years[index]}: ${escapeText(valueFormat(value))}</title>
                    </circle>`;
          })
          .join('');
        return `<path d="${path}" fill="none" stroke="${entry.color}" stroke-width="2.2"
                      stroke-linecap="round" stroke-linejoin="round" />${dots}`;
      })
      .join('');

    const legend =
      legendRows > 0
        ? series
            .map((entry, index) => {
              const column = index % legendColumns;
              const row = Math.floor(index / legendColumns);
              const itemWidth = plotWidth / legendColumns;
              const left = margin.left + column * itemWidth;
              const top = 16 + row * 19;
              return `<g>
                        <rect x="${left.toFixed(1)}" y="${(top - 8).toFixed(1)}" width="9" height="9"
                              rx="2" fill="${entry.color}" />
                        <text class="chart-legend" x="${(left + 15).toFixed(1)}"
                              y="${top.toFixed(1)}">${escapeText(entry.name)}</text>
                      </g>`;
            })
            .join('')
        : '';

    const axisTitle =
      yLabel && !narrow
        ? `<text class="chart-axis-title" transform="translate(14 ${(margin.top + plotHeight / 2).toFixed(1)}) rotate(-90)"
                 text-anchor="middle">${escapeText(yLabel)}</text>`
        : '';

    const description =
      label ||
      `${series.map((entry) => entry.name).join(', ')}, ${years[0]} to ${years[years.length - 1]}`;

    return `<svg class="chart-svg" viewBox="0 0 ${width} ${heightPx}" width="${width}" height="${heightPx}"
                 role="img" aria-label="${escapeText(description)}" preserveAspectRatio="xMidYMid meet">
              ${legend}
              ${grid}
              ${highlight}
              ${area}
              ${lines}
              <line class="chart-axis-line" x1="${margin.left}" y1="${(margin.top + plotHeight).toFixed(1)}"
                    x2="${(margin.left + plotWidth).toFixed(1)}" y2="${(margin.top + plotHeight).toFixed(1)}" />
              ${xLabels}
              ${axisTitle}
            </svg>`;
  });
}

/**
 * Horizontal bars for shares of GDP. Labels sit in a left column; the bar
 * length is scaled to the rounded axis maximum so the grid stays honest.
 *
 * options:
 *   items       {label, shortLabel?, value, color}[]
 *   max         number, the largest value to accommodate (default 70)
 *   axisFormat  (value) => string
 *   valueFormat (value) => string
 *   label       accessible chart description
 */
export function sectorBars(target, options) {
  const {
    items,
    max = 70,
    axisFormat = (value) => `${value}%`,
    valueFormat = (value) => `${value.toFixed(1)}%`,
    label = 'Sector shares of gross domestic product',
  } = options;

  if (!target || !Array.isArray(items) || items.length === 0) return;

  mount(target, (width) => {
    const narrow = width < 520;
    const labelWidth = narrow ? 116 : 196;
    const valueWidth = narrow ? 46 : 58;
    const rowHeight = narrow ? 44 : 48;
    const top = 14;
    const bottom = 36;
    const height = top + items.length * rowHeight + bottom;
    const plotWidth = width - labelWidth - valueWidth - (narrow ? 8 : 16);
    const axis = axisTicks(0, max, 4);
    const x = (value) => labelWidth + (value / axis.max) * plotWidth;
    const barHeight = narrow ? 20 : 22;

    const grid = axis.values
      .map(
        (value) => `
          <line class="chart-grid-line" x1="${x(value).toFixed(1)}" y1="${top}"
                x2="${x(value).toFixed(1)}" y2="${(top + items.length * rowHeight).toFixed(1)}" />
          <text class="chart-axis" x="${x(value).toFixed(1)}" y="${height - 14}"
                text-anchor="middle">${escapeText(axisFormat(value))}</text>`,
      )
      .join('');

    const bars = items
      .map((item, index) => {
        const barTop = top + index * rowHeight + (rowHeight - barHeight) / 2;
        const barWidth = Math.max(1, x(item.value) - labelWidth);
        const text = narrow && item.shortLabel ? item.shortLabel : item.label;
        return `<g>
                  <text class="chart-label" x="${(labelWidth - 10).toFixed(1)}"
                        y="${(barTop + barHeight / 2 + 4).toFixed(1)}"
                        text-anchor="end">${escapeText(text)}</text>
                  <rect x="${labelWidth}" y="${barTop.toFixed(1)}" width="${barWidth.toFixed(1)}"
                        height="${barHeight}" rx="4" fill="${item.color}">
                    <title>${escapeText(item.label)}: ${escapeText(valueFormat(item.value))}</title>
                  </rect>
                  <text class="chart-value" x="${(x(item.value) + 8).toFixed(1)}"
                        y="${(barTop + barHeight / 2 + 4).toFixed(1)}">${escapeText(valueFormat(item.value))}</text>
                </g>`;
      })
      .join('');

    return `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"
                 role="img" aria-label="${escapeText(label)}" preserveAspectRatio="xMidYMid meet">
              ${grid}
              <line class="chart-axis-line" x1="${labelWidth}" y1="${top}"
                    x2="${labelWidth}" y2="${(top + items.length * rowHeight).toFixed(1)}" />
              ${bars}
            </svg>`;
  });
}

/**
 * A population pyramid: male bars to the left, female to the right, five-year
 * age bands down the centre. Values are persons.
 *
 * options:
 *   bands  {age, male, female}[]   youngest first, as in data.js
 *   label  accessible chart description
 */
export function populationPyramid(target, options) {
  const { bands, label = 'Population by age band and sex, 2025' } = options;

  if (!target || !Array.isArray(bands) || bands.length === 0) return;

  mount(target, (width) => {
    const narrow = width < 560;
    const rowHeight = narrow ? 18 : 22;
    const top = narrow ? 44 : 52;
    const bottom = 38;
    const height = top + bands.length * rowHeight + bottom;
    const center = width / 2;
    const gap = narrow ? 46 : 60;
    const side = narrow ? 10 : 22;
    const half = center - gap / 2 - side;
    const maxValue = Math.max(...bands.flatMap((band) => [band.male, band.female]));
    const axis = axisTicks(0, maxValue, 4);
    const scale = (value) => (value / axis.max) * half;
    const barHeight = narrow ? 11 : 14;
    const rowsTop = top;
    const rowsBottom = top + bands.length * rowHeight;

    const rows = bands
      .slice()
      .reverse()
      .map((band, index) => {
        const rowY = rowsTop + index * rowHeight;
        const barY = rowY + (rowHeight - barHeight) / 2;
        const maleWidth = scale(band.male);
        const femaleWidth = scale(band.female);
        return `<g>
                  <rect x="${(center - gap / 2 - maleWidth).toFixed(1)}" y="${barY.toFixed(1)}"
                        width="${maleWidth.toFixed(1)}" height="${barHeight}" rx="2" fill="${COLORS.sky}">
                    <title>${escapeText(band.age)} male: ${band.male.toLocaleString('en-US')}</title>
                  </rect>
                  <rect x="${(center + gap / 2).toFixed(1)}" y="${barY.toFixed(1)}"
                        width="${femaleWidth.toFixed(1)}" height="${barHeight}" rx="2" fill="${COLORS.rose}">
                    <title>${escapeText(band.age)} female: ${band.female.toLocaleString('en-US')}</title>
                  </rect>
                  <text class="chart-age" x="${center}" y="${(rowY + rowHeight / 2 + 3.4).toFixed(1)}"
                        text-anchor="middle">${escapeText(band.age)}</text>
                </g>`;
      })
      .join('');

    const ticks = axis.values
      .filter((value) => value <= axis.max)
      .map((value) => {
        const offset = scale(value);
        const text = value === 0 ? '0' : `${Math.round(value / 1000)}k`;
        return `<g>
                  <line class="chart-tick" x1="${(center - gap / 2 - offset).toFixed(1)}" y1="${rowsBottom}"
                        x2="${(center - gap / 2 - offset).toFixed(1)}" y2="${rowsBottom + 4}" />
                  <line class="chart-tick" x1="${(center + gap / 2 + offset).toFixed(1)}" y1="${rowsBottom}"
                        x2="${(center + gap / 2 + offset).toFixed(1)}" y2="${rowsBottom + 4}" />
                  ${
                    value === 0
                      ? ''
                      : `<text class="chart-axis" x="${(center - gap / 2 - offset).toFixed(1)}"
                               y="${height - 14}" text-anchor="middle">${text}</text>
                         <text class="chart-axis" x="${(center + gap / 2 + offset).toFixed(1)}"
                               y="${height - 14}" text-anchor="middle">${text}</text>`
                  }
                </g>`;
      })
      .join('');

    const legend = `<g>
                      <rect x="${(center - gap / 2 - (narrow ? 82 : 96)).toFixed(1)}" y="${top - 26}"
                            width="9" height="9" rx="2" fill="${COLORS.sky}" />
                      <text class="chart-legend" x="${(center - gap / 2 - (narrow ? 68 : 82)).toFixed(1)}"
                            y="${top - 17}">Male</text>
                      <rect x="${(center + gap / 2 + (narrow ? 50 : 66)).toFixed(1)}" y="${top - 26}"
                            width="9" height="9" rx="2" fill="${COLORS.rose}" />
                      <text class="chart-legend" x="${(center + gap / 2 + (narrow ? 64 : 80)).toFixed(1)}"
                            y="${top - 17}">Female</text>
                    </g>`;

    return `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"
                 role="img" aria-label="${escapeText(label)}" preserveAspectRatio="xMidYMid meet">
              ${legend}
              <line class="chart-axis-line" x1="${center}" y1="${rowsTop}" x2="${center}" y2="${rowsBottom}" />
              ${rows}
              ${ticks}
            </svg>`;
  });
}

/** A tiny trend line for a dashboard card; no axes, no labels. */
export function sparkline(target, values, color = COLORS.teal) {
  if (!target || !Array.isArray(values) || values.length < 2) return;

  const width = 140;
  const height = 38;
  const padding = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values.map((value, index) => {
    const x = padding + (index / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / span) * (height - padding * 2);
    return [x, y];
  });
  const path = points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');
  const [lastX, lastY] = points[points.length - 1];

  target.innerHTML = `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false">
      <path d="${path} L${lastX.toFixed(1)} ${height - padding} L${padding} ${height - padding} Z"
            fill="${color}" opacity="0.10" />
      <path d="${path}" fill="none" stroke="${color}" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="2.6" fill="${color}" />
    </svg>`;
}
