import { default as Animations } from './animations';
import { BoxStylesFormatters } from './boxStylesFormatters';
import { default as Containers } from './containers';
import { default as Content } from './content';
import { BoxStyle, BoxStyleValue } from './coreTypes';
import { default as Css } from './css';
import { default as Gradients } from './gradients';
import { default as Palette } from './palette';
import { default as Shadows } from './shadows';
import { default as Variables } from './variables';
export declare const cssStyles: {
    /**
     * The appearance CSS property is used to display UI elements with platform-specific styling, based on the operating system's theme.
     * @example appearance="none" → appearance: none
     */
    appearance: {
        values: readonly ["none", "auto", "menulist-button", "textfield", "button", "checkbox"];
    }[];
    /**
     * One of the four presets — their `@keyframes` are registered already and their durations ride
     * `--transitionTime`, so `prefers-reduced-motion` stops them with no opt-in. Declared before the
     * longhands below, so `animationDuration` and friends override what a preset chose.
     * @example animation="spin" → animation: spin calc(4 * var(--transitionTime)) linear infinite
     */
    animation: {
        values: readonly ["spin", "pulse", "bounce", "ping", "none"];
        valueFormat: (value: string) => string;
        keyframes: (value: BoxStyleValue) => string[];
    }[];
    /**
     * The animation-delay CSS property specifies the amount of time to wait from applying the animation to an element before beginning to perform the animation. Milliseconds, like every other time here.
     * @example animationDelay={150} → animation-delay: 150ms
     */
    animationDelay: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.ms;
    }[];
    /**
     * The animation-direction CSS property sets whether an animation should play forward, backward, or alternate back and forth between playing the sequence forward and backward.
     * @example animationDirection="normal" → animation-direction: normal
     */
    animationDirection: {
        values: readonly ["normal", "reverse", "alternate", "alternate-reverse"];
        styleName: string;
    }[];
    /**
     * The animation-duration CSS property sets the length of time that an animation takes to complete one cycle. Milliseconds: `animationDuration={1100}` is `1100ms`, and it names its own time, so reduced motion cannot reach it — say so with `motionReduce`. A spring name is that spring's settling time.
     * @example animationDuration={1100} → animation-duration: 1100ms
     */
    animationDuration: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.ms;
    } | {
        values: readonly ["spring", "spring-gentle", "spring-bouncy", "spring-snappy"];
        styleName: string;
        valueFormat: (value: string) => string;
    })[];
    /**
     * The animation-fill-mode CSS property sets how a CSS animation applies styles to its target before and after its execution.
     * @example animationFillMode="none" → animation-fill-mode: none
     */
    animationFillMode: {
        values: readonly ["none", "forwards", "backwards", "both"];
        styleName: string;
    }[];
    /**
     * The animation-iteration-count CSS property sets the number of times an animation sequence should be played before stopping.
     * @example animationIterationCount={3} → animation-iteration-count: 3
     */
    animationIterationCount: ({
        values: readonly ["infinite"];
        styleName: string;
    } | {
        values: number;
        styleName: string;
    })[];
    /**
     * Which `@keyframes` to run: a sequence registered with `Box.keyframes()`, one of the four preset
     * names, or a name from a stylesheet this library never wrote — an unknown name is left alone rather
     * than dropped, because `@keyframes` can come from anywhere.
     * @example animationName="spin" → animation-name: spin
     */
    animationName: {
        values: string;
        styleName: string;
        keyframes: (value: BoxStyleValue) => string[];
    }[];
    /**
     * The animation-play-state CSS property sets whether an animation is running or paused.
     * @example animationPlayState="running" → animation-play-state: running
     */
    animationPlayState: {
        values: readonly ["running", "paused"];
        styleName: string;
    }[];
    /**
     * How an animation progresses through each cycle: a keyword, one of the four sampled springs, or a curve
     * of your own — `cubic-bezier()`, `steps()` and `linear()` are values. A spring names its duration too.
     * @example animationTimingFunction="linear" → animation-timing-function: linear
     */
    animationTimingFunction: ({
        values: readonly ["linear", "ease", "ease-in", "ease-in-out", "ease-out", "step-start", "step-end"];
        styleName: string;
        declarations?: undefined;
        match?: undefined;
    } | {
        values: readonly ["spring", "spring-gentle", "spring-bouncy", "spring-snappy"];
        styleName: string;
        declarations: (value: BoxStyleValue) => string;
        match?: undefined;
    } | {
        values: Animations.TimingFunction;
        match: typeof Animations.isTimingFunction;
        styleName: string;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * The border-width shorthand CSS property sets the width of an element's border.
     * @example b={4} → border-width: 4px
     */
    b: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.px;
    }[];
    /**
     * The border-width shorthand CSS property sets the width of an element's left and right border.
     * @example bx={4} → border-inline-width: 4px
     */
    bx: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.px;
    }[];
    /**
     * The border-width shorthand CSS property sets the width of an element's top and bottom border.
     * @example by={4} → border-block-width: 4px
     */
    by: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.px;
    }[];
    /**
     * The border-top-width CSS property sets the width of the top border of an element.
     * @example bt={4} → border-top-width: 4px
     */
    bt: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.px;
    }[];
    /**
     * The border-right-width CSS property sets the width of the right border of an element.
     * @example br={4} → border-right-width: 4px
     */
    br: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.px;
    }[];
    /**
     * The border-bottom-width CSS property sets the width of the bottom border of an element.
     * @example bb={4} → border-bottom-width: 4px
     */
    bb: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.px;
    }[];
    /**
     * The border-left-width CSS property sets the width of the left border of an element.
     * @example bl={4} → border-left-width: 4px
     */
    bl: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.px;
    }[];
    /**
     * The border-inline-start-width CSS property sets the width of the border on the side the text starts from: `bl` in a left-to-right writing mode, `br` in a right-to-left one.
     * @example bs={4} → border-inline-start-width: 4px
     */
    bs: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.px;
    }[];
    /**
     * The border-inline-end-width CSS property sets the width of the border on the side the text ends at: `br` in a left-to-right writing mode, `bl` in a right-to-left one.
     * @example be={4} → border-inline-end-width: 4px
     */
    be: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.px;
    }[];
    /**
     * The border-style shorthand CSS property sets the line style for all four sides of an element's border.
     * @example borderStyle="solid" → border-style: solid
     */
    borderStyle: {
        styleName: string;
        values: readonly ["solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset", "none", "hidden"];
    }[];
    /**
     * The border-radius CSS property rounds the corners of an element's outer border edge. You can set a single radius to make circular corners, or two radii to make elliptical corners.
     * @example borderRadius={4} → border-radius: 1rem
     */
    borderRadius: {
        styleName: string;
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * The border-top-radius CSS property rounds the top corners of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner.
     * @example borderRadiusTop={4} → border-top-left-radius: 1rem; border-top-right-radius: 1rem
     */
    borderRadiusTop: {
        values: number;
        styleName: string[];
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * The border-right-radius CSS property rounds the right corners of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner.
     * @example borderRadiusRight={4} → border-top-right-radius: 1rem; border-bottom-right-radius: 1rem
     */
    borderRadiusRight: {
        values: number;
        styleName: string[];
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * The border-bottom-radius CSS property rounds the bottom corners of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner.
     * @example borderRadiusBottom={4} → border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem
     */
    borderRadiusBottom: {
        values: number;
        styleName: string[];
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * The border-left-radius CSS property rounds the left corners of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner.
     * @example borderRadiusLeft={4} → border-top-left-radius: 1rem; border-bottom-left-radius: 1rem
     */
    borderRadiusLeft: {
        values: number;
        styleName: string[];
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * The border-top-left-radius CSS property rounds the top-left corner of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner.
     * @example borderRadiusTopLeft={4} → border-top-left-radius: 1rem
     */
    borderRadiusTopLeft: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * The border-top-right-radius CSS property rounds the top-right corner of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner.
     * @example borderRadiusTopRight={4} → border-top-right-radius: 1rem
     */
    borderRadiusTopRight: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * The border-bottom-right-radius CSS property rounds the bottom-right corner of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner.
     * @example borderRadiusBottomRight={4} → border-bottom-right-radius: 1rem
     */
    borderRadiusBottomRight: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * The border-bottom-left-radius CSS property rounds the bottom-left corner of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner.
     * @example borderRadiusBottomLeft={4} → border-bottom-left-radius: 1rem
     */
    borderRadiusBottomLeft: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * Rounds both corners on the side the text starts from: the left ones in a left-to-right writing mode, the right ones in a right-to-left one.
     * @example borderRadiusStart={4} → border-start-start-radius: 1rem; border-end-start-radius: 1rem
     */
    borderRadiusStart: {
        values: number;
        styleName: string[];
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * Rounds both corners on the side the text ends at: the right ones in a left-to-right writing mode, the left ones in a right-to-left one.
     * @example borderRadiusEnd={4} → border-start-end-radius: 1rem; border-end-end-radius: 1rem
     */
    borderRadiusEnd: {
        values: number;
        styleName: string[];
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * Rounds the block-start, inline-start corner: top-left in a left-to-right writing mode, top-right in a right-to-left one.
     * @example borderRadiusStartStart={4} → border-start-start-radius: 1rem
     */
    borderRadiusStartStart: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * Rounds the block-start, inline-end corner: top-right in a left-to-right writing mode, top-left in a right-to-left one.
     * @example borderRadiusStartEnd={4} → border-start-end-radius: 1rem
     */
    borderRadiusStartEnd: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * Rounds the block-end, inline-end corner: bottom-right in a left-to-right writing mode, bottom-left in a right-to-left one.
     * @example borderRadiusEndEnd={4} → border-end-end-radius: 1rem
     */
    borderRadiusEndEnd: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * Rounds the block-end, inline-start corner: bottom-left in a left-to-right writing mode, bottom-right in a right-to-left one.
     * @example borderRadiusEndStart={4} → border-end-start-radius: 1rem
     */
    borderRadiusEndStart: {
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    }[];
    /**
     * The position CSS property sets how an element is positioned in a document. The top, right, bottom, and left properties determine the final location of positioned elements.
     * @example position="absolute" → position: absolute
     */
    position: {
        values: readonly ["static", "relative", "absolute", "fixed", "sticky"];
    }[];
    /**
     * The top CSS property sets the vertical position of a positioned element. This inset property has no effect on non-positioned elements.
     * @example top={4} → top: 1rem
     */
    top: ({
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The right CSS property participates in specifying the horizontal position of a positioned element. This inset property has no effect on non-positioned elements.
     * @example right={4} → right: 1rem
     */
    right: ({
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The bottom CSS property participates in setting the vertical position of a positioned element. This inset property has no effect on non-positioned elements.
     * @example bottom={4} → bottom: 1rem
     */
    bottom: ({
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The left CSS property participates in specifying the horizontal position of a positioned element. This inset property has no effect on non-positioned elements.
     * @example left={4} → left: 1rem
     */
    left: ({
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The inset CSS property is a shorthand that corresponds to the top, right, bottom, and/or left properties. It has the same multi-value syntax of the margin shorthand.
     * @example inset={4} → inset: 1rem
     */
    inset: ({
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The inset-inline CSS shorthand sets both insets on the inline axis: `insetX` is `left` and `right` in a left-to-right writing mode, the way `mx` is `margin-inline`.
     * @example insetX={4} → inset-inline: 1rem
     */
    insetX: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        styleName: string;
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The inset-block CSS shorthand sets both insets on the block axis — `top` and `bottom` in a horizontal writing mode.
     * @example insetY={4} → inset-block: 1rem
     */
    insetY: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        styleName: string;
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The inset-inline-start CSS property sets the distance from the edge the text starts at: `left` in a left-to-right writing mode, `right` in a right-to-left one.
     * @example insetStart={4} → inset-inline-start: 1rem
     */
    insetStart: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        styleName: string;
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The inset-inline-end CSS property sets the distance from the edge the text ends at: `right` in a left-to-right writing mode, `left` in a right-to-left one.
     * @example insetEnd={4} → inset-inline-end: 1rem
     */
    insetEnd: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        styleName: string;
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The `box-sizing` CSS property sets how the total width and height of an element is calculated.
     * @example boxSizing="border-box" → box-sizing: border-box
     */
    boxSizing: {
        values: readonly ["border-box", "content-box"];
        styleName: string;
    }[];
    /**
     * The content-visibility CSS property controls whether or not an element renders its contents at all, along with forcing a strong set of containments, allowing user agents to potentially omit large swathes of layout and rendering work until it becomes needed. It enables the user agent to skip an element's rendering work (including layout and painting) until it is needed — which makes the initial page load much faster.
     * @example contentVisibility="visible" → content-visibility: visible
     */
    contentVisibility: {
        values: readonly ["visible", "hidden"];
        styleName: string;
    }[];
    /**
     * The clip-path CSS property creates a clipping region that sets what part of an element should be shown. Parts that are inside the region are shown, while those outside are hidden. `inset(50%)` clips an element away entirely without removing it from the accessibility tree — the visually-hidden recipe. A `<ClipPath>` in the document is `clipPath="url(#frame)"`.
     * @example clipPath="inset(50%)" → clip-path: inset(50%)
     */
    clipPath: ({
        values: readonly ["inset(50%)", "none"];
        styleName: string;
    } | {
        styleName: string;
        values: Variables.Reference;
        match: typeof Variables.isReference;
    })[];
    /**
     * The cursor CSS property sets the mouse cursor, if any, to show when the mouse pointer is over an element.
     * @example cursor="pointer" → cursor: pointer
     */
    cursor: {
        values: readonly ["auto", "default", "none", "context-menu", "help", "pointer", "progress", "wait", "cell", "crosshair", "text", "vertical-text", "alias", "copy", "move", "no-drop", "not-allowed", "e-resize", "n-resize", "ne-resize", "nw-resize", "s-resize", "se-resize", "sw-resize", "w-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "col-resize", "row-resize", "all-scroll", "zoom-in", "zoom-out", "grab", "grabbing"];
    }[];
    /**
     * The `display` CSS property sets whether an element is treated as a block or inline box and the layout used for its children, such as flow layout, grid or flex.
     * @example display="none" → display: none
     */
    display: {
        values: readonly ["none", "block", "inline", "inline-block", "flex", "inline-flex", "grid", "inline-grid", "contents", "table", "table-header-group", "table-row-group", "table-row", "table-cell"];
    }[];
    /**
     * The `inline` property is a shortcut to transform `block`, `flex` and `grid` value to `inline-block`, `inline-flex` and `inline-grid` respectively.
     * @example inline → display: inline-block
     */
    inline: {
        values: readonly [true];
        styleName: string;
        valueFormat: () => string;
    }[];
    /**
     * Makes this element a query container, so the `cq` styles inside it answer to *its* width: `container`
     * alone is an anonymous one (the nearest container `cq={{ md: … }}` finds), a name is what
     * `cq={{ 'sidebar/md': … }}` addresses. Both mean `container-type: inline-size` — the only type that
     * does not need the element to have a size of its own. The three props are declared shorthand-first, so
     * `containerType` beside `container` overrides the type and keeps the name.
     * @example container → container-type: inline-size
     */
    container: ({
        values: readonly [true];
        styleName: string;
        valueFormat: () => string;
        match?: undefined;
    } | {
        values: string;
        match: typeof Containers.isContainerName;
        styleName: string;
        valueFormat: (value: string) => string;
    })[];
    /**
     * The name `cq={{ 'sidebar/md': … }}` addresses. Only a query container answers, so pair it with `containerType`.
     * @example containerName="sidebar" → container-name: sidebar
     */
    containerName: {
        values: string;
        match: typeof Containers.isContainerName;
        styleName: string;
    }[];
    /**
     * What may be asked about this container: `inline-size` (its width, what `container` sets), `size` (both
     * axes — which needs the element to have a block size of its own, or its content stops laying it out),
     * or `normal` to stop being a query container at all.
     * @example containerType="inline-size" → container-type: inline-size
     */
    containerType: {
        values: readonly ["inline-size", "size", "normal"];
        styleName: string;
    }[];
    /**
     * Whether `height`/`width` may interpolate to and from a keyword — `auto`, `min-content`, `fit-content`.
     * Inherited, so it belongs on the container and every size inside it animates; Chromium-only for now,
     * and elsewhere a `height: auto` transition simply snaps, which is what it already does today.
     * @example interpolateSize="numeric-only" → interpolate-size: numeric-only
     */
    interpolateSize: {
        styleName: string;
        values: readonly ["numeric-only", "allow-keywords"];
    }[];
    /**
     * The CSS justify-content property defines how the browser distributes space between and around content items along the main axis of a flex container and the inline axis of grid and multicol containers.
     * @example jc="start" → justify-content: start
     */
    jc: {
        styleName: string;
        values: readonly ["start", "end", "flex-start", "flex-end", "center", "left", "right", "space-between", "space-around", "space-evenly", "stretch", "safe center", "safe start", "safe end", "unsafe center", "unsafe start", "unsafe end"];
    }[];
    /**
     * The CSS align-items property sets the align-self value on all direct children as a group. In flexbox, it controls the alignment of items on the cross axis. In grid layout, it controls the alignment of items on the block axis within their grid areas.
     * @example ai="stretch" → align-items: stretch
     */
    ai: {
        styleName: string;
        values: readonly ["stretch", "flex-start", "flex-end", "center", "baseline", "start", "end", "self-start", "self-end", "safe center", "safe start", "safe end", "unsafe center", "unsafe start", "unsafe end"];
    }[];
    /**
     * The CSS justify-items property sets the `justify-self` of every item in the box: in a grid, where each one sits on the inline axis of its own area.
     * @example justifyItems="normal" → justify-items: normal
     */
    justifyItems: {
        styleName: string;
        values: readonly ["normal", "start", "end", "center", "stretch", "baseline", "left", "right", "self-start", "self-end", "safe center", "safe start", "safe end", "unsafe center", "unsafe start", "unsafe end"];
    }[];
    /**
     * The place-items CSS shorthand sets `align-items` and `justify-items` in one declaration — `placeItems="center"` is the whole of grid centring.
     * @example placeItems="normal" → place-items: normal
     */
    placeItems: {
        styleName: string;
        values: readonly ["normal", "start", "end", "center", "stretch", "baseline", "self-start", "self-end", "safe center", "safe start", "safe end", "unsafe center", "unsafe start", "unsafe end"];
    }[];
    /**
     * The place-content CSS shorthand sets `alignContent` and `justifyContent` at once, so one keyword
     * places a grid’s tracks on both axes. It takes the overflow-safe alignments too, and they apply to both.
     * @example placeContent="start" → place-content: start
     */
    placeContent: {
        styleName: string;
        values: readonly ["start", "end", "flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly", "stretch", "baseline", "safe center", "safe start", "safe end", "unsafe center", "unsafe start", "unsafe end"];
    }[];
    /**
     * The CSS align-content property sets the distribution of space between and around content items along a flexbox's cross axis, or a grid or block-level element's block axis.
     * @example alignContent="flex-start" → align-content: flex-start
     */
    alignContent: {
        styleName: string;
        values: readonly ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly", "stretch", "start", "end", "baseline", "normal", "safe center", "safe start", "safe end", "unsafe center", "unsafe start", "unsafe end"];
    }[];
    /**
     * The flex CSS shorthand property sets flex to fit the space available in its flex container.
     * @example flex1 → flex: 1
     */
    flex1: {
        styleName: string;
        values: readonly [true];
        valueFormat: () => string;
    }[];
    /**
     * The flex-direction CSS property sets how flex items are placed in the flex container defining the main axis and the direction (normal or reversed).
     * @example d="row" → flex-direction: row
     */
    d: {
        styleName: string;
        values: readonly ["row", "row-reverse", "column", "column-reverse"];
    }[];
    /**
     * The flex-wrap CSS property sets whether flex items are forced onto one line or can wrap onto multiple lines. If wrapping is allowed, it sets the direction that lines are stacked.
     * @example flexWrap="nowrap" → flex-wrap: nowrap
     */
    flexWrap: {
        styleName: string;
        values: readonly ["nowrap", "wrap", "wrap-reverse"];
    }[];
    /**
     * The flex-grow CSS property sets the flex grow factor, which specifies how much of the flex container's positive free space, if any, should be assigned to the flex item's main size.
     * @example flexGrow={4} → flex-grow: 4
     */
    flexGrow: {
        styleName: string;
        values: number;
    }[];
    /**
     * The flex-shrink CSS property sets the flex shrink factor of a flex item. If the size of all flex items is larger than the flex container, the flex items can shrink to fit according to their flex-shrink value. Each flex line's negative free space is distributed between the line's flex items that have a flex-shrink value greater than 0.
     * @example flexShrink={4} → flex-shrink: 4
     */
    flexShrink: {
        styleName: string;
        values: number;
    }[];
    /**
     * The align-self CSS property overrides a grid or flex item's align-items value. In grid, it aligns the item inside the grid area. In flexbox, it aligns the item on the cross axis.
     * @example alignSelf="auto" → align-self: auto
     */
    alignSelf: {
        styleName: string;
        values: readonly ["auto", "flex-start", "flex-end", "center", "baseline", "stretch", "start", "end", "self-start", "self-end", "safe center", "safe start", "safe end", "unsafe center", "unsafe start", "unsafe end"];
    }[];
    /**
     * The CSS justify-self property sets the way a box is justified inside its alignment container along the appropriate axis.
     * @example justifySelf="auto" → justify-self: auto
     */
    justifySelf: {
        styleName: string;
        values: readonly ["auto", "flex-start", "flex-end", "center", "baseline", "stretch", "start", "end", "left", "right", "self-start", "self-end", "safe center", "safe start", "safe end", "unsafe center", "unsafe start", "unsafe end"];
    }[];
    /**
     * The font-size CSS property sets the size of the font. Its divider is **16**, not the spacing scale’s 4, so the
     * number is the pixel size a reader was reaching for: `fontSize={14}` is `0.875rem`. Font-size-relative units
     * (`em`, `ex`) resolve against it.
     * @example fontSize={14} → font-size: 0.875rem
     */
    fontSize: ({
        styleName: string;
        values: number;
        valueFormat: (value: number) => string;
    } | {
        styleName: string;
        values: readonly ["inherit"];
        valueFormat?: undefined;
    })[];
    /**
     * The font-style CSS property sets whether a font should be styled with a normal, italic, or oblique face from its font-family.
     * @example fontStyle="italic" → font-style: italic
     */
    fontStyle: {
        styleName: string;
        values: readonly ["italic", "normal", "oblique"];
    }[];
    /**
     * The font-weight CSS property sets the weight (or boldness) of the font. The weights available depend on the font-family that is currently set.
     * @example fontWeight={700} → font-weight: 700
     */
    fontWeight: {
        styleName: string;
        values: readonly [100, 200, 300, 400, 500, 600, 700, 800, 900];
    }[];
    /**
     * The gap CSS shorthand property sets the gaps (also called gutters) between rows and columns. This property applies to multi-column, flex, and grid containers.
     * @example gap={4} → gap: 1rem
     */
    gap: ({
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The row-gap CSS property sets the size of the gap (gutter) between an element's rows.
     * @example rowGap={4} → row-gap: 1rem
     */
    rowGap: ({
        styleName: string;
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        styleName: string;
        valueFormat?: undefined;
    })[];
    /**
     * The column-gap CSS property sets the size of the gap (gutter) between an element's columns.
     * @example columnGap={4} → column-gap: 1rem
     */
    columnGap: ({
        styleName: string;
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        styleName: string;
        valueFormat?: undefined;
    })[];
    /**
     * The order CSS property sets the order to lay out an item in a flex or grid container. Items in a container are sorted by ascending order value and then by their source code order. Items not given an explicit order value are assigned the default value of 0.
     * @example order={4} → order: 4
     */
    order: {
        styleName: string;
        values: number;
    }[];
    /**
     * The height CSS property specifies the height of an element. By default, the property defines the height of the content area. If box-sizing is set to border-box, however, it instead determines the height of the border area.
     * @example height={4} → height: 1rem
     */
    height: ({
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["fit"];
        valueFormat: () => string;
    } | {
        values: readonly ["fit-screen"];
        valueFormat: () => string;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: readonly ["auto", "fit-content", "max-content", "min-content"];
        valueFormat?: undefined;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The min-height CSS property sets the minimum height of an element. It prevents the used value of the height property from becoming smaller than the value specified for min-height.
     * @example minHeight={4} → min-height: 1rem
     */
    minHeight: ({
        styleName: string;
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        styleName: string;
        values: readonly ["fit"];
        valueFormat: () => string;
    } | {
        styleName: string;
        values: readonly ["fit-screen"];
        valueFormat: () => string;
    } | {
        styleName: string;
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        styleName: string;
        values: readonly ["auto", "fit-content", "max-content", "min-content"];
        valueFormat?: undefined;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        styleName: string;
        valueFormat?: undefined;
    })[];
    /**
     * The max-height CSS property sets the maximum height of an element. It prevents the used value of the height property from becoming larger than the value specified for max-height.
     * @example maxHeight={4} → max-height: 1rem
     */
    maxHeight: ({
        styleName: string;
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        styleName: string;
        values: readonly ["fit"];
        valueFormat: () => string;
    } | {
        styleName: string;
        values: readonly ["fit-screen"];
        valueFormat: () => string;
    } | {
        styleName: string;
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        styleName: string;
        values: readonly ["auto", "fit-content", "max-content", "min-content"];
        valueFormat?: undefined;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        styleName: string;
        valueFormat?: undefined;
    })[];
    /**
     * The width CSS property sets an element's width. By default, it sets the width of the content area, but if box-sizing is set to border-box, it sets the width of the border area.
     * @example width={4} → width: 1rem
     */
    width: ({
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["fit"];
        valueFormat: () => string;
    } | {
        values: readonly ["fit-screen"];
        valueFormat: () => string;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        values: readonly ["auto", "fit-content", "max-content", "min-content"];
        valueFormat?: undefined;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The min-width CSS property sets the minimum width of an element. It prevents the used value of the width property from becoming smaller than the value specified for min-width.
     * @example minWidth={4} → min-width: 1rem
     */
    minWidth: ({
        styleName: string;
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        styleName: string;
        values: readonly ["fit"];
        valueFormat: () => string;
    } | {
        styleName: string;
        values: readonly ["fit-screen"];
        valueFormat: () => string;
    } | {
        styleName: string;
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        styleName: string;
        values: readonly ["auto", "fit-content", "max-content", "min-content"];
        valueFormat?: undefined;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        styleName: string;
        valueFormat?: undefined;
    })[];
    /**
     * The max-width CSS property sets the maximum width of an element. It prevents the used value of the width property from becoming larger than the value specified by max-width.
     * @example maxWidth={4} → max-width: 1rem
     */
    maxWidth: ({
        styleName: string;
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        styleName: string;
        values: readonly ["fit"];
        valueFormat: () => string;
    } | {
        styleName: string;
        values: readonly ["fit-screen"];
        valueFormat: () => string;
    } | {
        styleName: string;
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        styleName: string;
        values: readonly ["auto", "fit-content", "max-content", "min-content"];
        valueFormat?: undefined;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        styleName: string;
        valueFormat?: undefined;
    })[];
    /**
     * The aspect-ratio CSS property sets a preferred ratio for the box, which the sizing props then fill in
     * one axis of: `aspectRatio="video" width="fit"` is a 16/9 embed. Two names (`square`, `video`), a ratio
     * written compactly (`'4/3'`), or a number — the only prop taking both a fraction string and a division.
     * @example aspectRatio="video" → aspect-ratio: 16 / 9
     */
    aspectRatio: ({
        styleName: string;
        values: readonly ["auto", "square", "video"];
        valueFormat: (value: string) => string;
    } | {
        values: `${number}/${number}`;
        match: typeof Variables.isRatio;
        valueFormat: (value: string) => string;
        styleName: string;
    } | {
        styleName: string;
        values: number;
        valueFormat?: undefined;
    })[];
    /**
     * The letter-spacing CSS property sets the horizontal spacing behavior between text characters. This value is added to the natural spacing between characters while rendering the text. Positive values of letter-spacing causes characters to spread farther apart, while negative values of letter-spacing bring characters closer together.
     * @example letterSpacing={4} → letter-spacing: 4px
     */
    letterSpacing: {
        styleName: string;
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.px;
    }[];
    /**
     * The line-height CSS property sets the height of a line box. Direct **pixels** here — `lineHeight={24}` is
     * `24px`, not the unitless multiple of the font size CSS takes as well; `"font-size"` is that multiple, at 1.
     * @example lineHeight={24} → line-height: 24px
     */
    lineHeight: ({
        styleName: string;
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.px;
    } | {
        styleName: string;
        values: readonly ["font-size"];
        valueFormat: () => string;
    })[];
    /**
     * The list-style CSS shorthand property allows you to set all the list style properties at once.
     * @example listStyle="square" → list-style: square
     */
    listStyle: {
        styleName: string;
        values: readonly ["square", "inside", "outside", "none"];
    }[];
    /**
     * The margin CSS shorthand property sets the margin area on all four sides of an element.
     * @example m={4} → margin: 1rem
     */
    m: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        styleName: string;
        valueFormat?: undefined;
    } | {
        styleName: string;
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        styleName: string;
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The margin-inline CSS shorthand property is a shorthand property that defines both the logical inline start and end margins of an element, which maps to physical margins depending on the element's writing mode, directionality, and text orientation.
     * @example mx={4} → margin-inline: 1rem
     */
    mx: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        styleName: string;
        valueFormat?: undefined;
    } | {
        styleName: string;
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        styleName: string;
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The margin-block CSS shorthand property defines the logical block start and end margins of an element, which maps to physical margins depending on the element's writing mode, directionality, and text orientation.
     * @example my={4} → margin-block: 1rem
     */
    my: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        styleName: string;
        valueFormat?: undefined;
    } | {
        styleName: string;
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        styleName: string;
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The margin-top CSS property sets the margin area on the top of an element. A positive value places it farther from its neighbors, while a negative value places it closer.
     * @example mt={4} → margin-top: 1rem
     */
    mt: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        styleName: string;
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The margin-right CSS property sets the margin area on the right side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.
     * @example mr={4} → margin-right: 1rem
     */
    mr: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        styleName: string;
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The margin-bottom CSS property sets the margin area on the bottom of an element. A positive value places it farther from its neighbors, while a negative value places it closer.
     * @example mb={4} → margin-bottom: 1rem
     */
    mb: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        styleName: string;
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The margin-left CSS property sets the margin area on the left side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.
     * @example ml={4} → margin-left: 1rem
     */
    ml: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        styleName: string;
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The margin-inline-start CSS property sets the margin on the side the text starts from: `ml` in a left-to-right writing mode, `mr` in a right-to-left one.
     * @example ms={4} → margin-inline-start: 1rem
     */
    ms: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        styleName: string;
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The margin-inline-end CSS property sets the margin on the side the text ends at: `mr` in a left-to-right writing mode, `ml` in a right-to-left one.
     * @example me={4} → margin-inline-end: 1rem
     */
    me: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["auto"];
        styleName: string;
        valueFormat?: undefined;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The padding CSS shorthand property sets the padding area on all four sides of an element at once.
     * @example p={4} → padding: 1rem
     */
    p: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The padding-inline CSS shorthand property defines the logical inline start and end padding of an element, which maps to physical padding properties depending on the element's writing mode, directionality, and text orientation.
     * @example px={4} → padding-inline: 1rem
     */
    px: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The padding-block CSS shorthand property defines the logical block start and end padding of an element, which maps to physical padding properties depending on the element's writing mode, directionality, and text orientation.
     * @example py={4} → padding-block: 1rem
     */
    py: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The padding-top CSS property sets the height of the padding area on the top of an element.
     * @example pt={4} → padding-top: 1rem
     */
    pt: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The padding-right CSS property sets the width of the padding area on the right of an element.
     * @example pr={4} → padding-right: 1rem
     */
    pr: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The padding-bottom CSS property sets the height of the padding area on the bottom of an element.
     * @example pb={4} → padding-bottom: 1rem
     */
    pb: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The padding-left CSS property sets the width of the padding area to the left of an element.
     * @example pl={4} → padding-left: 1rem
     */
    pl: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The padding-inline-start CSS property sets the padding on the side the text starts from: `pl` in a left-to-right writing mode, `pr` in a right-to-left one.
     * @example ps={4} → padding-inline-start: 1rem
     */
    ps: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The padding-inline-end CSS property sets the padding on the side the text ends at: `pr` in a left-to-right writing mode, `pl` in a right-to-left one.
     * @example pe={4} → padding-inline-end: 1rem
     */
    pe: ({
        values: number;
        styleName: string;
        valueFormat: typeof BoxStylesFormatters.Value.rem;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        valueFormat: typeof BoxStylesFormatters.Value.fraction;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
        valueFormat?: undefined;
    })[];
    /**
     * The object-fit CSS property sets how the content of a replaced element, such as an <img> or <video>, should be resized to fit its container.
     * @example objectFit="fill" → object-fit: fill
     */
    objectFit: {
        styleName: string;
        values: readonly ["fill", "contain", "cover", "scale-down", "none"];
    }[];
    /**
     * The opacity CSS property sets the opacity of an element. Opacity is the degree to which content behind an element is hidden, and is the opposite of transparency.
     * @example opacity={0.5} → opacity: 0.5
     */
    opacity: {
        values: readonly [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    }[];
    /**
     * The CSS outline-width property sets the thickness of an element's outline. An outline is a line that is drawn around an element, outside the border. A width alone is enough: the style comes with it, and `outlineStyle` — declared after this — is what changes it.
     * @example outline={4} → outline-width: 4px; outline-style: solid
     */
    outline: {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    }[];
    /**
     * The outline-style CSS property sets the style of an element's outline. An outline is a line that is drawn around an element, outside the border.
     * @example outlineStyle="solid" → outline-style: solid
     */
    outlineStyle: {
        styleName: string;
        values: readonly ["solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset", "none", "hidden"];
    }[];
    /**
     * The outline-offset CSS property sets the amount of space between an outline and the edge or border of an element.
     * @example outlineOffset={4} → outline-offset: 4px
     */
    outlineOffset: {
        styleName: string;
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.px;
    }[];
    /**
     * The overflow CSS shorthand property sets the desired behavior when content does not fit in the element's padding box (overflows) in the horizontal and/or vertical direction.
     * @example overflow="auto" → overflow: auto
     */
    overflow: {
        values: readonly ["auto", "hidden", "scroll", "visible"];
    }[];
    /**
     * The overflow-x CSS property sets what shows when content overflows a block-level element's left and right edges. This may be nothing, a scroll bar, or the overflow content. This property may also be set by using the overflow shorthand property.
     * @example overflowX="auto" → overflow-x: auto
     */
    overflowX: {
        styleName: string;
        values: readonly ["auto", "hidden", "scroll", "visible"];
    }[];
    /**
     * The overflow-y CSS property sets what shows when content overflows a block-level element's top and bottom edges. This may be nothing, a scroll bar, or the overflow content. This property may also be set by using the overflow shorthand property.
     * @example overflowY="auto" → overflow-y: auto
     */
    overflowY: {
        styleName: string;
        values: readonly ["auto", "hidden", "scroll", "visible"];
    }[];
    /**
     * The pointer-events CSS property sets under what circumstances (if any) a particular graphic element can become the target of pointer events.
     * @example pointerEvents="none" → pointer-events: none
     */
    pointerEvents: {
        styleName: string;
        values: readonly ["none", "auto", "all"];
    }[];
    /**
     * The resize CSS property sets whether an element is resizable, and if so, in which directions.
     * @example resize="none" → resize: none
     */
    resize: {
        values: readonly ["none", "both", "horizontal", "vertical", "block", "inline"];
    }[];
    /**
     * The rotate CSS property allows you to specify rotation transforms individually and independently of the transform property. This maps better to typical user interface usage, and saves having to remember the exact order of transform functions to specify in the transform property.
     * @example rotate={45} → rotate: 45deg
     */
    rotate: {
        values: readonly [0, 45, 90, 135, 180, 270, 360, -45, -90, -135, -180, -270];
        valueFormat: (value: number) => string;
    }[];
    /**
     * Mirrors the element: `xAxis` flips it left to right, `yAxis` top to bottom. It writes the `scale`
     * property, which is what `scale` writes too — use one of them. `rtl={{ flip: 'xAxis' }}` is the arrow
     * that has to point the other way in a right-to-left reading.
     * @example flip="xAxis" → scale: -1 1
     */
    flip: {
        styleName: string;
        values: readonly ["xAxis", "yAxis"];
        valueFormat: (value: string) => "-1 1" | "1 -1";
    }[];
    /**
     * The scale CSS property lets you specify scale transforms individually and independently of the transform property: `scale={1.05}` is 105% in both axes. Declared after `flip`, which writes the same property — use one or the other, not both.
     * @example scale={4} → scale: 4
     */
    scale: {
        values: number;
    }[];
    /**
     * The text-align CSS property sets the horizontal alignment of the inline-level content inside a block
     * element or table-cell box. `start`/`end` follow the text direction where `left`/`right` do not.
     * @example textAlign="left" → text-align: left
     */
    textAlign: {
        styleName: string;
        values: readonly ["left", "right", "start", "end", "center", "justify"];
    }[];
    /**
     * The text-decoration shorthand CSS property sets the appearance of decorative lines on text. It is a shorthand for text-decoration-line, text-decoration-color, text-decoration-style, and the newer text-decoration-thickness property.
     * @example textDecoration="none" → text-decoration: none
     */
    textDecoration: {
        styleName: string;
        values: readonly ["none", "underline", "overline", "line-through"];
    }[];
    /**
     * The text-overflow CSS property sets how hidden overflow content is signaled to users. It can be clipped, display an ellipsis ('…'), or display a custom string.
     * @example textOverflow="clip" → text-overflow: clip
     */
    textOverflow: {
        styleName: string;
        values: readonly ["clip", "ellipsis"];
    }[];
    /**
     * The text-transform CSS property specifies how to capitalize an element's text. It can be used to make text appear in all-uppercase or all-lowercase, or with each word capitalized. It also can help improve legibility for ruby.
     * @example textTransform="none" → text-transform: none
     */
    textTransform: {
        styleName: string;
        values: readonly ["none", "capitalize", "lowercase", "uppercase"];
    }[];
    /**
     * The text-wrap CSS shorthand property controls how text inside an element is wrapped. The different values provide:
     * @example textWrap="wrap" → text-wrap: wrap
     */
    textWrap: {
        styleName: string;
        values: readonly ["wrap", "nowrap", "balance", "pretty"];
    }[];
    /**
     * What a transition applies to: `all` (what the base class already does), `none`, or one of the property groups — `colors`, `opacity`, `shadow`, `transform`, `size`, `filter`.
     * @example transition="colors" → transition-property: color, background-color, border-color, outline-color, text-decoration-color, fi…
     */
    transition: {
        styleName: string;
        values: readonly ["none", "all", ...("filter" | "opacity" | "colors" | "shadow" | "transform" | "size")[]];
        valueFormat: (value: string) => "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke" | "opacity" | "box-shadow, text-shadow" | "transform, translate, rotate, scale" | "width, height" | "filter, backdrop-filter";
    }[];
    /**
     * Whether the properties that cannot be interpolated transition at all: `display`, `overlay`,
     * `content-visibility`. `allow-discrete` flips them at the *end* of the transition instead of the start,
     * which is what keeps an element in the DOM long enough to animate out of it.
     * @example transitionBehavior="normal" → transition-behavior: normal
     */
    transitionBehavior: {
        styleName: string;
        values: readonly ["normal", "allow-discrete"];
    }[];
    /**
     * The transition-delay CSS property specifies the duration to wait before starting a property's transition effect when its value changes. Milliseconds.
     * @example transitionDelay={150} → transition-delay: 150ms
     */
    transitionDelay: {
        styleName: string;
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.ms;
    }[];
    /**
     * How long a transition takes. Milliseconds, like every other time here — or a spring name, which is
     * that spring's settling time in `--transitionTime` units, so a spring stops under reduced motion.
     * @example transitionDuration={200} → transition-duration: 200ms
     */
    transitionDuration: ({
        styleName: string;
        values: number;
        valueFormat: typeof BoxStylesFormatters.Value.ms;
    } | {
        styleName: string;
        values: readonly ["spring", "spring-gentle", "spring-bouncy", "spring-snappy"];
        valueFormat: (value: string) => string;
    })[];
    /**
     * How a transition gets from one value to the other: a keyword, one of the four sampled springs
     * (`spring`, `spring-gentle`, `spring-bouncy`, `spring-snappy`), or a curve — `cubic-bezier()`,
     * `steps()` and `linear()` are values. A spring's other half is `transitionDuration`, which takes the
     * same four names.
     * @example transitionTimingFunction="linear" → transition-timing-function: linear
     */
    transitionTimingFunction: ({
        styleName: string;
        values: readonly ["linear", "ease", "ease-in", "ease-in-out", "ease-out", "step-start", "step-end"];
        declarations?: undefined;
        match?: undefined;
    } | {
        values: readonly ["spring", "spring-gentle", "spring-bouncy", "spring-snappy"];
        styleName: string;
        declarations: (value: BoxStyleValue) => string;
        match?: undefined;
    } | {
        values: Animations.TimingFunction;
        match: typeof Animations.isTimingFunction;
        styleName: string;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * The will-change CSS property warns the browser that a property is about to change, so it can promote
     * the element first instead of mid-animation. A hint with a real cost — a promoted layer holds memory
     * and can force text off subpixel rendering — so it belongs on the few elements that animate, not on a list.
     * @example willChange="transform" → will-change: transform
     */
    willChange: {
        styleName: string;
        values: readonly ["auto", "scroll-position", "contents", "transform", "opacity", "filter"];
    }[];
    /**
     * The user-select CSS property controls whether the user can select text. This doesn't have any effect on content loaded as part of a browser's user interface (its chrome), except in textboxes.
     * @example userSelect="none" → user-select: none
     */
    userSelect: {
        styleName: string;
        values: readonly ["none", "auto", "text", "all"];
    }[];
    /**
     * The visibility CSS property shows or hides an element without changing the layout of a document. The property can also hide rows or columns in a <table>.
     * @example visibility="visible" → visibility: visible
     */
    visibility: {
        styleName: string;
        values: readonly ["visible", "hidden", "collapse"];
    }[];
    /**
     * The white-space CSS property sets how white space inside an element is handled.
     * @example whiteSpace="break-spaces" → white-space: break-spaces
     */
    whiteSpace: {
        styleName: string;
        values: readonly ["break-spaces", "normal", "nowrap", "pre", "pre-line", "pre-wrap"];
    }[];
    /**
     * The z-index CSS property sets the z-order of a positioned element and its descendants or flex and grid items. Overlapping elements with a larger z-index cover those with a smaller one.
     * @example zIndex={1} → z-index: 1
     */
    zIndex: {
        styleName: string;
        values: readonly [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 100, 101, 102, 103, 104, 105, 1000, 1001, 1002, 1003, 1004, 1005];
    }[];
    /**
     * The grid-template-columns CSS property defines the line names and track sizing functions of the grid columns.
     * @example gridTemplateColumns={4} → grid-template-columns: repeat(4,minmax(0,1fr))
     */
    gridTemplateColumns: ({
        styleName: string;
        values: number;
        valueFormat: (value: number) => string;
    } | {
        styleName: string;
        values: readonly ["subgrid"];
        valueFormat?: undefined;
    })[];
    /**
     * The grid-template-rows CSS property defines the line names and track sizing functions of the grid rows.
     * @example gridTemplateRows={4} → grid-template-rows: repeat(4,minmax(0,1fr))
     */
    gridTemplateRows: ({
        styleName: string;
        values: number;
        valueFormat: (value: number) => string;
    } | {
        styleName: string;
        values: readonly ["subgrid"];
        valueFormat?: undefined;
    })[];
    /**
     * The grid-column CSS shorthand property specifies a grid item's size and location within a grid column by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.
     * @example gridColumn={4} → grid-column: span 4/span 4
     */
    gridColumn: ({
        styleName: string;
        values: number;
        valueFormat: (value: number) => string;
    } | {
        styleName: string;
        values: readonly ["full-row"];
        valueFormat: () => string;
    })[];
    /**
     * The grid-column-start CSS property specifies a grid item's start position within the grid column by contributing a line, a span, or nothing (automatic) to its grid placement. This start position defines the block-start edge of the grid area.
     * @example gridColumnStart={4} → grid-column-start: 4
     */
    gridColumnStart: {
        styleName: string;
        values: number;
    }[];
    /**
     * The grid-column-end CSS property specifies a grid item's end position within the grid column by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the block-end edge of its grid area.
     * @example gridColumnEnd={4} → grid-column-end: 4
     */
    gridColumnEnd: {
        styleName: string;
        values: number;
    }[];
    /**
     * The grid-row CSS shorthand property specifies a grid item's size and location within a grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.
     * @example gridRow={4} → grid-row: span 4/span 4
     */
    gridRow: ({
        styleName: string;
        values: number;
        valueFormat: (value: number) => string;
    } | {
        styleName: string;
        values: readonly ["full-column"];
        valueFormat: () => string;
    })[];
    /**
     * The grid-row-start CSS property specifies a grid item's start position within the grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start edge of its grid area.
     * @example gridRowStart={4} → grid-row-start: 4
     */
    gridRowStart: {
        styleName: string;
        values: number;
    }[];
    /**
     * The grid-row-end CSS property specifies a grid item's end position within the grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-end edge of its grid area.
     * @example gridRowEnd={4} → grid-row-end: 4
     */
    gridRowEnd: {
        styleName: string;
        values: number;
    }[];
    /**
     * The color CSS property sets the foreground color value of an element's text and text decorations, and sets the currentcolor value.
     * @example color="sky-500" → color: var(--sky-500)
     */
    color: ({
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
    } | {
        values: Variables.ColorType[];
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        valueFormat?: undefined;
    })[];
    /**
     * The background-color CSS property sets the background color of an element.
     * @example bgColor="sky-500" → background-color: var(--sky-500)
     */
    bgColor: ({
        values: Variables.ColorType[];
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
        styleName: string;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        styleName: string;
        valueFormat?: undefined;
    } | {
        styleName: string;
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
    })[];
    /**
     * The border-color shorthand CSS property sets the color of an element's border.
     * @example borderColor="sky-500" → border-color: var(--sky-500)
     */
    borderColor: ({
        values: Variables.ColorType[];
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
        styleName: string;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        styleName: string;
        valueFormat?: undefined;
    } | {
        styleName: string;
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
    })[];
    /**
     * The outline-color CSS property sets the color of an element's outline.
     * @example outlineColor="sky-500" → outline-color: var(--sky-500)
     */
    outlineColor: ({
        values: Variables.ColorType[];
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
        styleName: string;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        styleName: string;
        valueFormat?: undefined;
    } | {
        styleName: string;
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
    })[];
    /**
     * The accent-color CSS property tints the parts of a native control the page does not draw: a checkbox's
     * tick, a radio's dot, a range track, a progress bar. The one way to brand them without `appearance="none"`
     * and a rebuild, and it inherits — set it once on a form.
     * @example accentColor="sky-500" → accent-color: var(--sky-500)
     */
    accentColor: ({
        values: Variables.ColorType[];
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
        styleName: string;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        styleName: string;
        valueFormat?: undefined;
    } | {
        styleName: string;
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
    })[];
    /**
     * The caret-color CSS property sets the colour of the insertion caret in a text field or any editable element.
     * @example caretColor="sky-500" → caret-color: var(--sky-500)
     */
    caretColor: ({
        values: Variables.ColorType[];
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
        styleName: string;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        styleName: string;
        valueFormat?: undefined;
    } | {
        styleName: string;
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
    })[];
    /**
     * The color-scheme CSS property tells the browser which schemes the element is *built* for, and native
     * UI follows it: scrollbars, form controls, the spellcheck underline, `Canvas`/`CanvasText`. A dark theme
     * that leaves this alone gets light scrollbars over its dark page — `Box.Theme` sets it on the root.
     * @example colorScheme="normal" → color-scheme: normal
     */
    colorScheme: {
        styleName: string;
        values: readonly ["normal", "light", "dark", "light dark", "only light", "only dark"];
    }[];
    /**
     * The field-sizing CSS property lets a form control size itself to its content: `fieldSizing="content"` is a textarea that grows as it is typed into, with no JavaScript measuring anything.
     * @example fieldSizing="content" → field-sizing: content
     */
    fieldSizing: {
        styleName: string;
        values: readonly ["content", "fixed"];
    }[];
    /**
     * The fill CSS property defines how SVG text content and the interior canvas of SVG shapes are filled or painted. If present, it overrides the element's fill attribute. Takes a colour token, a paint server the document defines (`fill="url(#sky)"` — a `<LinearGradient>` or a pattern) or a variable somebody else declared (`fill="var(--chart-1)"`).
     * @example fill="sky-500" → fill: var(--sky-500)
     */
    fill: ({
        values: Variables.Reference;
        match: typeof Variables.isReference;
    } | {
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
    } | {
        values: Variables.ColorType[];
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        valueFormat?: undefined;
    })[];
    /**
     * The fill-opacity CSS property defines the opacity of the paint applied to the interior of an SVG shape or to SVG text.
     * @example fillOpacity={0.5} → fill-opacity: 0.5
     */
    fillOpacity: {
        values: readonly [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
        styleName: string;
    }[];
    /**
     * The fill-rule CSS property defines which parts of a self-intersecting SVG shape count as inside it, and are therefore filled.
     * @example fillRule="nonzero" → fill-rule: nonzero
     */
    fillRule: {
        values: readonly ["nonzero", "evenodd"];
        styleName: string;
    }[];
    /**
     * The stroke CSS property defines the color or SVG paint server used to draw an element's stroke. Takes a colour token, `stroke="url(#sky)"` for a paint server the document defines, or `stroke="var(--chart-1)"` for a variable somebody else declared.
     * @example stroke="sky-500" → stroke: var(--sky-500)
     */
    stroke: ({
        values: Variables.Reference;
        match: typeof Variables.isReference;
    } | {
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
    } | {
        values: Variables.ColorType[];
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        valueFormat?: undefined;
    })[];
    /**
     * The stroke-opacity CSS property defines the opacity of the paint applied to an SVG element's stroke.
     * @example strokeOpacity={0.5} → stroke-opacity: 0.5
     */
    strokeOpacity: {
        values: readonly [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
        styleName: string;
    }[];
    /**
     * The stroke-width CSS property sets the width of an SVG element's stroke, in user units — `strokeWidth={2}` is `stroke-width: 2`, no divider.
     * @example strokeWidth={4} → stroke-width: 4
     */
    strokeWidth: {
        values: number;
        styleName: string;
    }[];
    /**
     * The stroke-linecap CSS property defines the shape drawn at the two ends of an open SVG subpath.
     * @example strokeLinecap="butt" → stroke-linecap: butt
     */
    strokeLinecap: {
        values: readonly ["butt", "round", "square"];
        styleName: string;
    }[];
    /**
     * The stroke-linejoin CSS property defines the shape drawn where two segments of an SVG path meet.
     * @example strokeLinejoin="miter" → stroke-linejoin: miter
     */
    strokeLinejoin: {
        values: readonly ["miter", "round", "bevel"];
        styleName: string;
    }[];
    /**
     * The stroke-miterlimit CSS property sets how far a miter join may extend before it is cut back to a bevel. Values below 1 are invalid.
     * @example strokeMiterlimit={4} → stroke-miterlimit: 4
     */
    strokeMiterlimit: {
        values: number;
        styleName: string;
    }[];
    /**
     * The stroke-dasharray CSS property turns an SVG stroke into dashes: a single number is the dash and the gap alike, a string is the full pattern (`'8 4'`). Lengths are user units.
     * @example strokeDasharray={4} → stroke-dasharray: 4
     */
    strokeDasharray: ({
        values: number;
        styleName: string;
        match?: undefined;
    } | {
        values: string;
        match: (value: BoxStyleValue) => boolean;
        styleName: string;
    })[];
    /**
     * The stroke-dashoffset CSS property moves the dash pattern along the path — the property a path-drawing animation transitions. A percentage is of the path's own length.
     * @example strokeDashoffset={4} → stroke-dashoffset: 4
     */
    strokeDashoffset: ({
        values: number;
        styleName: string;
    } | {
        styleName: string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
    })[];
    /**
     * The paint-order CSS property sets what is painted first. `paintOrder="stroke"` puts the stroke behind the fill, which is how outlined SVG text stays legible.
     * @example paintOrder="normal" → paint-order: normal
     */
    paintOrder: {
        values: readonly ["normal", "fill", "stroke", "markers"];
        styleName: string;
    }[];
    /**
     * How an SVG element's stroke reacts to the transforms above it: `non-scaling-stroke` keeps a hairline
     * one pixel wide at any scale. Not inherited, so its rule targets the element *and* its descendants —
     * the only way the prop can mean anything on an `<svg>`.
     * @example vectorEffect="none" → vector-effect: none
     */
    vectorEffect: {
        values: readonly ["none", "non-scaling-stroke"];
        styleName: string;
        selector: (className: string, pseudoClass: string) => string;
    }[];
    /**
     * The shape-rendering CSS property tells the renderer what to trade away when drawing an SVG shape — `crispEdges` turns off anti-aliasing, which is what pixel-exact gridlines want.
     * @example shapeRendering="auto" → shape-rendering: auto
     */
    shapeRendering: {
        values: readonly ["auto", "optimizeSpeed", "crispEdges", "geometricPrecision"];
        styleName: string;
    }[];
    /**
     * Which part of SVG text sits on its `x`: `middle` centres an axis label under a tick. Inherited, so a
     * value on the `<svg>` is the default for every label in it.
     * @example textAnchor="start" → text-anchor: start
     */
    textAnchor: {
        values: readonly ["start", "middle", "end"];
        styleName: string;
    }[];
    /**
     * Which baseline of SVG text sits on its `y`: `central` centres a number inside a gauge. Not inherited,
     * so like `vectorEffect` its rule names the element *and* its descendants.
     * @example dominantBaseline="auto" → dominant-baseline: auto
     */
    dominantBaseline: {
        values: readonly ["auto", "text-bottom", "alphabetic", "ideographic", "middle", "central", "mathematical", "hanging", "text-top"];
        styleName: string;
        selector: (className: string, pseudoClass: string) => string;
    }[];
    /**
     * The centre of a `<circle>` or `<ellipse>`, horizontally, in user units. Real CSS, so unlike the
     * attribute it transitions — moving a point on hover is one prop and no JavaScript.
     * @example cx={4} → cx: 4
     */
    cx: ({
        values: number;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
    })[];
    /**
     * The cy CSS property positions the centre of a `<circle>` or an `<ellipse>` vertically, in user units. Transitions like `cx`.
     * @example cy={4} → cy: 4
     */
    cy: ({
        values: number;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
    })[];
    /**
     * The r CSS property sets the radius of a `<circle>`, in user units. Transition it and the circle grows; a percentage is of the viewport's diagonal.
     * @example r={4} → r: 4
     */
    r: ({
        values: number;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
    })[];
    /**
     * The horizontal radius of an `<ellipse>` or corner radius of a `<rect>` — `borderRadius` for SVG, in
     * user units rather than on the spacing scale. `auto` takes the radius from `ry`.
     * @example rx={4} → rx: 4
     */
    rx: ({
        values: number;
    } | {
        values: readonly ["auto"];
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
    })[];
    /**
     * The ry CSS property sets the vertical radius of an `<ellipse>` or the vertical corner radius of a `<rect>`, in user units. `auto` takes it from `rx`.
     * @example ry={4} → ry: 4
     */
    ry: ({
        values: number;
    } | {
        values: readonly ["auto"];
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
    })[];
    /**
     * Positions a `<rect>`, `<image>`, `<use>`, `<foreignObject>` or nested `<svg>` horizontally, in user
     * units. Not `<text>`, whose `x` takes a list of positions and stays an attribute — pass it in `props`.
     * @example x={4} → x: 4
     */
    x: ({
        values: number;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
    })[];
    /**
     * The y CSS property positions a `<rect>`, `<image>`, `<use>`, `<foreignObject>` or a nested `<svg>` vertically, in user units. Not for `<text>` — see `x`.
     * @example y={4} → y: 4
     */
    y: ({
        values: number;
    } | {
        values: `${number}%`;
        match: typeof Variables.isPercentString;
    })[];
    /**
     * The background-image CSS property sets one or more background images on an element.
     * @example bgImage="gradient-primary" → background-image: var(--gradient-primary)
     */
    bgImage: {
        values: Variables.BgImageType[];
        valueFormat: (value: string, getVariableValue: (name: string) => string) => string;
        styleName: string;
    }[];
    /**
     * A gradient written as a value: the key names the kind and carries its geometry (`linear` a direction
     * or an angle, `radial` a shape, `conic` an angle to start from), `colors` are the stops in order — a
     * palette token, one with an opacity modifier, or a `[colour, position]` pair. `interpolate="oklch"` is
     * what keeps a two-stop gradient out of the grey middle sRGB runs it through. Writes `background-image`,
     * so it and `bgImage` are the same property: use one.
     * @example bgGradient={{ linear: 'r', colors: ['blue-500', 'pink-500'] }} → background-image: linear-gradient(to right,var(--blue-500),var(--pink-500))
     */
    bgGradient: {
        values: Gradients.Gradient;
        match: typeof Gradients.isGradient;
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
    }[];
    /**
     * The elevation of the box: `xxs` through `xxl` on Tailwind's scale, or one of the three original
     * presets (`small`, `medium`, `large`, which carry their own colour). `shadowColor` recolours the
     * scale, and the shadow stacks with `ring`, `insetRing` and `insetShadow` rather than replacing them.
     * @example shadow="xxs" → --boxShadow: 0 1px var(--boxShadowColor, rgb(0 0 0 / .05)); box-shadow: var(--boxInsetShadow, 0 0 #0…
     */
    shadow: ({
        values: Shadows.BoxSize[];
        declarations: (value: BoxStyleValue) => string;
    } | {
        values: Variables.ShadowType[];
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
    })[];
    /**
     * What colour `shadow` draws in — the scale's own translucent black otherwise. Shows nothing on its own.
     * @example shadowColor="sky-500" → --boxShadowColor: var(--sky-500)
     */
    shadowColor: ({
        values: Variables.ColorType[];
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
        match?: undefined;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        declarations: (value: BoxStyleValue) => string;
        match?: undefined;
    } | {
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
    })[];
    /**
     * A shadow drawn inside the border box: `xxs`, `xs` or `sm`. Its own layer, so it composes with `shadow`.
     * @example insetShadow="xxs" → --boxInsetShadow: inset 0 1px var(--boxInsetShadowColor, rgb(0 0 0 / .05)); box-shadow: var(--boxIns…
     */
    insetShadow: {
        values: Shadows.InsetSize[];
        declarations: (value: BoxStyleValue) => string;
    }[];
    /**
     * What colour `insetShadow` draws in. Shows nothing on its own.
     * @example insetShadowColor="sky-500" → --boxInsetShadowColor: var(--sky-500)
     */
    insetShadowColor: ({
        values: Variables.ColorType[];
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
        match?: undefined;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        declarations: (value: BoxStyleValue) => string;
        match?: undefined;
    } | {
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
    })[];
    /**
     * A hard-edged shadow outside the border box, in px — `ring={2}`. Unlike `outline` it takes part in the
     * shadow stack, so a ring and an elevation coexist; it follows `borderRadius` and costs no layout.
     * @example ring={4} → --boxRing: 0 0 0 4px var(--boxRingColor, currentColor); box-shadow: var(--boxInsetShadow, 0 0 #0000)…
     */
    ring: {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    }[];
    /**
     * What colour `ring` draws in. `currentColor` otherwise, the way Tailwind's is.
     * @example ringColor="sky-500" → --boxRingColor: var(--sky-500)
     */
    ringColor: ({
        values: Variables.ColorType[];
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
        match?: undefined;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        declarations: (value: BoxStyleValue) => string;
        match?: undefined;
    } | {
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
    })[];
    /**
     * The same ring, drawn inside the border box: an inner hairline that needs no second element.
     * @example insetRing={4} → --boxInsetRing: inset 0 0 0 4px var(--boxInsetRingColor, currentColor); box-shadow: var(--boxInsetSh…
     */
    insetRing: {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    }[];
    /**
     * What colour `insetRing` draws in. `currentColor` otherwise.
     * @example insetRingColor="sky-500" → --boxInsetRingColor: var(--sky-500)
     */
    insetRingColor: ({
        values: Variables.ColorType[];
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
        match?: undefined;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        declarations: (value: BoxStyleValue) => string;
        match?: undefined;
    } | {
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
    })[];
    /**
     * A shadow behind the text rather than the box: `xxs` through `lg`, recoloured by `textShadowColor`.
     * @example textShadow="xxs" → text-shadow: 0px 1px 0px var(--boxTextShadowColor, rgb(0 0 0 / .15))
     */
    textShadow: {
        values: Shadows.TextSize[];
        styleName: string;
        valueFormat: (value: string) => string;
    }[];
    /**
     * What colour `textShadow` draws in. Shows nothing on its own.
     * @example textShadowColor="sky-500" → --boxTextShadowColor: var(--sky-500)
     */
    textShadowColor: ({
        values: Variables.ColorType[];
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
        match?: undefined;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        declarations: (value: BoxStyleValue) => string;
        match?: undefined;
    } | {
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
    })[];
    /**
     * How far the element's own pixels are blurred: a step of Tailwind's scale (`xs` 4px through `xxxl` 64px)
     * or a radius in px. One of nine functions that compose into a single `filter`, so a blur and a
     * `brightness` coexist; `none` clears this one and leaves the rest.
     * @example blur={3} → --boxBlur: blur(3px); filter: var(--boxBlur,) var(--boxBrightness,) var(--boxContrast,) var(--boxGra…
     */
    blur: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    } | {
        values: ("xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl")[];
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How bright the element is rendered, as a percentage: `brightness={110}` is 10% brighter, `{50}` is half.
     * @example brightness={110} → --boxBrightness: brightness(110%); filter: var(--boxBlur,) var(--boxBrightness,) var(--boxContrast,)…
     */
    brightness: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How much contrast the element is rendered with, as a percentage — `100` being the element as it is.
     * @example contrast={125} → --boxContrast: contrast(125%); filter: var(--boxBlur,) var(--boxBrightness,) var(--boxContrast,) var…
     */
    contrast: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How far the element is desaturated, as a percentage: `grayscale={100}` removes colour entirely.
     * @example grayscale={100} → --boxGrayscale: grayscale(100%); filter: var(--boxBlur,) var(--boxBrightness,) var(--boxContrast,) v…
     */
    grayscale: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How far every hue in the element is rotated round the colour circle, in degrees.
     * @example hueRotate={90} → --boxHueRotate: hue-rotate(90deg); filter: var(--boxBlur,) var(--boxBrightness,) var(--boxContrast,)…
     */
    hueRotate: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How far the element's colours are inverted, as a percentage: `invert={100}` is a photographic negative.
     * @example invert={100} → --boxInvert: invert(100%); filter: var(--boxBlur,) var(--boxBrightness,) var(--boxContrast,) var(--b…
     */
    invert: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How saturated the element is rendered, as a percentage — over `100` to push the colour, under to drain it.
     * @example saturate={180} → --boxSaturate: saturate(180%); filter: var(--boxBlur,) var(--boxBrightness,) var(--boxContrast,) var…
     */
    saturate: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How far the element is pushed towards sepia, as a percentage.
     * @example sepia={100} → --boxSepia: sepia(100%); filter: var(--boxBlur,) var(--boxBrightness,) var(--boxContrast,) var(--box…
     */
    sepia: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * A shadow cast by the element's *shape* rather than its box — the one that follows a transparent PNG's
     * outline or an SVG's path, where `shadow` would draw a rectangle. `xs` through `xxl`, recoloured by
     * `dropShadowColor`. It is a filter function, so it composes with `blur` and the rest rather than with
     * the shadow stack.
     * @example dropShadow="xs" → --boxDropShadow: drop-shadow(0 1px 1px var(--boxDropShadowColor, rgb(0 0 0 / .05))); filter: var(--b…
     */
    dropShadow: {
        values: Shadows.DropSize[];
        declarations: (value: BoxStyleValue) => string;
    }[];
    /**
     * What colour `dropShadow` draws in. Shows nothing on its own.
     * @example dropShadowColor="sky-500" → --boxDropShadowColor: var(--sky-500)
     */
    dropShadowColor: ({
        values: Variables.ColorType[];
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
        match?: undefined;
    } | {
        values: readonly ("Highlight" | "HighlightText" | "Canvas" | "CanvasText" | "ButtonFace" | "ButtonText" | "GrayText" | "LinkText")[];
        declarations: (value: BoxStyleValue) => string;
        match?: undefined;
    } | {
        values: `currentColor/${number}` | `transparent/${number}` | `green/${number}` | `red/${number}` | `blue/${number}` | `gray/${number}` | `green-300/${number}` | `green-100/${number}` | `green-50/${number}` | `green-200/${number}` | `green-400/${number}` | `green-500/${number}` | `green-600/${number}` | `green-700/${number}` | `green-800/${number}` | `green-900/${number}` | `green-950/${number}` | `red-300/${number}` | `red-100/${number}` | `red-50/${number}` | `red-200/${number}` | `red-400/${number}` | `red-500/${number}` | `red-600/${number}` | `red-700/${number}` | `red-800/${number}` | `red-900/${number}` | `red-950/${number}` | `blue-300/${number}` | `blue-100/${number}` | `blue-50/${number}` | `blue-200/${number}` | `blue-400/${number}` | `blue-500/${number}` | `blue-600/${number}` | `blue-700/${number}` | `blue-800/${number}` | `blue-900/${number}` | `blue-950/${number}` | `gray-300/${number}` | `gray-100/${number}` | `gray-50/${number}` | `gray-200/${number}` | `gray-400/${number}` | `gray-500/${number}` | `gray-600/${number}` | `gray-700/${number}` | `gray-800/${number}` | `gray-900/${number}` | `gray-950/${number}` | `slate-300/${number}` | `slate-100/${number}` | `slate-50/${number}` | `slate-200/${number}` | `slate-400/${number}` | `slate-500/${number}` | `slate-600/${number}` | `slate-700/${number}` | `slate-800/${number}` | `slate-900/${number}` | `slate-950/${number}` | `zinc-300/${number}` | `zinc-100/${number}` | `zinc-50/${number}` | `zinc-200/${number}` | `zinc-400/${number}` | `zinc-500/${number}` | `zinc-600/${number}` | `zinc-700/${number}` | `zinc-800/${number}` | `zinc-900/${number}` | `zinc-950/${number}` | `neutral-300/${number}` | `neutral-100/${number}` | `neutral-50/${number}` | `neutral-200/${number}` | `neutral-400/${number}` | `neutral-500/${number}` | `neutral-600/${number}` | `neutral-700/${number}` | `neutral-800/${number}` | `neutral-900/${number}` | `neutral-950/${number}` | `stone-300/${number}` | `stone-100/${number}` | `stone-50/${number}` | `stone-200/${number}` | `stone-400/${number}` | `stone-500/${number}` | `stone-600/${number}` | `stone-700/${number}` | `stone-800/${number}` | `stone-900/${number}` | `stone-950/${number}` | `mauve-300/${number}` | `mauve-100/${number}` | `mauve-50/${number}` | `mauve-200/${number}` | `mauve-400/${number}` | `mauve-500/${number}` | `mauve-600/${number}` | `mauve-700/${number}` | `mauve-800/${number}` | `mauve-900/${number}` | `mauve-950/${number}` | `mist-300/${number}` | `mist-100/${number}` | `mist-50/${number}` | `mist-200/${number}` | `mist-400/${number}` | `mist-500/${number}` | `mist-600/${number}` | `mist-700/${number}` | `mist-800/${number}` | `mist-900/${number}` | `mist-950/${number}` | `olive-300/${number}` | `olive-100/${number}` | `olive-50/${number}` | `olive-200/${number}` | `olive-400/${number}` | `olive-500/${number}` | `olive-600/${number}` | `olive-700/${number}` | `olive-800/${number}` | `olive-900/${number}` | `olive-950/${number}` | `taupe-300/${number}` | `taupe-100/${number}` | `taupe-50/${number}` | `taupe-200/${number}` | `taupe-400/${number}` | `taupe-500/${number}` | `taupe-600/${number}` | `taupe-700/${number}` | `taupe-800/${number}` | `taupe-900/${number}` | `taupe-950/${number}` | `orange-300/${number}` | `orange-100/${number}` | `orange-50/${number}` | `orange-200/${number}` | `orange-400/${number}` | `orange-500/${number}` | `orange-600/${number}` | `orange-700/${number}` | `orange-800/${number}` | `orange-900/${number}` | `orange-950/${number}` | `amber-300/${number}` | `amber-100/${number}` | `amber-50/${number}` | `amber-200/${number}` | `amber-400/${number}` | `amber-500/${number}` | `amber-600/${number}` | `amber-700/${number}` | `amber-800/${number}` | `amber-900/${number}` | `amber-950/${number}` | `yellow-300/${number}` | `yellow-100/${number}` | `yellow-50/${number}` | `yellow-200/${number}` | `yellow-400/${number}` | `yellow-500/${number}` | `yellow-600/${number}` | `yellow-700/${number}` | `yellow-800/${number}` | `yellow-900/${number}` | `yellow-950/${number}` | `lime-300/${number}` | `lime-100/${number}` | `lime-50/${number}` | `lime-200/${number}` | `lime-400/${number}` | `lime-500/${number}` | `lime-600/${number}` | `lime-700/${number}` | `lime-800/${number}` | `lime-900/${number}` | `lime-950/${number}` | `emerald-300/${number}` | `emerald-100/${number}` | `emerald-50/${number}` | `emerald-200/${number}` | `emerald-400/${number}` | `emerald-500/${number}` | `emerald-600/${number}` | `emerald-700/${number}` | `emerald-800/${number}` | `emerald-900/${number}` | `emerald-950/${number}` | `teal-300/${number}` | `teal-100/${number}` | `teal-50/${number}` | `teal-200/${number}` | `teal-400/${number}` | `teal-500/${number}` | `teal-600/${number}` | `teal-700/${number}` | `teal-800/${number}` | `teal-900/${number}` | `teal-950/${number}` | `cyan-300/${number}` | `cyan-100/${number}` | `cyan-50/${number}` | `cyan-200/${number}` | `cyan-400/${number}` | `cyan-500/${number}` | `cyan-600/${number}` | `cyan-700/${number}` | `cyan-800/${number}` | `cyan-900/${number}` | `cyan-950/${number}` | `sky-300/${number}` | `sky-100/${number}` | `sky-50/${number}` | `sky-200/${number}` | `sky-400/${number}` | `sky-500/${number}` | `sky-600/${number}` | `sky-700/${number}` | `sky-800/${number}` | `sky-900/${number}` | `sky-950/${number}` | `indigo-300/${number}` | `indigo-100/${number}` | `indigo-50/${number}` | `indigo-200/${number}` | `indigo-400/${number}` | `indigo-500/${number}` | `indigo-600/${number}` | `indigo-700/${number}` | `indigo-800/${number}` | `indigo-900/${number}` | `indigo-950/${number}` | `violet-300/${number}` | `violet-100/${number}` | `violet-50/${number}` | `violet-200/${number}` | `violet-400/${number}` | `violet-500/${number}` | `violet-600/${number}` | `violet-700/${number}` | `violet-800/${number}` | `violet-900/${number}` | `violet-950/${number}` | `purple-300/${number}` | `purple-100/${number}` | `purple-50/${number}` | `purple-200/${number}` | `purple-400/${number}` | `purple-500/${number}` | `purple-600/${number}` | `purple-700/${number}` | `purple-800/${number}` | `purple-900/${number}` | `purple-950/${number}` | `fuchsia-300/${number}` | `fuchsia-100/${number}` | `fuchsia-50/${number}` | `fuchsia-200/${number}` | `fuchsia-400/${number}` | `fuchsia-500/${number}` | `fuchsia-600/${number}` | `fuchsia-700/${number}` | `fuchsia-800/${number}` | `fuchsia-900/${number}` | `fuchsia-950/${number}` | `pink-300/${number}` | `pink-100/${number}` | `pink-50/${number}` | `pink-200/${number}` | `pink-400/${number}` | `pink-500/${number}` | `pink-600/${number}` | `pink-700/${number}` | `pink-800/${number}` | `pink-900/${number}` | `pink-950/${number}` | `rose-300/${number}` | `rose-100/${number}` | `rose-50/${number}` | `rose-200/${number}` | `rose-400/${number}` | `rose-500/${number}` | `rose-600/${number}` | `rose-700/${number}` | `rose-800/${number}` | `rose-900/${number}` | `rose-950/${number}` | `black/${number}` | `white/${number}` | `vi/${number}`;
        match: typeof Palette.isAlpha;
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
    })[];
    /**
     * How far what is *behind* the element is blurred — the glassmorphism half. Needs something translucent in front of it.
     * @example backdropBlur="sm" → --boxBackdropBlur: blur(8px); backdrop-filter: var(--boxBackdropBlur,) var(--boxBackdropBrightness,)…
     */
    backdropBlur: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    } | {
        values: ("xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl")[];
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How bright what is behind the element is rendered, as a percentage.
     * @example backdropBrightness={110} → --boxBackdropBrightness: brightness(110%); backdrop-filter: var(--boxBackdropBlur,) var(--boxBackdro…
     */
    backdropBrightness: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How much contrast what is behind the element is rendered with, as a percentage.
     * @example backdropContrast={125} → --boxBackdropContrast: contrast(125%); backdrop-filter: var(--boxBackdropBlur,) var(--boxBackdropBri…
     */
    backdropContrast: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How far what is behind the element is desaturated, as a percentage.
     * @example backdropGrayscale={100} → --boxBackdropGrayscale: grayscale(100%); backdrop-filter: var(--boxBackdropBlur,) var(--boxBackdropB…
     */
    backdropGrayscale: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How far every hue behind the element is rotated round the colour circle, in degrees.
     * @example backdropHueRotate={90} → --boxBackdropHueRotate: hue-rotate(90deg); backdrop-filter: var(--boxBackdropBlur,) var(--boxBackdro…
     */
    backdropHueRotate: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How far the colours behind the element are inverted, as a percentage.
     * @example backdropInvert={100} → --boxBackdropInvert: invert(100%); backdrop-filter: var(--boxBackdropBlur,) var(--boxBackdropBrightn…
     */
    backdropInvert: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How opaque what is behind the element is rendered, as a percentage. `filter` has no use for this one, so there is no `opacity` twin.
     * @example backdropOpacity={80} → --boxBackdropOpacity: opacity(80%); backdrop-filter: var(--boxBackdropBlur,) var(--boxBackdropBright…
     */
    backdropOpacity: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How saturated what is behind the element is rendered, as a percentage.
     * @example backdropSaturate={180} → --boxBackdropSaturate: saturate(180%); backdrop-filter: var(--boxBackdropBlur,) var(--boxBackdropBri…
     */
    backdropSaturate: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * How far what is behind the element is pushed towards sepia, as a percentage.
     * @example backdropSepia={100} → --boxBackdropSepia: sepia(100%); backdrop-filter: var(--boxBackdropBlur,) var(--boxBackdropBrightnes…
     */
    backdropSepia: ({
        values: readonly ["none"];
        declarations: () => string;
    } | {
        values: number;
        declarations: (value: BoxStyleValue) => string;
    })[];
    /**
     * What the element is masked by: the alpha channel of an image decides which of its pixels are painted.
     * Takes the same gradient record `bgGradient` does — so a fade to `transparent` is the whole edge-fade
     * recipe — or a `url(#id)`/`var(--name)` somebody else defined. One mask, not a stack.
     * @example maskImage={{ linear: 'b', colors: ['black', 'transparent'] }} → mask-image: linear-gradient(to bottom,var(--black),var(--transparent))
     */
    maskImage: ({
        values: readonly ["none"];
        styleName: string;
        match?: undefined;
        declarations?: undefined;
    } | {
        styleName: string;
        values: Variables.Reference;
        match: typeof Variables.isReference;
        declarations?: undefined;
    } | {
        values: Gradients.Gradient;
        match: typeof Gradients.isGradient;
        declarations: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
        styleName?: undefined;
    })[];
    /**
     * Which box the background is painted inside — and `text`, which clips it to the glyphs themselves. That
     * is how a gradient becomes lettering, and it needs `color="transparent"` beside it or the text paints
     * over its own background.
     * @example bgClip="text" → background-clip: text
     */
    bgClip: {
        values: readonly ["border", "padding", "content", "text"];
        styleName: string;
        valueFormat: (value: string) => string;
    }[];
    /**
     * Moves an element horizontally on the 2D plane, on the ÷4 spacing scale, as a fraction of its own width (`'1/2'`) or as a percentage. Composes with `translateY`.
     * @example translateX={4} → --boxTranslateX: 1rem; translate: var(--boxTranslateX, 0) var(--boxTranslateY, 0)
     */
    translateX: ({
        values: number;
        declarations: (value: BoxStyleValue) => string;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        declarations: (value: BoxStyleValue) => string;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        declarations: (value: BoxStyleValue) => string;
    } | {
        declarations: (value: BoxStyleValue) => string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
    })[];
    /**
     * Moves an element vertically on the 2D plane, on the ÷4 spacing scale, as a fraction of its own height (`'1/2'`) or as a percentage. Composes with `translateX`.
     * @example translateY={4} → --boxTranslateY: 1rem; translate: var(--boxTranslateX, 0) var(--boxTranslateY, 0)
     */
    translateY: ({
        values: number;
        declarations: (value: BoxStyleValue) => string;
    } | {
        values: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
        declarations: (value: BoxStyleValue) => string;
    } | {
        values: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
        declarations: (value: BoxStyleValue) => string;
    } | {
        declarations: (value: BoxStyleValue) => string;
        values: `${number}%`;
        match: typeof Variables.isPercentString;
    })[];
    /**
     * What a `::before`/`::after` renders — and whether it renders at all: a generated element with no
     * `content` produces no box. `content="empty"` is `''` (the value a decoration wants), a quoted string
     * or a function (`attr()`, `counter()`, `url()`) is written out as CSS, and **anything else is text and
     * gets quoted for you** — `content="New"` is `content: "New"`.
     * @example content="New" → content: "New"
     */
    content: ({
        values: readonly ["empty", "none", "normal", "open-quote", "close-quote", "no-open-quote", "no-close-quote"];
        valueFormat: typeof Content.keyword;
        match?: undefined;
    } | {
        values: Content.CssValue;
        match: typeof Content.isCssValue;
        valueFormat?: undefined;
    } | {
        values: string & {};
        valueFormat: typeof Content.quote;
        match?: undefined;
    })[];
    /**
     * The whole `backdrop-filter` at once, written as CSS. Superseded by the nine `backdrop*` props, which
     * compose — this one writes the same property, so it and they are the same declaration: use one.
     * @example backdropFilter="none" → backdrop-filter: none
     */
    backdropFilter: {
        values: readonly ["none", "blur(12px)", "blur(8px)", "blur(4px)"];
        styleName: string;
    }[];
    /**
     * How wide a scrollbar the browser draws. `none` hides it without taking the scrolling away, so a wheel
     * and the keys still reach the content — unlike `overflow: hidden`, which stops both.
     * @example scrollbarWidth="auto" → scrollbar-width: auto
     */
    scrollbarWidth: {
        values: readonly ["auto", "thin", "none"];
        styleName: string;
    }[];
    /**
     * The scrollbar-color CSS property sets the color of the scrollbar thumb and track. The value pair is [thumbColor, trackColor].
     * @example scrollbarColor={['gray-400', 'gray-100']} → scrollbar-color: var(--gray-400) var(--gray-100)
     */
    scrollbarColor: {
        tuple: true;
        values: readonly [Variables.ColorType[], Variables.ColorType[]];
        styleName: string;
        valueFormat: (value: readonly (string | number | boolean)[], getVariableValue: (name: string) => string) => string;
    }[];
    /**
     * The scrollbar-gutter CSS property reserves the space a scrollbar would take before there is one, so a
     * panel does not shift sideways the moment its content overflows. `stable` reserves the end edge,
     * `stable both-edges` both — which is what keeps centred content centred.
     * @example scrollbarGutter="auto" → scrollbar-gutter: auto
     */
    scrollbarGutter: {
        styleName: string;
        values: readonly ["auto", "stable", "stable both-edges"];
    }[];
    /**
     * CSS custom properties on this element, inherited by everything inside it: `vars={{ 'color-x': 'sky-500' }}`
     * emits `--color-x: var(--sky-500)`. The one prop whose declaration *names* come from its value, which is
     * what makes it the answer for markup this library does not render — a Recharts `<Line>`, a third-party
     * widget. A colour token becomes the variable behind it, anything else is written out as it stands.
     * @example vars={{ 'color-revenue': 'sky-500' }} → --color-revenue: var(--sky-500)
     */
    vars: {
        values: Variables.CustomProperties;
        match: typeof Variables.isCustomProperties;
        declarations: NonNullable<BoxStyle["declarations"]>;
    }[];
    /**
     * The escape hatch: a style object for the properties this library has no prop for, compiled into a class
     * through the same pipeline as every other prop — shared, nestable, server-rendered — rather than an inline
     * style. Declared last on purpose: its rule sorts after every typed prop's, so on one element it wins the
     * property both name. A colour token resolves the way a `vars` value does; a number is written as it stands.
     * @example css={{ mixBlendMode: 'multiply' }} → mix-blend-mode: multiply
     */
    css: {
        values: Css.Declarations;
        match: typeof Css.isDeclarations;
        declarations: NonNullable<BoxStyle["declarations"]>;
    }[];
};
export declare const pseudo1: {
    hover: string;
    focus: string;
    focusVisible: string;
    hasFocus: string;
    active: string;
    valid: string;
    hasValid: string;
    invalid: string;
    hasInvalid: string;
    optional: string;
    hasChecked: string;
    hasRequired: string;
    hasDisabled: string;
    /** A link the browser has been to. **Colour properties only** — the privacy rule, and the browser lies about the rest. */
    visited: string;
    /** The element the URL fragment points at, so a deep link can highlight what it landed on. */
    target: string;
    /**
     * Open, whichever way the element says so: a `<details>`/`<dialog>` with the attribute, a popover, or
     * the native `:open` a `<select>` gets. One `:is()` because it is one state, and a forgiving list — a
     * browser without `:open` keeps the other two rather than dropping the rule.
     */
    open: string;
    /** An empty field still showing its placeholder — the label-inside-the-input trick, with no JavaScript. */
    placeholderShown: string;
    /** A field the browser filled in itself. */
    autofill: string;
    /** A numeric or date field inside its `min`/`max`. */
    inRange: string;
    /** Outside it — the pair `inRange` is worth nothing without. */
    outOfRange: string;
    /** Made inert, the subtree included: `[inert]` does not inherit, but inertness does. */
    inert: string;
    /**
     * The element's own resolved direction, which is what `dir` on any ancestor (usually `<html>`) settles.
     * `:dir()` rather than Tailwind's `[dir="rtl"] &`, because direction is a property of *this* element and
     * an ancestor selector cannot see a `<bdi>` or a `dir="auto"` that flipped it. Note the consequence:
     * with no `dir` anywhere the document is left-to-right, so `ltr` matches — it is the state, not an attribute.
     */
    rtl: string;
    /** The other half of the pair: what a left-to-right reader sees, and the default with no `dir` set. */
    ltr: string;
};
export declare const pseudo2: {
    indeterminate: string;
    checked: string;
    required: string;
    disabled: string;
    selected: string;
};
export declare const pseudoClasses: {
    indeterminate: string;
    checked: string;
    required: string;
    disabled: string;
    selected: string;
    hover: string;
    focus: string;
    focusVisible: string;
    hasFocus: string;
    active: string;
    valid: string;
    hasValid: string;
    invalid: string;
    hasInvalid: string;
    optional: string;
    hasChecked: string;
    hasRequired: string;
    hasDisabled: string;
    /** A link the browser has been to. **Colour properties only** — the privacy rule, and the browser lies about the rest. */
    visited: string;
    /** The element the URL fragment points at, so a deep link can highlight what it landed on. */
    target: string;
    /**
     * Open, whichever way the element says so: a `<details>`/`<dialog>` with the attribute, a popover, or
     * the native `:open` a `<select>` gets. One `:is()` because it is one state, and a forgiving list — a
     * browser without `:open` keeps the other two rather than dropping the rule.
     */
    open: string;
    /** An empty field still showing its placeholder — the label-inside-the-input trick, with no JavaScript. */
    placeholderShown: string;
    /** A field the browser filled in itself. */
    autofill: string;
    /** A numeric or date field inside its `min`/`max`. */
    inRange: string;
    /** Outside it — the pair `inRange` is worth nothing without. */
    outOfRange: string;
    /** Made inert, the subtree included: `[inert]` does not inherit, but inertness does. */
    inert: string;
    /**
     * The element's own resolved direction, which is what `dir` on any ancestor (usually `<html>`) settles.
     * `:dir()` rather than Tailwind's `[dir="rtl"] &`, because direction is a property of *this* element and
     * an ancestor selector cannot see a `<bdi>` or a `dir="auto"` that flipped it. Note the consequence:
     * with no `dir` anywhere the document is left-to-right, so `ltr` matches — it is the state, not an attribute.
     */
    rtl: string;
    /** The other half of the pair: what a left-to-right reader sees, and the default with no `dir` set. */
    ltr: string;
};
/**
 * The pseudo-*elements*, and their own dimension rather than more pseudo-class keys: a compound selector
 * holds **at most one**, and it has to come last. Mixed into the pseudo-class list they were assembled in
 * declaration order, so `checked: { before: {…} }` came out as the invalid `::before:checked` and the
 * browser dropped the whole rule; a slot of their own puts the element last by construction, and lets the
 * types refuse a second one instead of emitting `::before::after`, which matches nothing.
 */
export declare const pseudoElements: {
    before: string;
    after: string;
    placeholder: string;
    selection: string;
    marker: string;
    firstLine: string;
    firstLetter: string;
    backdrop: string;
    fileButton: string;
    /** @deprecated The name is `placeholder` now — this spelling still works and means the same thing. */
    placeholderStyles: string;
};
export type PseudoElementKey = keyof typeof pseudoElements;
export declare function generatesContent(key: PseudoElementKey): boolean;
export declare function reachesDescendants(key: PseudoElementKey): boolean;
/** A set of pseudo-class keys as one compound selector suffix. The pseudo-element is appended after it. */
export declare function pseudoSelector(keys: readonly (keyof typeof pseudoClasses)[]): string;
export declare const pseudoClassesWeight: Record<"ltr" | "rtl" | "open" | "active" | "disabled" | "indeterminate" | "checked" | "required" | "selected" | "hover" | "focus" | "focusVisible" | "hasFocus" | "valid" | "hasValid" | "invalid" | "hasInvalid" | "optional" | "hasChecked" | "hasRequired" | "hasDisabled" | "visited" | "target" | "placeholderShown" | "autofill" | "inRange" | "outOfRange" | "inert", number>;
/**
 * The pseudo keys one weight stands for, decoded from the bitmask and kept — a page asks for the same
 * few combinations over and over. This used to be a table of *every* subset: 2²² arrays, 1.5 GB of heap
 * and 1.4 s, built at import time, whether a page styled anything or not.
 */
export declare function pseudoClassesOfWeight(weight: number): (keyof typeof pseudoClasses)[];
/**
 * The five original group keys, one state each. They are `group` with the state written into the prop
 * name, and the engine rewrites them into it — `hoverGroup={{ card: … }}` is `group={{ 'card/hover': … }}`
 * and shares its class. Kept because they are in every consumer's markup; `group` is where new states are.
 */
export declare const pseudoGroupClasses: {
    /** @deprecated `group={{ 'card/hover': … }}` — the same rule, and every other state beside it. */
    hoverGroup: "hover";
    /** @deprecated `group={{ 'card/focus': … }}`. */
    focusGroup: "focus";
    /** @deprecated `group={{ 'card/active': … }}`. */
    activeGroup: "active";
    /** @deprecated `group={{ 'card/disabled': … }}`. */
    disabledGroup: "disabled";
    /** @deprecated `group={{ 'card/selected': … }}`. */
    selectedGroup: "selected";
};
/**
 * The theme nesting key. A theme is an *ancestor class* rather than a state of this element, which is why
 * it is no longer a pseudo-class key with an empty selector: `Groups.theme()` compiles it beside a group
 * and a peer, and the mask keeps the bit.
 */
export declare const themeGroupClass: {
    /** Styles for one theme: `theme={{ dark: { bgColor: 'gray-900' } }}` → `.dark .className`. */
    theme: string;
};
/**
 * The one nesting key that is neither a selector nor a media query: `@starting-style` holds the values a
 * property had *before* the element's first style change, which is the whole difference between an element
 * appearing already finished and one transitioning in. Wraps the rule rather than joining the selector, so
 * it composes with every other kind of nesting.
 */
export declare const startingStyleKey: {
    /** What these props start from the first time this element is styled — an entrance, with no JavaScript. */
    startingStyle: string;
};
export declare const breakpoints: {
    /** Styles applied for small screens and larger. >= 640 */
    sm: number;
    /** Styles applied for medium screens and larger. >= 768 */
    md: number;
    /** Styles applied for large screens and larger. >= 1024 */
    lg: number;
    /** Styles applied for extra-large screens and larger. >= 1280 */
    xl: number;
    /** Styles applied for 2x extra-large screens and larger. >= 1536 */
    xxl: number;
};
/**
 * What the device can do and what the reader asked for, shaped exactly like a breakpoint and ranked
 * *after* every breakpoint: a screen wide enough for `xxl` is not a reason to override either. The
 * pointer pair comes first, so a preference outranks a device capability where both apply.
 * `motionReduce` has a default behind it — the base rule transitions on `var(--transitionTime)`, which
 * `prefers-reduced-motion` zeroes, so declaring it is how you opt back *in*.
 */
export declare const mediaFeatures: {
    /**
     * Styles applied on a touch or pen device — a bigger hit target, a control that is never hovered.
     * `@media (pointer: coarse)`. Ranked *below* the three preferences: what the pointer can do is a fact
     * about the device, and a statement about the reader still outranks it.
     */
    pointerCoarse: string;
    /** Styles applied where the primary pointer is a mouse or a trackpad. `@media (pointer: fine)` */
    pointerFine: string;
    /** Styles applied when the user asked for less motion. `@media (prefers-reduced-motion: reduce)` */
    motionReduce: string;
    /** Styles applied in a forced-colors mode, e.g. Windows High Contrast. `@media (forced-colors: active)` */
    forcedColors: string;
    /** Styles applied when the user asked for more contrast. `@media (prefers-contrast: more)` */
    contrastMore: string;
};
/**
 * Where a rule's at-rule block sits: what its prelude says, and where it lands in the cascade. One slot
 * per rule — a breakpoint, a preference and a container query all fill it, and the types refuse to nest
 * one inside another, because a rule lives in exactly one block.
 */
export interface StyleQuery {
    /** The key as written: the class-name segment, and part of the rule key. */
    key: string;
    /** Cascade position — the dimension `@starting-style` is pushed past in its entirety. */
    rank: number;
    /** The at-rule prelude, or null for a rule that needs no block. */
    prelude: string | null;
}
/** A rule with no at-rule block around it, which is where every walk starts. */
export declare const NO_QUERY: StyleQuery;
/**
 * Every cascade slot an at-rule block can take, in order: no query, the breakpoints ascending, the
 * container queries, then the preference features — a screen wide enough for `xxl` is not a reason to
 * override a statement about the reader, and neither is a container. The engine ranks rules by this and
 * names their cascade layer from it.
 */
export declare const queryKeys: readonly string[];
/** The `@media` block one breakpoint or preference key stands for. */
export declare function mediaQuery(key: string): StyleQuery;
/** The `@container` block one `cq` key stands for, or null when its grammar rejects it. */
export declare function containerQuery(key: string): StyleQuery | null;
