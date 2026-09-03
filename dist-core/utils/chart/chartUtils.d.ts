/**
 * The model behind the chart primitives: every number a `<Sparkline>`, `<ProgressRing>`, `<Gauge>` or
 * `<MiniDonut>` draws with, the palette a `<ChartContainer>` declares, and no React. Components render,
 * models decide — which is also what makes a path string testable with no DOM. Everything is measured
 * in one square of `VIEW` user units.
 */
declare namespace ChartUtils {
    /** The side of the square every primitive draws inside. */
    const VIEW = 100;
    /** The centre of that square, where a ring or a donut is centred. */
    const CENTRE: number;
    /**
     * The step a ring fraction is rounded to. A dash length lands in a *class name*, so an unrounded
     * fraction would mean a rule per value; half a percent of a 96px ring is a third of a pixel, and the
     * arc can still transition. Data-driven *paths* need none of this — a `d` attribute generates no CSS.
     */
    const FRACTION_STEP = 0.005;
    interface Point {
        x: number;
        y: number;
    }
    /** The ends of the value axis. Either can be fixed, so many rows can share one scale. */
    interface Domain {
        min?: number;
        max?: number;
    }
    /** Rounded to `FRACTION_STEP` and clamped to the path: a ring cannot be more than full. */
    function fraction(value: number): number;
    /**
     * The data as points in the view box, `y` already flipped for SVG's downward axis. Two decisions rather
     * than guards: one datum is a flat line across the box, and data that never changes sits in the middle
     * (`max === min` has no scale) instead of collapsing onto the floor.
     */
    function points(data: readonly number[], domain?: Domain): Point[];
    /** The points as a polyline: `M x y L x y …`. */
    function linePath(points: readonly Point[]): string;
    /** The same line, closed down both sides to the floor of the box so it can be filled. */
    function areaPath(points: readonly Point[]): string;
    /**
     * The data as bars in **one** path, because these are drawn fifty rows at a time inside a scrolling
     * grid. `gap` is the share of each slot left empty; every bar keeps a floor of one unit, so a
     * bottom-of-the-scale value reads as a mark on the axis rather than as missing data.
     */
    function barsPath(data: readonly number[], domain?: Domain, gap?: number): string;
    /** The radius that fits a stroke of `thickness` inside the box, without clipping either edge. */
    function radius(thickness: number): number;
    /** The length of a full circle of that radius. */
    function circumference(radius: number): number;
    /**
     * The dash pair that reveals `value` (0–1) of a path `length` long: one dash as long as the whole path,
     * offset backwards, so the arc grows from its own beginning. Both are Box props, so it transitions.
     */
    function dash(length: number, value: number): {
        strokeDasharray: number;
        strokeDashoffset: number;
    };
    /** How long an arc of `sweep` degrees is — the path length a `dash` is measured against. */
    function arcLength(radius: number, sweep: number): number;
    /**
     * An arc as a path, from `start` degrees clockwise through `sweep`. Only constants of the shape reach
     * this, so it is the same string for every gauge alike and belongs in the `d` attribute. A full turn is
     * split in half — one arc whose ends coincide draws nothing at all.
     */
    function arcPath(radius: number, start: number, sweep: number): string;
    /** One segment of a donut: the dash that draws it, and how far round the circle it starts. */
    interface Segment {
        /** The visible run and the gap that follows it, as a `strokeDasharray` value. */
        strokeDasharray: string;
        /** Degrees clockwise from twelve o'clock — written as the `transform` attribute. */
        rotate: number;
        /** The datum this segment was drawn from, and its position in the data. */
        value: number;
        index: number;
    }
    /**
     * One segment per value, each the share of the circle it is worth: the same circle dashed to its own
     * length and turned by an *attribute*, so the angles generate no rules. Values summing to nothing give
     * no segments rather than a division by zero, and a negative value counts as none.
     */
    function donutSegments(data: readonly number[], length: number): Segment[];
    /**
     * The colours a chart uses when nobody names any. Tokens rather than raw colours, so they resolve
     * through the palette; six, because that is as many series as a tile can be told apart in — a seventh
     * wraps round rather than inventing a colour.
     */
    const PALETTE: readonly ["sky-500", "emerald-500", "amber-500", "violet-500", "rose-500", "cyan-500"];
    /** The same six for a dark background, where a 500 reads as muddy against near-black. */
    const DARK_PALETTE: readonly ["sky-400", "emerald-400", "amber-400", "violet-400", "rose-400", "cyan-400"];
    /** The numbered palette as custom properties: `{ 'chart-1': 'sky-500', … }`. */
    function paletteVariables(palette: readonly string[]): Record<string, string>;
    /**
     * The variables a chart's series read, named as the ecosystem names them: `{ 'color-revenue':
     * 'var(--chart-1)' }`. A list takes the palette in order, which is the whole case for the container — a
     * chart naming no colour has its dark mode decided by the page. A record names its own paint per series.
     */
    function seriesVariables(series: readonly string[] | Readonly<Record<string, string>>, slots?: number): Record<string, string>;
}
export default ChartUtils;
