/**
 * The model behind the chart primitives — every number a `<Sparkline>`, `<ProgressRing>`, `<Gauge>`
 * or `<MiniDonut>` draws with, the palette a `<ChartContainer>` hands to whatever draws inside it,
 * and no React at all.
 *
 * The components render; the arithmetic lives here (the standing rule for this codebase), which is
 * also what makes it testable without a DOM: a path string is a value, so a wrong one is obvious in
 * a test and invisible in a screenshot.
 *
 * Everything is measured in one square of `VIEW` user units. A drawing that should stretch to its
 * box says so with `preserveAspectRatio="none"` rather than being told a pixel size — which is how
 * a sparkline fills a table cell of any width without recomputing a single coordinate.
 */
namespace ChartUtils {
  /** The side of the square every primitive draws inside. */
  export const VIEW = 100;

  /** The centre of that square, where a ring or a donut is centred. */
  export const CENTRE = VIEW / 2;

  /**
   * The step a fraction of a ring is rounded to — half a percent of the way round.
   *
   * A dash length lands in a **class name**, so an unrounded fraction means one CSS rule per
   * distinct value, and a grid of ten thousand percentages would generate ten thousand rules.
   * Rounding caps that at a couple of hundred, and half a percent of a 96px ring is a third of a
   * pixel: below what anybody can see, and the reason the arc can still *transition* between two
   * values instead of being redrawn.
   *
   * Data-driven *paths* need none of this — a sparkline's shape is the `d` attribute, which the
   * styling engine never sees.
   */
  export const FRACTION_STEP = 0.005;

  export interface Point {
    x: number;
    y: number;
  }

  /** The ends of the value axis. Either can be fixed, so many rows can share one scale. */
  export interface Domain {
    min?: number;
    max?: number;
  }

  /** Two decimals is finer than any screen, and keeps a path string short enough to compare. */
  function round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /** Rounded to `FRACTION_STEP` and clamped to the path: a ring cannot be more than full. */
  export function fraction(value: number): number {
    const clamped = Math.min(Math.max(value, 0), 1);

    return Math.round(clamped / FRACTION_STEP) * FRACTION_STEP;
  }

  /**
   * The data as points in the view box, `y` already flipped for SVG's downward axis.
   *
   * Two edge cases are decisions rather than guards. A single datum has no slope, so it becomes a
   * flat line across the whole box — which is what a one-point sparkline means. Data that never
   * changes has no scale either (`max === min` would divide by zero), so it sits in the middle
   * rather than collapsing onto the floor or the ceiling.
   */
  export function points(data: readonly number[], domain: Domain = {}): Point[] {
    if (data.length === 0) return [];

    const min = domain.min ?? Math.min(...data);
    const max = domain.max ?? Math.max(...data);
    const span = max - min;

    const y = (value: number) => round(span === 0 ? CENTRE : VIEW - ((value - min) / span) * VIEW);

    if (data.length === 1) {
      return [
        { x: 0, y: y(data[0]) },
        { x: VIEW, y: y(data[0]) },
      ];
    }

    const step = VIEW / (data.length - 1);

    return data.map((value, index) => ({ x: round(index * step), y: y(value) }));
  }

  /** The points as a polyline: `M x y L x y …`. */
  export function linePath(points: readonly Point[]): string {
    if (points.length === 0) return '';

    return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join('');
  }

  /** The same line, closed down both sides to the floor of the box so it can be filled. */
  export function areaPath(points: readonly Point[]): string {
    if (points.length === 0) return '';

    const last = points[points.length - 1];

    return `${linePath(points)}L${last.x} ${VIEW}L${points[0].x} ${VIEW}Z`;
  }

  /**
   * The data as bars, all of them in **one** path — a rectangle per datum would be one element per
   * datum, and these are drawn fifty rows at a time inside a scrolling grid.
   *
   * `gap` is the share of each slot left empty, so bars keep their spacing at any width. The lowest
   * value in the data would otherwise have no height at all, so every bar keeps a floor of one
   * unit: a bottom-of-the-scale value reads as a mark on the axis rather than as missing data.
   */
  export function barsPath(data: readonly number[], domain: Domain = {}, gap = 0.25): string {
    if (data.length === 0) return '';

    const slot = VIEW / data.length;
    const width = round(slot * (1 - gap));
    const offset = round((slot - width) / 2);

    return points(data, domain)
      .map((point, index) => {
        const top = Math.min(point.y, VIEW - 1);

        return `M${round(index * slot + offset)} ${top}h${width}v${round(VIEW - top)}h${-width}Z`;
      })
      .join('');
  }

  /** The radius that fits a stroke of `thickness` inside the box, without clipping either edge. */
  export function radius(thickness: number): number {
    return round(CENTRE - thickness / 2);
  }

  /** The length of a full circle of that radius. */
  export function circumference(radius: number): number {
    return round(2 * Math.PI * radius);
  }

  /**
   * The dash pair that reveals `value` (0–1) of a path `length` long, and hides the rest.
   *
   * One dash as long as the whole path, offset backwards by what should stay hidden: the visible run
   * starts where the path starts, so the arc grows from its own beginning. Both numbers are ordinary
   * Box props, which is what lets the arc transition and carry a `hover` of its own.
   */
  export function dash(length: number, value: number): { strokeDasharray: number; strokeDashoffset: number } {
    return { strokeDasharray: round(length), strokeDashoffset: round(length * (1 - fraction(value))) };
  }

  /** A point on the circle, measured clockwise from twelve o'clock, the way a dial is read. */
  function polar(radius: number, angle: number): Point {
    const radians = ((angle - 90) * Math.PI) / 180;

    return { x: round(CENTRE + radius * Math.cos(radians)), y: round(CENTRE + radius * Math.sin(radians)) };
  }

  /** How long an arc of `sweep` degrees is — the path length a `dash` is measured against. */
  export function arcLength(radius: number, sweep: number): number {
    return round(circumference(radius) * (Math.min(Math.abs(sweep), 360) / 360));
  }

  /**
   * An arc as a path, from `start` degrees clockwise through `sweep`.
   *
   * Only the constants of a gauge reach this — a radius and two angles — so the string is identical
   * for every gauge of the same shape, and it is written as the `d` attribute rather than as a style
   * prop. A full turn cannot be one arc (the two ends would coincide and the browser would draw
   * nothing at all), so it is split in half.
   */
  export function arcPath(radius: number, start: number, sweep: number): string {
    if (Math.abs(sweep) >= 360) {
      const from = polar(radius, start);
      const opposite = polar(radius, start + 180);

      return `M${from.x} ${from.y}A${radius} ${radius} 0 0 1 ${opposite.x} ${opposite.y}A${radius} ${radius} 0 0 1 ${from.x} ${from.y}`;
    }

    const from = polar(radius, start);
    const to = polar(radius, start + sweep);
    const largeArc = Math.abs(sweep) > 180 ? 1 : 0;
    const clockwise = sweep < 0 ? 0 : 1;

    return `M${from.x} ${from.y}A${radius} ${radius} 0 ${largeArc} ${clockwise} ${to.x} ${to.y}`;
  }

  /** One segment of a donut: the dash that draws it, and how far round the circle it starts. */
  export interface Segment {
    /** The visible run and the gap that follows it, as a `strokeDasharray` value. */
    strokeDasharray: string;
    /** Degrees clockwise from twelve o'clock — written as the `transform` attribute. */
    rotate: number;
    /** The datum this segment was drawn from, and its position in the data. */
    value: number;
    index: number;
  }

  /**
   * One segment per value, each worth the share of the circle its value is worth.
   *
   * Every segment is the same circle, dashed to its own length and turned to where it starts — and
   * the turn is an attribute, so a donut of any data generates no rule for its angles. Values that
   * sum to nothing produce no segments at all rather than a division by zero, and a negative value
   * counts as none: a ring of a hundred percent has no way to show one.
   */
  export function donutSegments(data: readonly number[], length: number): Segment[] {
    const total = data.reduce((sum, value) => sum + Math.max(value, 0), 0);

    if (total <= 0) return [];

    let start = 0;

    return data.map((value, index) => {
      const share = fraction(Math.max(value, 0) / total);
      const run = round(length * share);
      const rotate = round(start * 360);

      start += share;

      return { strokeDasharray: `${run} ${round(length - run)}`, rotate, value, index };
    });
  }

  /**
   * The colours a chart uses when nobody names any: `--chart-1` … `--chart-6`, and the same six one
   * step lighter for a dark background.
   *
   * Tokens rather than raw colours, so they resolve through this library's palette and replacing one
   * is replacing a Box value. Six, because that is as many series as a dashboard tile can be told
   * apart in — a seventh wraps round to the first, which is more honest than an invented colour.
   */
  export const PALETTE = ['sky-500', 'emerald-500', 'amber-500', 'violet-500', 'rose-500', 'cyan-500'] as const;

  /** The same six for a dark background, where a 500 reads as muddy against near-black. */
  export const DARK_PALETTE = ['sky-400', 'emerald-400', 'amber-400', 'violet-400', 'rose-400', 'cyan-400'] as const;

  /** The numbered palette as custom properties: `{ 'chart-1': 'sky-500', … }`. */
  export function paletteVariables(palette: readonly string[]): Record<string, string> {
    return palette.reduce<Record<string, string>>((acc, colour, index) => {
      acc[`chart-${index + 1}`] = colour;

      return acc;
    }, {});
  }

  /**
   * The variables a chart's series read, by the name the ecosystem already uses for them:
   * `{ 'color-revenue': 'var(--chart-1)' }`.
   *
   * A list of names takes the numbered palette in order, which is the whole case for the container —
   * a chart written with `stroke="var(--color-revenue)"` names no colour at all, so its dark mode is
   * a property of the page rather than of the chart. A record names its own paint per series, for
   * the series a brand insists on.
   */
  export function seriesVariables(series: readonly string[] | Readonly<Record<string, string>>, slots: number = PALETTE.length) {
    const entries: readonly (readonly [string, string])[] = Array.isArray(series)
      ? series.map((name, index) => [name, `var(--chart-${(index % slots) + 1})`] as const)
      : Object.entries(series as Record<string, string>);

    return entries.reduce<Record<string, string>>((acc, [name, paint]) => {
      acc[`color-${name}`] = paint;

      return acc;
    }, {});
  }
}

export default ChartUtils;
