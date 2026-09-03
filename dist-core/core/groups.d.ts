import { default as Variants } from './variants';
/**
 * What goes *in front of* the element's own selector: an ancestor in a state (`group`), a preceding
 * sibling in one (`peer`), or the theme class. One shape for all three, because the only thing that
 * differs is the combinator — a descendant space, a `~`, or a compound when a theme lands on the root.
 *
 * The state vocabulary is `Variants`' (a pseudo-class name, or a `data-`/`aria-` attribute), so
 * `group={{ 'card/hover': … }}` and `not={{ hover: … }}` mean the same thing by `hover`. A key the
 * grammar rejects produces no rule and no class name, the way a variant key does.
 */
declare namespace Groups {
    /** The two keys, each mapped to the combinator it puts between the ancestor and this element. */
    const groupKeys: {
        /**
         * Styles for when an ancestor is in a state: `group={{ hover: … }}` → `.group:hover .className`,
         * `group={{ 'card/hover': … }}` → `.card:hover .className`. The ancestor carries the class itself.
         */
        group: string;
        /**
         * The same for a *preceding sibling*: `peer={{ checked: … }}` → `.peer:checked~.className`. What
         * styles a label from the input before it, with no JavaScript and no wrapper.
         */
        peer: string;
    };
    type GroupKey = keyof typeof groupKeys;
    /** One key: a state on the default class, or that state on a named ancestor — `hover`, `card/hover`. */
    type ParentKey = Variants.StateKey | `${string}/${Variants.StateKey}`;
    /** One compiled ancestor: what it adds to the class name, and what it puts in front of the selector. */
    interface Parent {
        /** Which kind it is. A theme is the only one that can compound onto a root selector (`html.dark`). */
        kind: GroupKey | 'theme';
        /** The class-name segment — built from the compiled parts, so `hoverGroup` and `group` share a class. */
        name: string;
        /** The ancestor's own selector, its state included. */
        selector: string;
        /** What joins it to what follows: a descendant space, or a sibling `~`. */
        combinator: string;
    }
    /** Whether a name may address a group — exported so the engine's legacy keys are held to it too. */
    function isGroupName(name: string): boolean;
    /**
     * One `group`/`peer` key compiled, or null when the grammar accepts neither its state nor its name.
     * The *last* slash separates the two, the way a `cq` key's does: a class name cannot hold one.
     */
    function parent(kind: GroupKey, key: string): Parent | null;
    /** The theme class, which is an ancestor with no state of its own: `.dark .className`. */
    function theme(name: string): Parent | null;
}
export default Groups;
