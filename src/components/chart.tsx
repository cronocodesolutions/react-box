import { forwardRef, Ref } from 'react';
import { BoxStyleProps } from '../types';
import ChartUtils from '../utils/chart/chartUtils';
import { Circle, Path, Svg, SvgProps } from './svg';

/**
 * The chart micro-primitives: the small, dense drawings a dashboard is made of, as Boxes.
 *
 * They are deliberately not a chart *library*. There are no axes, no legends and no data
 * transformations — a `<Sparkline>` takes numbers and draws their shape, and everything about how it
 * looks is the props every other component in this library takes: `color`, `strokeWidth`, `hover`,
 * `md`, `theme`, `motionReduce`. That is the whole point. A chart library owns its own styling
 * language and its own dark mode; these own neither, because Box already has both.
 *
 * Two rules run through all four, and both are about where a number ends up:
 *
 * - **Shape is an attribute, colour is a class.** The `d` of a sparkline is per-row data, and an
 *   attribute costs nothing — ten thousand rows of different shapes generate no CSS at all. What
 *   *is* a style prop is the paint, which is shared, so ten thousand rows share one rule.
 * - **A ring's fill is a rounded fraction.** A dash length is a style prop, so it lands in a class
 *   name; rounding it (`ChartUtils.FRACTION_STEP`) is what keeps a column of percentages from
 *   generating a rule each, and what leaves the arc able to transition.
 *
 * The a11y rule is `Svg`'s, because each of these *is* an `Svg`: no `label` means the drawing is
 * decoration and `aria-hidden`, a `label` makes it `role="img"` with that name. A sparkline beside a
 * number needs no label; one that is the only thing in a cell does.
 */

/**
 * The props every primitive shares: an `Svg`'s, minus three it owns itself.
 *
 * `viewBox` is the coordinate system the drawing is computed in. `variant` is Box's component
 * variant, and these have no component style to vary. `children` is narrowed to plain SVG content
 * — a chart's children are a label in the middle of a ring, never Box's `isHover` render prop.
 */
type ChartProps = Omit<SvgProps, 'viewBox' | 'variant' | 'children'> & { children?: React.ReactNode };

/** The box every primitive draws in — the components own it, so the numbers can be plain. */
const VIEW_BOX = `0 0 ${ChartUtils.VIEW} ${ChartUtils.VIEW}`;

/** A paint value: a colour token, or the `url(#…)`/`var(--…)` a gradient or a theme provides. */
type Paint = NonNullable<BoxStyleProps['fill']>;

/**
 * The colours a `<MiniDonut>` cycles through when it is not given any. Tokens rather than
 * `var(--chart-n)`, so a donut draws something the moment it is rendered; a themed chart passes its
 * own — `colors={['var(--chart-1)', 'var(--chart-2)']}` works because `fill` takes a variable.
 */
const DEFAULT_COLORS: readonly Paint[] = ['sky-500', 'emerald-500', 'amber-500', 'violet-500', 'rose-500', 'cyan-500'];

export interface SparklineProps extends ChartProps {
  /** The numbers to draw, oldest first. */
  data: readonly number[];
  /** `line` (default), `area` — the line with the space beneath it filled — or `bar`. */
  variant?: 'line' | 'area' | 'bar';
  /**
   * Fix the ends of the value axis. Without them the line uses its own lowest and highest value, so
   * every row of a table is scaled to itself; with them a column of sparklines is comparable.
   */
  min?: number;
  max?: number;
}

function SparklineImpl(props: SparklineProps, ref: Ref<SVGSVGElement>) {
  const { data, variant = 'line', min, max, children, ...svgProps } = props;
  const domain = { min, max };
  const points = ChartUtils.points(data, domain);

  return (
    <Svg
      viewBox={VIEW_BOX}
      // The one primitive that is *not* drawn to scale: a sparkline fills whatever box it is given,
      // and `non-scaling-stroke` is what keeps the line one width thick after it has been stretched.
      // Both are ordinary props, so a caller who wants a shape that scales says so.
      preserveAspectRatio="none"
      vectorEffect="non-scaling-stroke"
      width="100%"
      height="1.5rem"
      overflow="visible"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      ref={ref}
      {...svgProps}
    >
      {variant === 'bar' ? (
        <Path d={ChartUtils.barsPath(data, domain)} stroke="none" />
      ) : (
        <>
          {/* Two paths for an area, because one closed path would stroke its own baseline and sides. */}
          {variant === 'area' && <Path d={ChartUtils.areaPath(points)} stroke="none" fillOpacity={0.2} />}
          <Path d={ChartUtils.linePath(points)} fill="none" />
        </>
      )}
      {children}
    </Svg>
  );
}

/** A line, area or bar chart small enough to sit inside a line of text or a table cell. */
export const Sparkline = /* @__PURE__ */ forwardRef(SparklineImpl);
Sparkline.displayName = 'Sparkline';

/** What a ring and a dial have in common: one value, and how thick the arc drawing it is. */
export interface ProgressRingProps extends ChartProps {
  /** How full the arc is, from 0 to 1. Rounded to half a percent — see `ChartUtils.FRACTION_STEP`. */
  value: number;
  /** The width of the ring in view units, out of the 100 the box is wide. */
  thickness?: number;
  /** The unfilled part of the ring, as the same colour faded — so the track follows the theme too. */
  trackOpacity?: NonNullable<BoxStyleProps['strokeOpacity']>;
}

function ProgressRingImpl(props: ProgressRingProps, ref: Ref<SVGSVGElement>) {
  const { value, thickness = 10, trackOpacity = 0.2, children, ...svgProps } = props;
  const radius = ChartUtils.radius(thickness);
  const length = ChartUtils.circumference(radius);

  return (
    <Svg
      viewBox={VIEW_BOX}
      width="3rem"
      height="3rem"
      stroke="currentColor"
      fill="none"
      strokeWidth={thickness}
      strokeLinecap="round"
      ref={ref}
      {...svgProps}
    >
      <Circle cx={ChartUtils.CENTRE} cy={ChartUtils.CENTRE} r={radius} strokeOpacity={trackOpacity} />
      {/*
       * Turned by the `transform` *attribute*, which carries its own centre of rotation — the CSS
       * `rotate` prop turns an SVG element around the corner of the viewBox, and this library has no
       * `transform-origin` prop yet (AN1). Twelve o'clock is where a ring is read from.
       */}
      <Circle
        cx={ChartUtils.CENTRE}
        cy={ChartUtils.CENTRE}
        r={radius}
        transform={`rotate(-90 ${ChartUtils.CENTRE} ${ChartUtils.CENTRE})`}
        {...ChartUtils.dash(length, value)}
      />
      {children}
    </Svg>
  );
}

/** A full circle filled to `value`, starting at twelve o'clock — the percentage-complete ring. */
export const ProgressRing = /* @__PURE__ */ forwardRef(ProgressRingImpl);
ProgressRing.displayName = 'ProgressRing';

export interface GaugeProps extends ProgressRingProps {
  /** How far round the dial goes, in degrees. Three quarters of a turn by default. */
  sweep?: number;
  /** Where it starts, in degrees clockwise from twelve o'clock. Bottom left by default. */
  start?: number;
}

function GaugeImpl(props: GaugeProps, ref: Ref<SVGSVGElement>) {
  const { value, thickness = 10, trackOpacity = 0.2, sweep = 270, start = 225, children, ...svgProps } = props;
  const radius = ChartUtils.radius(thickness);
  const length = ChartUtils.arcLength(radius, sweep);
  // Constants of the shape, not of the data, so both arcs are the same string in every gauge.
  const d = ChartUtils.arcPath(radius, start, sweep);

  return (
    <Svg
      viewBox={VIEW_BOX}
      width="4rem"
      height="4rem"
      stroke="currentColor"
      fill="none"
      strokeWidth={thickness}
      strokeLinecap="round"
      ref={ref}
      {...svgProps}
    >
      <Path d={d} strokeOpacity={trackOpacity} />
      <Path d={d} {...ChartUtils.dash(length, value)} />
      {children}
    </Svg>
  );
}

/** A dial: an arc of `sweep` degrees filled to `value`. A gauge with `sweep={360}` is a ring. */
export const Gauge = /* @__PURE__ */ forwardRef(GaugeImpl);
Gauge.displayName = 'Gauge';

export interface MiniDonutProps extends ChartProps {
  /** One value per segment. Each is drawn as its share of the whole, so they need no total. */
  data: readonly number[];
  /** One colour per segment, cycled if there are fewer than there are values. */
  colors?: readonly Paint[];
  /** The width of the ring in view units, out of the 100 the box is wide. */
  thickness?: number;
}

function MiniDonutImpl(props: MiniDonutProps, ref: Ref<SVGSVGElement>) {
  const { data, colors = DEFAULT_COLORS, thickness = 20, children, ...svgProps } = props;
  const radius = ChartUtils.radius(thickness);
  const length = ChartUtils.circumference(radius);

  return (
    <Svg viewBox={VIEW_BOX} width="3rem" height="3rem" fill="none" strokeWidth={thickness} ref={ref} {...svgProps}>
      {ChartUtils.donutSegments(data, length).map((segment) => (
        <Circle
          key={segment.index}
          cx={ChartUtils.CENTRE}
          cy={ChartUtils.CENTRE}
          r={radius}
          stroke={colors[segment.index % colors.length]}
          strokeDasharray={segment.strokeDasharray}
          // Where the segment starts, as an attribute — so the angles of a donut generate no rules.
          transform={`rotate(${segment.rotate - 90} ${ChartUtils.CENTRE} ${ChartUtils.CENTRE})`}
        />
      ))}
      {children}
    </Svg>
  );
}

/** A ring divided into one segment per value — a pie chart with its middle left for a number. */
export const MiniDonut = /* @__PURE__ */ forwardRef(MiniDonutImpl);
MiniDonut.displayName = 'MiniDonut';
