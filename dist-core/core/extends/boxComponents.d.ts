import { BoxComponentStyles } from '../../types';
export interface BoxComponent {
    extends?: string;
    clean?: boolean;
    styles?: BoxComponentStyles;
    variants?: Record<string, BoxComponentStyles>;
    children?: Record<string, BoxComponent>;
}
export type Components = Record<string, BoxComponent>;
declare const boxComponents: {
    h1: {
        styles: {
            fontSize: number;
        };
    };
    h2: {
        styles: {
            fontSize: number;
        };
    };
    h3: {
        styles: {
            fontSize: number;
        };
    };
    h4: {
        styles: {
            fontSize: number;
        };
    };
    h5: {
        styles: {
            fontSize: number;
        };
    };
    h6: {
        styles: {
            fontSize: number;
        };
    };
    span: {
        styles: {
            display: "inline-block";
        };
    };
    tooltip: {
        styles: {
            display: "inline-block";
            maxWidth: number;
            py: number;
            px: number;
            borderRadius: number;
            fontSize: number;
            lineHeight: number;
            bgColor: "gray-900";
            color: "gray-50";
            theme: {
                dark: {
                    bgColor: "gray-100";
                    color: "gray-900";
                };
            };
            forcedColors: {
                b: number;
            };
            startingStyle: {
                opacity: 0;
                translateY: number;
            };
        };
        variants: {
            closed: {
                opacity: 0;
                translateY: number;
                pointerEvents: "none";
            };
        };
    };
    button: {
        styles: {
            display: "inline-flex";
            ai: "center";
            jc: "center";
            gap: number;
            bgColor: "indigo-600";
            color: "white";
            fontWeight: 500;
            py: number;
            px: number;
            borderRadius: number;
            b: number;
            cursor: "pointer";
            hover: {
                bgColor: "indigo-700";
            };
            active: {
                bgColor: "indigo-800";
            };
            focus: {
                outline: number;
                outlineOffset: number;
                outlineColor: "indigo-200";
            };
            disabled: {
                bgColor: "gray-200";
                color: "gray-400";
                cursor: "not-allowed";
                hover: {
                    bgColor: "gray-200";
                };
            };
            theme: {
                dark: {
                    bgColor: "indigo-500";
                    hover: {
                        bgColor: "indigo-400";
                    };
                    active: {
                        bgColor: "indigo-600";
                    };
                    focus: {
                        outlineColor: "indigo-800";
                    };
                    disabled: {
                        bgColor: "gray-800";
                        color: "gray-600";
                        hover: {
                            bgColor: "gray-800";
                        };
                    };
                };
            };
        };
        variants: {
            secondary: {
                bgColor: "white";
                color: "gray-900";
                b: number;
                borderColor: "gray-300";
                hover: {
                    bgColor: "gray-50";
                };
                active: {
                    bgColor: "gray-100";
                };
                focus: {
                    borderColor: "indigo-500";
                    outlineColor: "indigo-100";
                };
                disabled: {
                    bgColor: "gray-50";
                    color: "gray-400";
                    borderColor: "gray-200";
                };
                theme: {
                    dark: {
                        bgColor: "gray-800";
                        color: "gray-100";
                        borderColor: "gray-700";
                        hover: {
                            bgColor: "gray-700";
                        };
                        active: {
                            bgColor: "gray-600";
                        };
                        focus: {
                            borderColor: "indigo-400";
                            outlineColor: "indigo-900";
                        };
                        disabled: {
                            bgColor: "gray-900";
                            color: "gray-600";
                            borderColor: "gray-800";
                        };
                    };
                };
            };
            ghost: {
                bgColor: "transparent";
                color: "gray-700";
                hover: {
                    bgColor: "gray-100";
                };
                active: {
                    bgColor: "gray-200";
                };
                disabled: {
                    bgColor: "transparent";
                    color: "gray-400";
                };
                theme: {
                    dark: {
                        bgColor: "transparent";
                        color: "gray-300";
                        hover: {
                            bgColor: "gray-800";
                        };
                        active: {
                            bgColor: "gray-700";
                        };
                        disabled: {
                            bgColor: "transparent";
                            color: "gray-600";
                        };
                    };
                };
            };
        };
    };
    textbox: {
        styles: {
            display: "inline-block";
            b: number;
            borderColor: "gray-300";
            bgColor: "white";
            color: "gray-900";
            borderRadius: number;
            p: number;
            px: number;
            lineHeight: number;
            hover: {
                borderColor: "gray-400";
            };
            focus: {
                outline: number;
                outlineOffset: number;
                borderColor: "indigo-500";
                outlineColor: "indigo-200";
            };
            disabled: {
                cursor: "not-allowed";
                bgColor: "gray-100";
                color: "gray-400";
                borderColor: "gray-200";
            };
            theme: {
                dark: {
                    bgColor: "gray-800";
                    color: "gray-100";
                    borderColor: "gray-700";
                    hover: {
                        borderColor: "gray-600";
                    };
                    focus: {
                        borderColor: "indigo-400";
                        outlineColor: "indigo-900";
                    };
                    disabled: {
                        bgColor: "gray-900";
                        color: "gray-600";
                        borderColor: "gray-800";
                    };
                };
            };
        };
        variants: {
            compact: {
                px: number;
                py: number;
                fontSize: number;
            };
        };
    };
    textarea: {
        styles: {
            display: "inline-block";
            b: number;
            borderColor: "gray-300";
            bgColor: "white";
            color: "gray-900";
            borderRadius: number;
            p: number;
            px: number;
            hover: {
                borderColor: "gray-400";
            };
            focus: {
                outline: number;
                outlineOffset: number;
                borderColor: "indigo-500";
                outlineColor: "indigo-200";
            };
            disabled: {
                cursor: "not-allowed";
                bgColor: "gray-100";
                color: "gray-400";
                borderColor: "gray-200";
                resize: "none";
            };
            theme: {
                dark: {
                    bgColor: "gray-800";
                    color: "gray-100";
                    borderColor: "gray-700";
                    hover: {
                        borderColor: "gray-600";
                    };
                    focus: {
                        borderColor: "indigo-400";
                        outlineColor: "indigo-900";
                    };
                    disabled: {
                        bgColor: "gray-900";
                        color: "gray-600";
                        borderColor: "gray-800";
                    };
                };
            };
        };
    };
    checkbox: {
        styles: {
            display: "inline-block";
            appearance: "none";
            b: number;
            borderColor: "gray-300";
            borderRadius: number;
            p: number;
            cursor: "pointer";
            hover: {
                borderColor: "indigo-400";
            };
            focus: {
                outline: number;
                outlineOffset: number;
                outlineColor: "indigo-200";
            };
            checked: {
                bgColor: "indigo-500";
                borderColor: "indigo-500";
                bgImage: "bg-img-checked";
            };
            indeterminate: {
                borderColor: "indigo-500";
                bgImage: "bg-img-indeterminate";
            };
            disabled: {
                cursor: "not-allowed";
                borderColor: "gray-200";
                checked: {
                    bgColor: "gray-300";
                };
                hover: {
                    borderColor: "gray-200";
                };
            };
            theme: {
                dark: {
                    borderColor: "gray-600";
                    hover: {
                        borderColor: "indigo-400";
                    };
                    focus: {
                        outlineColor: "indigo-900";
                    };
                    checked: {
                        bgColor: "indigo-500";
                        borderColor: "indigo-500";
                    };
                    indeterminate: {
                        borderColor: "indigo-500";
                    };
                    disabled: {
                        borderColor: "gray-700";
                        checked: {
                            bgColor: "gray-600";
                        };
                        hover: {
                            borderColor: "gray-700";
                        };
                    };
                };
            };
        };
        variants: {
            datagrid: {};
        };
    };
    radioButton: {
        styles: {
            appearance: "none";
            b: number;
            borderColor: "gray-300";
            borderRadius: number;
            p: number;
            cursor: "pointer";
            hover: {
                borderColor: "indigo-400";
            };
            focus: {
                outline: number;
                outlineOffset: number;
                outlineColor: "indigo-200";
            };
            checked: {
                bgColor: "indigo-500";
                borderColor: "indigo-500";
                bgImage: "bg-img-radio";
            };
            disabled: {
                checked: {
                    bgColor: "gray-300";
                    borderColor: "gray-200";
                };
                cursor: "not-allowed";
                borderColor: "gray-200";
                hover: {
                    borderColor: "gray-200";
                };
            };
            theme: {
                dark: {
                    borderColor: "gray-600";
                    hover: {
                        borderColor: "indigo-400";
                    };
                    focus: {
                        outlineColor: "indigo-900";
                    };
                    checked: {
                        bgColor: "indigo-500";
                        borderColor: "indigo-500";
                    };
                    disabled: {
                        borderColor: "gray-700";
                        checked: {
                            bgColor: "gray-600";
                        };
                        hover: {
                            borderColor: "gray-700";
                        };
                    };
                };
            };
        };
    };
    switch: {
        styles: {
            appearance: "none";
            position: "relative";
            display: "inline-block";
            width: number;
            height: number;
            minWidth: number;
            borderRadius: number;
            bgColor: "gray-300";
            cursor: "pointer";
            transition: "all";
            transitionDuration: number;
            before: {
                position: "absolute";
                top: number;
                insetStart: number;
                width: number;
                height: number;
                borderRadius: number;
                bgColor: "white";
                transition: "all";
                transitionDuration: number;
            };
            hover: {
                bgColor: "gray-400";
            };
            focus: {
                outline: number;
                outlineOffset: number;
                outlineColor: "indigo-200";
            };
            checked: {
                bgColor: "indigo-500";
                hover: {
                    bgColor: "indigo-600";
                };
                before: {
                    translateX: number;
                    rtl: {
                        translateX: number;
                    };
                };
            };
            motionReduce: {
                transition: "none";
                before: {
                    transition: "none";
                };
            };
            disabled: {
                cursor: "not-allowed";
                bgColor: "gray-200";
                hover: {
                    bgColor: "gray-200";
                };
                checked: {
                    bgColor: "gray-300";
                    hover: {
                        bgColor: "gray-300";
                    };
                };
            };
            forcedColors: {
                bgColor: "ButtonFace";
                b: number;
                borderColor: "ButtonText";
                before: {
                    bgColor: "ButtonText";
                };
                hover: {
                    bgColor: "ButtonFace";
                };
                checked: {
                    bgColor: "ButtonText";
                    hover: {
                        bgColor: "ButtonText";
                    };
                    before: {
                        bgColor: "ButtonFace";
                    };
                };
                disabled: {
                    bgColor: "ButtonFace";
                    borderColor: "GrayText";
                    before: {
                        bgColor: "GrayText";
                    };
                    hover: {
                        bgColor: "ButtonFace";
                    };
                    checked: {
                        bgColor: "GrayText";
                        hover: {
                            bgColor: "GrayText";
                        };
                        before: {
                            bgColor: "ButtonFace";
                        };
                    };
                };
            };
            theme: {
                dark: {
                    bgColor: "gray-600";
                    hover: {
                        bgColor: "gray-500";
                    };
                    focus: {
                        outlineColor: "indigo-900";
                    };
                    checked: {
                        bgColor: "indigo-500";
                        hover: {
                            bgColor: "indigo-400";
                        };
                    };
                    disabled: {
                        bgColor: "gray-700";
                        hover: {
                            bgColor: "gray-700";
                        };
                        checked: {
                            bgColor: "gray-600";
                            hover: {
                                bgColor: "gray-600";
                            };
                        };
                    };
                };
            };
        };
    };
    dropdown: {
        styles: {
            display: "inline-block";
            overflow: "hidden";
            whiteSpace: "nowrap";
            textOverflow: "ellipsis";
            textAlign: "start";
            gap: number;
            p: number;
            cursor: "pointer";
            bgColor: "white";
            color: "gray-900";
            b: number;
            borderColor: "gray-300";
            borderRadius: number;
            userSelect: "none";
            lineHeight: number;
            width: "fit-content";
            transition: "none";
            hover: {
                borderColor: "gray-400";
            };
            focus: {
                outline: number;
                outlineOffset: number;
                borderColor: "indigo-500";
                outlineColor: "indigo-200";
            };
            disabled: {
                cursor: "not-allowed";
                bgColor: "gray-100";
                color: "gray-400";
                borderColor: "gray-300";
            };
            theme: {
                dark: {
                    bgColor: "gray-800";
                    color: "gray-100";
                    borderColor: "gray-700";
                    hover: {
                        borderColor: "gray-600";
                    };
                    focus: {
                        borderColor: "indigo-400";
                        outlineColor: "indigo-900";
                    };
                    disabled: {
                        bgColor: "gray-900";
                        color: "gray-500";
                        borderColor: "gray-700";
                    };
                };
            };
        };
        variants: {
            compact: {
                px: number;
                py: number;
                fontSize: number;
                height: number;
            };
        };
        children: {
            items: {
                styles: {
                    display: "flex";
                    d: "column";
                    gap: number;
                    p: number;
                    b: number;
                    borderRadius: number;
                    position: "relative";
                    bgColor: "white";
                    overflow: "auto";
                    maxHeight: number;
                    borderColor: "gray-300";
                    color: "gray-900";
                    shadow: "medium";
                    theme: {
                        dark: {
                            bgColor: "gray-800";
                            borderColor: "gray-700";
                            color: "gray-100";
                        };
                    };
                    startingStyle: {
                        opacity: 0;
                        translateY: number;
                    };
                };
                variants: {
                    up: {
                        startingStyle: {
                            translateY: number;
                        };
                    };
                    closed: {
                        opacity: 0;
                        translateY: number;
                        pointerEvents: "none";
                    };
                    closedUp: {
                        opacity: 0;
                        translateY: number;
                        pointerEvents: "none";
                    };
                };
            };
            item: {
                styles: {
                    textWrap: "nowrap";
                    display: "flex";
                    width: "fit";
                    p: number;
                    cursor: "pointer";
                    borderRadius: number;
                    lineHeight: number;
                    hover: {
                        bgColor: "gray-100";
                    };
                    focus: {
                        bgColor: "indigo-50";
                    };
                    selected: {
                        bgColor: "indigo-50";
                        cursor: "default";
                        hover: {
                            bgColor: "indigo-100";
                        };
                    };
                    theme: {
                        dark: {
                            hover: {
                                bgColor: "gray-700";
                            };
                            focus: {
                                bgColor: "gray-700";
                            };
                            selected: {
                                bgColor: "indigo-900";
                                hover: {
                                    bgColor: "indigo-800";
                                };
                            };
                        };
                    };
                };
                variants: {
                    highlighted: {
                        outline: number;
                        outlineStyle: "solid";
                        outlineOffset: number;
                        outlineColor: "indigo-500";
                        theme: {
                            dark: {
                                outlineColor: "indigo-400";
                            };
                        };
                    };
                    compact: {
                        px: number;
                        py: number;
                    };
                    multiple: {
                        selected: {
                            cursor: "pointer";
                        };
                    };
                };
            };
            unselect: {
                styles: {
                    display: "flex";
                    width: "fit";
                    p: number;
                    cursor: "pointer";
                    lineHeight: number;
                    borderRadius: number;
                    color: "gray-500";
                    hover: {
                        bgColor: "gray-100";
                    };
                    focus: {
                        bgColor: "gray-100";
                    };
                    selected: {
                        bgColor: "gray-100";
                        cursor: "default";
                    };
                    theme: {
                        dark: {
                            color: "gray-400";
                            hover: {
                                bgColor: "gray-700";
                            };
                            focus: {
                                bgColor: "gray-700";
                            };
                            selected: {
                                bgColor: "gray-700";
                            };
                        };
                    };
                };
                variants: {
                    highlighted: {
                        outline: number;
                        outlineStyle: "solid";
                        outlineOffset: number;
                        outlineColor: "indigo-500";
                        theme: {
                            dark: {
                                outlineColor: "indigo-400";
                            };
                        };
                    };
                    compact: {
                        px: number;
                        py: number;
                    };
                };
            };
            selectAll: {
                styles: {
                    display: "flex";
                    width: "fit";
                    p: number;
                    cursor: "pointer";
                    lineHeight: number;
                    borderRadius: number;
                    color: "gray-500";
                    hover: {
                        bgColor: "gray-100";
                    };
                    focus: {
                        bgColor: "gray-100";
                    };
                    selected: {
                        bgColor: "gray-100";
                        cursor: "default";
                    };
                    theme: {
                        dark: {
                            color: "gray-400";
                            hover: {
                                bgColor: "gray-700";
                            };
                            focus: {
                                bgColor: "gray-700";
                            };
                            selected: {
                                bgColor: "gray-700";
                            };
                        };
                    };
                };
                variants: {
                    highlighted: {
                        outline: number;
                        outlineStyle: "solid";
                        outlineOffset: number;
                        outlineColor: "indigo-500";
                        theme: {
                            dark: {
                                outlineColor: "indigo-400";
                            };
                        };
                    };
                    compact: {
                        px: number;
                        py: number;
                    };
                };
            };
            emptyItem: {
                styles: {
                    display: "flex";
                    width: "fit";
                    p: number;
                    cursor: "default";
                    lineHeight: number;
                    borderRadius: number;
                    color: "gray-400";
                    theme: {
                        dark: {
                            color: "gray-500";
                        };
                    };
                };
                variants: {
                    compact: {
                        px: number;
                        py: number;
                    };
                };
            };
            icon: {
                styles: {
                    position: "absolute";
                    top: number;
                    insetEnd: number;
                    height: "fit";
                    px: number;
                };
            };
        };
    };
    label: {
        styles: {};
    };
    datagrid: {
        styles: {
            b: number;
            bgColor: "white";
            borderColor: "gray-200";
            overflow: "hidden";
            borderRadius: number;
            shadow: "large";
            theme: {
                dark: {
                    bgColor: "gray-900";
                    borderColor: "gray-800";
                };
            };
        };
        children: {
            content: {
                styles: {};
            };
            loader: {
                styles: {
                    position: "sticky";
                    insetStart: number;
                    width: "fit";
                    height: number;
                    zIndex: 2;
                };
                children: {
                    track: {
                        styles: {
                            position: "absolute";
                            top: number;
                            insetX: number;
                            overflow: "hidden";
                            bgColor: "indigo-100";
                            theme: {
                                dark: {
                                    bgColor: "indigo-950";
                                };
                            };
                        };
                        children: {
                            bar: {
                                styles: {
                                    position: "absolute";
                                    top: number;
                                    bottom: number;
                                    insetStart: number;
                                    bgColor: "indigo-500";
                                    animationName: string;
                                    animationDuration: number;
                                    animationTimingFunction: "linear";
                                    animationIterationCount: "infinite";
                                    motionReduce: {
                                        animationName: string;
                                    };
                                    theme: {
                                        dark: {
                                            bgColor: "indigo-400";
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            topBar: {
                styles: {
                    py: number;
                    px: number;
                    bb: number;
                    borderColor: "gray-200";
                    color: "gray-800";
                    gap: number;
                    ai: "center";
                    bgColor: "gray-50";
                    theme: {
                        dark: {
                            bgColor: "gray-800";
                            borderColor: "gray-700";
                            color: "gray-200";
                        };
                    };
                };
                children: {
                    globalFilter: {
                        styles: {
                            display: "flex";
                            ai: "center";
                            gap: number;
                        };
                        children: {
                            stats: {
                                styles: {
                                    fontSize: number;
                                    fontWeight: 500;
                                    px: number;
                                    py: number;
                                    borderRadius: number;
                                    bgColor: "violet-100";
                                    color: "violet-700";
                                    theme: {
                                        dark: {
                                            bgColor: "violet-900";
                                            color: "violet-300";
                                        };
                                    };
                                    textWrap: "nowrap";
                                };
                            };
                        };
                    };
                    columnGroups: {
                        styles: {
                            gap: number;
                            ai: "center";
                        };
                        children: {
                            icon: {
                                styles: {
                                    color: "gray-700";
                                    width: number;
                                    theme: {
                                        dark: {
                                            color: "gray-300";
                                        };
                                    };
                                };
                            };
                            separator: {
                                styles: {};
                            };
                            item: {
                                styles: {
                                    gap: number;
                                    ai: "center";
                                    b: number;
                                    borderColor: "gray-300";
                                    bgColor: "white";
                                    borderRadius: number;
                                    py: number;
                                    ps: number;
                                    pe: number;
                                    color: "gray-800";
                                    fontSize: number;
                                    fontWeight: 500;
                                    shadow: "small";
                                    theme: {
                                        dark: {
                                            bgColor: "gray-800";
                                            borderColor: "gray-700";
                                            color: "gray-200";
                                        };
                                    };
                                };
                                children: {
                                    icon: {
                                        styles: {
                                            width: number;
                                            color: "gray-500";
                                            cursor: "pointer";
                                            hover: {
                                                color: "gray-700";
                                            };
                                            theme: {
                                                dark: {
                                                    color: "gray-400";
                                                    hover: {
                                                        color: "gray-200";
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    columnVisibility: {
                        styles: {};
                        children: {
                            badge: {
                                styles: {};
                            };
                        };
                    };
                };
            };
            filter: {
                styles: {};
                children: {
                    row: {
                        styles: {
                            bgColor: "gray-50";
                            bb: number;
                            borderColor: "gray-200";
                            theme: {
                                dark: {
                                    bgColor: "gray-800";
                                    borderColor: "gray-700";
                                };
                            };
                        };
                    };
                    cell: {
                        styles: {
                            display: "flex";
                            ai: "center";
                            p: number;
                            transition: "none";
                            focusVisible: {
                                outline: number;
                                outlineStyle: "solid";
                                outlineOffset: number;
                                outlineColor: "indigo-500";
                            };
                            theme: {
                                dark: {
                                    focusVisible: {
                                        outlineColor: "indigo-400";
                                    };
                                };
                            };
                        };
                        variants: {
                            isPinned: {
                                position: "sticky";
                                bgColor: "gray-50";
                                zIndex: 2;
                                theme: {
                                    dark: {
                                        bgColor: "gray-800";
                                    };
                                };
                            };
                            isFirstStartPinned: {};
                            isLastStartPinned: {
                                be: number;
                                borderColor: "gray-200";
                                theme: {
                                    dark: {
                                        borderColor: "gray-700";
                                    };
                                };
                            };
                            isFirstEndPinned: {
                                bs: number;
                                borderColor: "gray-200";
                                theme: {
                                    dark: {
                                        borderColor: "gray-700";
                                    };
                                };
                            };
                            isLastEndPinned: {};
                        };
                        children: {
                            input: {
                                styles: {
                                    display: "flex";
                                    ai: "center";
                                    b: number;
                                    borderColor: "gray-200";
                                    borderRadius: number;
                                    position: "relative";
                                    width: "fit";
                                    focus: {
                                        borderColor: "indigo-500";
                                        outline: number;
                                        outlineOffset: number;
                                        outlineColor: "indigo-200";
                                    };
                                    theme: {
                                        dark: {
                                            borderColor: "gray-700";
                                            focus: {
                                                borderColor: "indigo-400";
                                                outlineColor: "indigo-900";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            header: {
                styles: {
                    position: "sticky";
                    top: number;
                    width: "max-content";
                    minWidth: "fit";
                    zIndex: 1;
                    bgColor: "gray-50";
                    theme: {
                        dark: {
                            bgColor: "gray-800";
                        };
                    };
                };
                children: {
                    cell: {
                        styles: {
                            borderColor: "gray-200";
                            bb: number;
                            minHeight: number;
                            position: "relative";
                            transition: "none";
                            fontSize: number;
                            fontWeight: 600;
                            color: "gray-800";
                            py: number;
                            focusVisible: {
                                outline: number;
                                outlineStyle: "solid";
                                outlineOffset: number;
                                outlineColor: "indigo-500";
                            };
                            theme: {
                                dark: {
                                    borderColor: "gray-700";
                                    color: "gray-200";
                                    focusVisible: {
                                        outlineColor: "indigo-400";
                                    };
                                };
                            };
                        };
                        variants: {
                            isPinned: {
                                position: "sticky";
                                zIndex: 2;
                                bgColor: "gray-50";
                                theme: {
                                    dark: {
                                        bgColor: "gray-800";
                                    };
                                };
                            };
                            isFirstStartPinned: {};
                            isLastStartPinned: {
                                be: number;
                                borderColor: "gray-200";
                                theme: {
                                    dark: {
                                        borderColor: "gray-700";
                                    };
                                };
                            };
                            isFirstEndPinned: {
                                bs: number;
                                borderColor: "gray-200";
                                theme: {
                                    dark: {
                                        borderColor: "gray-700";
                                    };
                                };
                            };
                            isLastEndPinned: {};
                            isSortable: {
                                cursor: "pointer";
                                hover: {
                                    bgColor: "gray-100";
                                };
                                theme: {
                                    dark: {
                                        hover: {
                                            bgColor: "gray-800";
                                        };
                                    };
                                };
                            };
                            isRowSelected: {};
                            isRowSelection: {};
                            isRowNumber: {
                                jc: "center";
                            };
                            isFirstLeaf: {};
                            isLastLeaf: {};
                            isEmptyCell: {};
                        };
                        children: {
                            contextMenu: {
                                clean: true;
                                styles: {
                                    width: number;
                                    height: number;
                                    cursor: "pointer";
                                    userSelect: "none";
                                    borderRadius: number;
                                    borderColor: "gray-200";
                                    display: "flex";
                                    jc: "center";
                                    ai: "center";
                                    transition: "none";
                                    color: "gray-600";
                                    hover: {
                                        bgColor: "gray-300";
                                    };
                                    theme: {
                                        dark: {
                                            color: "gray-400";
                                            hover: {
                                                bgColor: "gray-700";
                                            };
                                        };
                                    };
                                };
                                children: {
                                    icon: {
                                        styles: {};
                                    };
                                    tooltip: {
                                        styles: {
                                            bgColor: "white";
                                            color: "gray-900";
                                            width: number;
                                            b: number;
                                            borderColor: "gray-300";
                                            borderRadius: number;
                                            display: "flex";
                                            d: "column";
                                            py: number;
                                            overflow: "hidden";
                                            shadow: "medium";
                                            theme: {
                                                dark: {
                                                    bgColor: "gray-800";
                                                    borderColor: "gray-700";
                                                    color: "gray-100";
                                                };
                                            };
                                            startingStyle: {
                                                opacity: 0;
                                                translateY: number;
                                            };
                                        };
                                        variants: {
                                            closed: {
                                                opacity: 0;
                                                translateY: number;
                                                pointerEvents: "none";
                                            };
                                        };
                                        children: {
                                            item: {
                                                clean: true;
                                                styles: {
                                                    display: "flex";
                                                    gap: number;
                                                    p: number;
                                                    cursor: "pointer";
                                                    color: "gray-900";
                                                    hover: {
                                                        bgColor: "violet-50";
                                                    };
                                                    theme: {
                                                        dark: {
                                                            color: "gray-100";
                                                            hover: {
                                                                bgColor: "gray-700";
                                                            };
                                                        };
                                                    };
                                                };
                                                children: {
                                                    icon: {
                                                        styles: {
                                                            width: number;
                                                            color: "violet-950";
                                                            theme: {
                                                                dark: {
                                                                    color: "violet-300";
                                                                };
                                                            };
                                                        };
                                                    };
                                                    separator: {
                                                        styles: {
                                                            bb: number;
                                                            my: number;
                                                            borderColor: "gray-300";
                                                            theme: {
                                                                dark: {
                                                                    borderColor: "gray-700";
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            resizer: {
                                styles: {
                                    width: number;
                                    height: "fit";
                                    bgColor: "gray-400";
                                    group: {
                                        'resizer/hover': {
                                            bgColor: "gray-600";
                                        };
                                    };
                                    focusVisible: {
                                        opacity: 1;
                                        outline: number;
                                        outlineStyle: "solid";
                                        outlineColor: "indigo-500";
                                        bgColor: "indigo-500";
                                    };
                                    theme: {
                                        dark: {
                                            focusVisible: {
                                                outlineColor: "indigo-400";
                                                bgColor: "indigo-400";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            body: {
                styles: {};
                children: {
                    cell: {
                        styles: {
                            bb: number;
                            borderColor: "gray-200";
                            transition: "none";
                            ai: "center";
                            group: {
                                'grid-row/hover': {
                                    bgColor: "gray-100";
                                };
                            };
                            focusVisible: {
                                outline: number;
                                outlineStyle: "solid";
                                outlineOffset: number;
                                outlineColor: "indigo-500";
                            };
                            theme: {
                                dark: {
                                    borderColor: "gray-800";
                                    group: {
                                        'grid-row/hover': {
                                            bgColor: "gray-700";
                                        };
                                    };
                                    focusVisible: {
                                        outlineColor: "indigo-400";
                                    };
                                };
                            };
                        };
                        variants: {
                            isPinned: {
                                position: "sticky";
                                bgColor: "white";
                                zIndex: 1;
                                theme: {
                                    dark: {
                                        bgColor: "gray-900";
                                    };
                                };
                            };
                            isFirstStartPinned: {};
                            isLastStartPinned: {
                                be: number;
                                borderColor: "gray-200";
                                theme: {
                                    dark: {
                                        borderColor: "gray-800";
                                    };
                                };
                            };
                            isFirstEndPinned: {
                                bs: number;
                                borderColor: "gray-200";
                                theme: {
                                    dark: {
                                        borderColor: "gray-800";
                                    };
                                };
                            };
                            isLastEndPinned: {};
                            isRowNumber: {
                                jc: "end";
                            };
                            isRowSelection: {};
                            isRowSelected: {};
                            isFirstLeaf: {};
                            isLastLeaf: {};
                            isEmptyCell: {};
                            isRowDetail: {};
                            isExpanded: {};
                            isExpandedFirstLeaf: {};
                            isExpandedLastLeaf: {};
                        };
                        children: {
                            text: {
                                styles: {};
                            };
                            rowDetail: {
                                clean: true;
                                styles: {};
                                variants: {
                                    isExpanded: {};
                                };
                            };
                        };
                    };
                    detailRow: {
                        styles: {
                            bb: number;
                            borderColor: "gray-200";
                            theme: {
                                dark: {
                                    borderColor: "gray-800";
                                };
                            };
                        };
                        children: {
                            content: {
                                styles: {
                                    focusVisible: {
                                        outline: number;
                                        outlineStyle: "solid";
                                        outlineOffset: number;
                                        outlineColor: "indigo-500";
                                    };
                                    theme: {
                                        dark: {
                                            focusVisible: {
                                                outlineColor: "indigo-400";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    row: {
                        styles: {};
                    };
                    groupRow: {
                        styles: {};
                        children: {
                            expandButton: {
                                clean: true;
                                styles: {};
                            };
                        };
                    };
                    empty: {
                        styles: {};
                    };
                };
            };
            emptyColumns: {
                styles: {};
            };
            bottomBar: {
                styles: {
                    py: number;
                    px: number;
                    lineHeight: number;
                    bgColor: "gray-50";
                    bt: number;
                    borderColor: "gray-200";
                    gap: number;
                    ai: "center";
                    fontSize: number;
                    color: "gray-800";
                    theme: {
                        dark: {
                            bgColor: "gray-800";
                            borderColor: "gray-700";
                            color: "gray-200";
                        };
                    };
                };
                children: {
                    info: {
                        styles: {};
                    };
                    clearFilters: {
                        styles: {};
                    };
                    pagination: {
                        styles: {};
                        children: {
                            button: {
                                clean: true;
                                styles: {};
                            };
                            info: {
                                styles: {};
                            };
                            pageSize: {
                                styles: {};
                            };
                        };
                    };
                };
            };
        };
    };
};
export default boxComponents;
