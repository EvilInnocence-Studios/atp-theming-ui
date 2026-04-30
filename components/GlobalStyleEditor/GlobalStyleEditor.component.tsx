import { MediaPicker } from "@common/components/MediaPicker";
import { services } from "@core/lib/api";
import { DeleteBtn } from "@core/components/DeleteBtn";
import { Editable } from "@core/components/Editable";
import { Label } from "@core/components/Label";
import { overridable } from "@core/lib/overridable";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Editor from "@monaco-editor/react";
import { Button, Col, ColorPicker, Modal, Row, Select, Space, Tabs, Typography } from "antd";
import { useEffect, useRef, useState, useMemo } from "react";
import { debounce } from "lodash";
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { IStyleVar } from "../Style/Style.d";
import { GlobalStyleEditorProps } from "./GlobalStyleEditor.d";
import styles from './GlobalStyleEditor.module.scss';

const { Text } = Typography;

const antColorValues: Record<string, string> = {
    colorBgBase: '#fff',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    colorLink: '#1677ff',
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorTextBase: '#000',
    colorWarning: '#faad14',
    blue: '#1677FF',
    purple: '#722ED1',
    cyan: '#13C2C2',
    green: '#52C41A',
    magenta: '#EB2F96',
    pink: '#EB2F96',
    red: '#F5222D',
    orange: '#FA8C16',
    yellow: '#FADB14',
    volcano: '#FA541C',
    geekblue: '#2F54EB',
    lime: '#A0D911',
    gold: '#FAAD14',
};

const antColorTokens = Object.entries(antColorValues).map(([key, value]) => ({
    value: key,
    label: `${key} (${value})`
}));

const antVariableValues: Record<string, string> = {
    borderRadius: '6',
    controlHeight: '32',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    fontFamilyCode: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '14',
    lineType: 'solid',
    lineWidth: '1',
    motion: 'true',
    motionBase: '0',
    motionEaseInBack: 'cubic-bezier(0.71, -0.46, 0.88, 0.6)',
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseInOutCirc: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
    motionEaseInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    motionEaseOutBack: 'cubic-bezier(0.12, 0.4, 0.29, 1.46)',
    motionEaseOutCirc: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
    motionEaseOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
    motionUnit: '0.1',
    opacityImage: '1',
    sizePopupArrow: '16',
    sizeStep: '4',
    sizeUnit: '4',
    wireframe: 'false',
    zIndexBase: '0',
    zIndexPopupBase: '1000',
};

const antVariableTokens = Object.entries(antVariableValues).map(([key, value]) => ({
    value: key,
    label: `${key}${value.length < 20 ? ` (\${value})` : ''}`
}));

const scales = [
    { name: 'Base', prefix: 'base' },
    { name: 'Secondary', prefix: 'secondary' },
    { name: 'Neutral', prefix: 'neutral' },
    { name: 'Success', prefix: 'success' },
    { name: 'Warning', prefix: 'warning' },
    { name: 'Error', prefix: 'error' },
    { name: 'Info', prefix: 'info' }
];

const stops = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

const miscVarsGroups = [
    {
        title: 'Border Radius',
        prefix: 'radius',
        items: [
            { name: 'sm', varName: '--radius-sm', prop: 'borderRadius' },
            { name: 'md', varName: '--radius-md', prop: 'borderRadius' },
            { name: 'lg', varName: '--radius-lg', prop: 'borderRadius' },
            { name: 'full', varName: '--radius-full', prop: 'borderRadius' }
        ]
    },
    {
        title: 'Spacing',
        prefix: 'space',
        items: [
            { name: '1', varName: '--space-1', prop: 'width' },
            { name: '2', varName: '--space-2', prop: 'width' },
            { name: '3', varName: '--space-3', prop: 'width' },
            { name: '4', varName: '--space-4', prop: 'width' },
            { name: '6', varName: '--space-6', prop: 'width' },
            { name: '8', varName: '--space-8', prop: 'width' },
            { name: '12', varName: '--space-12', prop: 'width' },
            { name: '16', varName: '--space-16', prop: 'width' }
        ]
    },
    {
        title: 'Typography Size',
        prefix: 'text',
        items: [
            { name: 'xs', varName: '--text-xs', prop: 'fontSize' },
            { name: 'sm', varName: '--text-sm', prop: 'fontSize' },
            { name: 'base', varName: '--text-base', prop: 'fontSize' },
            { name: 'lg', varName: '--text-lg', prop: 'fontSize' },
            { name: 'xl', varName: '--text-xl', prop: 'fontSize' },
            { name: '2xl', varName: '--text-2xl', prop: 'fontSize' },
            { name: '3xl', varName: '--text-3xl', prop: 'fontSize' },
            { name: '4xl', varName: '--text-4xl', prop: 'fontSize' }
        ]
    },
    {
        title: 'Typography Weight',
        prefix: 'font',
        items: [
            { name: 'normal', varName: '--font-normal', prop: 'fontWeight' },
            { name: 'medium', varName: '--font-medium', prop: 'fontWeight' },
            { name: 'semibold', varName: '--font-semibold', prop: 'fontWeight' },
            { name: 'bold', varName: '--font-bold', prop: 'fontWeight' }
        ]
    },
    {
        title: 'Line Height',
        prefix: 'leading',
        items: [
            { name: 'none', varName: '--leading-none', prop: 'lineHeight' },
            { name: 'tight', varName: '--leading-tight', prop: 'lineHeight' },
            { name: 'normal', varName: '--leading-normal', prop: 'lineHeight' },
            { name: 'loose', varName: '--leading-loose', prop: 'lineHeight' }
        ]
    },
    {
        title: 'Shadow',
        prefix: 'shadow',
        items: [
            { name: 'sm', varName: '--shadow-sm', prop: 'boxShadow' },
            { name: 'md', varName: '--shadow-md', prop: 'boxShadow' },
            { name: 'lg', varName: '--shadow-lg', prop: 'boxShadow' },
            { name: 'xl', varName: '--shadow-xl', prop: 'boxShadow' },
            { name: 'inner', varName: '--shadow-inner', prop: 'boxShadow' }
        ]
    },
    {
        title: 'Transition',
        prefix: 'transition',
        items: [
            { name: 'fast', varName: '--duration-fast', prop: 'transitionDuration' },
            { name: 'normal', varName: '--duration-normal', prop: 'transitionDuration' },
            { name: 'standard ease', varName: '--ease-standard', prop: 'transitionTimingFunction' }
        ]
    }
];

const anyColorToHex = (str: string) => {
    if (str.startsWith('#')) return str.toUpperCase();

    let match = str.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        const a = match[4] ? Math.round(parseFloat(match[4]) * 255).toString(16).padStart(2, '0') : '';
        return `#${r}${g}${b}${a}`.toUpperCase();
    }

    match = str.match(/^color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s+\/\s+([\d.]+))?\s*\)$/);
    if (match) {
        const r = Math.round(parseFloat(match[1]) * 255).toString(16).padStart(2, '0');
        const g = Math.round(parseFloat(match[2]) * 255).toString(16).padStart(2, '0');
        const b = Math.round(parseFloat(match[3]) * 255).toString(16).padStart(2, '0');
        const a = match[4] ? Math.round(parseFloat(match[4]) * 255).toString(16).padStart(2, '0') : '';
        return `#${r}${g}${b}${a}`.toUpperCase();
    }

    return str;
};

export const GlobalStyleEditorComponent = overridable(({classes = styles, theme, updater}:GlobalStyleEditorProps) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [computedColors, setComputedColors] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState("colors");
    const editorRef = useRef<any>(null);
    const [disabledTabs, setDisabledTabs] = useState(true);
    const [boundsTabs, setBoundsTabs] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    const draggleRefTabs = useRef<HTMLDivElement>(null);

    const onStartTabs = (_event: DraggableEvent, uiData: DraggableData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRefTabs.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBoundsTabs({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    const [disabledScss, setDisabledScss] = useState(true);
    const [boundsScss, setBoundsScss] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    const draggleRefScss = useRef<HTMLDivElement>(null);

    const onStartScss = (_event: DraggableEvent, uiData: DraggableData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRefScss.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBoundsScss({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    const handleCopy = (text: string) => {
        if (!text || !editorRef.current) return;
        
        const editor = editorRef.current;
        const selection = editor.getSelection();
        
        editor.executeEdits("copy-button", [{
            range: selection,
            text: text,
            forceMoveMarkers: true
        }]);
        editor.focus();
    };

    const globalStyles = theme?.globalStyles || { variables: [], fonts: [], css: "", sass: "" };
    const vars = globalStyles.variables || [];
    const fonts = globalStyles.fonts || [];
    const sass = globalStyles.sass || "";

    const updateGlobalStyles = (updates: Partial<typeof globalStyles>) => {
        if (updater) {
            updater.updateObject("globalStyles")({ ...globalStyles, ...updates });
        }
    };

    const globalStylesRef = useRef(globalStyles);
    useEffect(() => {
        globalStylesRef.current = globalStyles;
    }, [globalStyles]);

    const debouncedCompile = useMemo(
        () =>
            debounce(async (sassToCompile: string) => {
                if (sassToCompile) {
                    try {
                        const compiledCss = await services().sass.compile(sassToCompile);
                        if (compiledCss !== undefined && compiledCss !== globalStylesRef.current.css) {
                            if (updater) {
                                updater.updateObject("globalStyles")({ ...globalStylesRef.current, css: compiledCss });
                            }
                        }
                    } catch (e) {
                        console.error("Sass compilation failed", e);
                    }
                } else if (globalStylesRef.current.css) {
                    if (updater) {
                        updater.updateObject("globalStyles")({ ...globalStylesRef.current, css: "" });
                    }
                }
            }, 1000),
        [updater]
    );

    useEffect(() => {
        debouncedCompile(sass);
        return () => {
            debouncedCompile.cancel();
        };
    }, [sass, debouncedCompile]);

    const updateVar = (index: number, key: string) => (value: string) => {
        const newVars = [...vars];
        newVars[index] = { ...newVars[index], [key]: value };
        updateGlobalStyles({ variables: newVars });
    };

    const addVar = (type: "color" | "string") => () => {
        updateGlobalStyles({
            variables: [...vars, { name: "", value: "", type }]
        });
    };

    const addSeedToken = (type: "color" | "string", valuesMap: Record<string, string>) => (tokenName: string) => {
        updateGlobalStyles({
            variables: [...vars, { name: tokenName, value: valuesMap[tokenName] || "", type }]
        });
    };

    const removeVar = (index: number) => () => {
        const newVars = [...vars];
        newVars.splice(index, 1);
        updateGlobalStyles({ variables: newVars });
    };

    const updateFont = (index: number, key: string) => (value: string) => {
        const newFonts = [...fonts];
        newFonts[index] = { ...newFonts[index], [key]: value };
        updateGlobalStyles({ fonts: newFonts });
    };

    const addFont = () => {
        updateGlobalStyles({
            fonts: [...fonts, { name: "NewFont", fontId: "", weight: "normal", style: "normal" }]
        });
    };

    const removeFont = (index: number) => () => {
        const newFonts = [...fonts];
        newFonts.splice(index, 1);
        updateGlobalStyles({ fonts: newFonts });
    };

    const addBaseVariables = () => {
        const baseVariables = [
            { name: 'color-base', value: '#3b82f6', type: 'color' },
            { name: 'color-secondary', value: '#10b981', type: 'color' },
            { name: 'color-neutral', value: '#6b7280', type: 'color' },
            { name: 'tint-strength', value: '1', type: 'string' },
            { name: 'shade-strength', value: '1', type: 'string' },
            { name: 'white', value: '#ffffff', type: 'color' },
            { name: 'black', value: '#000000', type: 'color' },
            { name: 'color-success', value: '#22c55e', type: 'color' },
            { name: 'color-warning', value: '#eab308', type: 'color' },
            { name: 'color-error', value: '#ef4444', type: 'color' },
            { name: 'color-info', value: '#0ea5e9', type: 'color' },
            { name: 'radius-base', value: '1', type: 'string' }
        ];

        const existingNames = vars.map(v => v.name);
        const newVarsToAdd = baseVariables.filter(bv => !existingNames.includes(bv.name));

        if (newVarsToAdd.length > 0) {
            updateGlobalStyles({
                variables: [...vars, ...newVarsToAdd as IStyleVar[]]
            });
        }
    };

    // Calculate CSS for preview
    useEffect(() => {
        if (open && containerRef.current && (activeTab === "color_scales" || activeTab === "misc_previews")) {
            const timer = setTimeout(() => {
                if (!containerRef.current) return;
                const newColors: Record<string, string> = {};
                
                if (activeTab === "color_scales") {
                    scales.forEach(scale => {
                        stops.forEach(stop => {
                            const varName = `--${scale.prefix}-${stop}`;
                            const el = containerRef.current?.querySelector(`[data-var="${varName}"]`) as HTMLElement;
                            if (el) {
                                const computedStyle = getComputedStyle(el);
                                newColors[varName] = anyColorToHex(computedStyle.backgroundColor);
                            }
                        });
                    });
                } else if (activeTab === "misc_previews") {
                    miscVarsGroups.forEach(group => {
                        group.items.forEach(item => {
                            const el = containerRef.current?.querySelector(`[data-var="${item.varName}"]`) as HTMLElement;
                            if (el) {
                                const computedStyle = getComputedStyle(el);
                                newColors[item.varName] = computedStyle[item.prop as keyof CSSStyleDeclaration] as string;
                            }
                        });
                    });
                }
                
                setComputedColors(newColors);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [open, activeTab, vars]);

    const cssText = `
        .global-style-editor-preview-container {
            ${vars.map((v: IStyleVar) => `--${v.name}: ${v.value};`).join("\n")}
            
            --base-50:  color-mix(in srgb, var(--color-base), var(--white) calc(90% * var(--tint-strength)));
            --base-100: color-mix(in srgb, var(--color-base), var(--white) calc(80% * var(--tint-strength)));
            --base-200: color-mix(in srgb, var(--color-base), var(--white) calc(65% * var(--tint-strength)));
            --base-300: color-mix(in srgb, var(--color-base), var(--white) calc(50% * var(--tint-strength)));
            --base-400: color-mix(in srgb, var(--color-base), var(--white) calc(30% * var(--tint-strength)));
            --base-500: var(--color-base);
            --base-600: color-mix(in srgb, var(--color-base), var(--black) calc(15% * var(--shade-strength)));
            --base-700: color-mix(in srgb, var(--color-base), var(--black) calc(30% * var(--shade-strength)));
            --base-800: color-mix(in srgb, var(--color-base), var(--black) calc(50% * var(--shade-strength)));
            --base-900: color-mix(in srgb, var(--color-base), var(--black) calc(70% * var(--shade-strength)));

            --secondary-50:  color-mix(in srgb, var(--color-secondary), var(--white) calc(90% * var(--tint-strength)));
            --secondary-100: color-mix(in srgb, var(--color-secondary), var(--white) calc(80% * var(--tint-strength)));
            --secondary-200: color-mix(in srgb, var(--color-secondary), var(--white) calc(65% * var(--tint-strength)));
            --secondary-300: color-mix(in srgb, var(--color-secondary), var(--white) calc(50% * var(--tint-strength)));
            --secondary-400: color-mix(in srgb, var(--color-secondary), var(--white) calc(30% * var(--tint-strength)));
            --secondary-500: var(--color-secondary);
            --secondary-600: color-mix(in srgb, var(--color-secondary), var(--black) calc(15% * var(--shade-strength)));
            --secondary-700: color-mix(in srgb, var(--color-secondary), var(--black) calc(30% * var(--shade-strength)));
            --secondary-800: color-mix(in srgb, var(--color-secondary), var(--black) calc(50% * var(--shade-strength)));
            --secondary-900: color-mix(in srgb, var(--color-secondary), var(--black) calc(70% * var(--shade-strength)));

            --neutral-50:  color-mix(in srgb, var(--color-neutral), var(--white) calc(95% * var(--tint-strength)));
            --neutral-100: color-mix(in srgb, var(--color-neutral), var(--white) calc(90% * var(--tint-strength)));
            --neutral-200: color-mix(in srgb, var(--color-neutral), var(--white) calc(75% * var(--tint-strength)));
            --neutral-300: color-mix(in srgb, var(--color-neutral), var(--white) calc(60% * var(--tint-strength)));
            --neutral-400: color-mix(in srgb, var(--color-neutral), var(--white) calc(40% * var(--tint-strength)));
            --neutral-500: var(--color-neutral);
            --neutral-600: color-mix(in srgb, var(--color-neutral), var(--black) calc(15% * var(--shade-strength)));
            --neutral-700: color-mix(in srgb, var(--color-neutral), var(--black) calc(30% * var(--shade-strength)));
            --neutral-800: color-mix(in srgb, var(--color-neutral), var(--black) calc(50% * var(--shade-strength)));
            --neutral-900: color-mix(in srgb, var(--color-neutral), var(--black) calc(75% * var(--shade-strength)));

            --success-50:  color-mix(in srgb, var(--color-success), var(--white) calc(90% * var(--tint-strength)));
            --success-100: color-mix(in srgb, var(--color-success), var(--white) calc(80% * var(--tint-strength)));
            --success-200: color-mix(in srgb, var(--color-success), var(--white) calc(65% * var(--tint-strength)));
            --success-300: color-mix(in srgb, var(--color-success), var(--white) calc(50% * var(--tint-strength)));
            --success-400: color-mix(in srgb, var(--color-success), var(--white) calc(30% * var(--tint-strength)));
            --success-500: var(--color-success);
            --success-600: color-mix(in srgb, var(--color-success), var(--black) calc(15% * var(--shade-strength)));
            --success-700: color-mix(in srgb, var(--color-success), var(--black) calc(30% * var(--shade-strength)));
            --success-800: color-mix(in srgb, var(--color-success), var(--black) calc(50% * var(--shade-strength)));
            --success-900: color-mix(in srgb, var(--color-success), var(--black) calc(70% * var(--shade-strength)));

            --warning-50:  color-mix(in srgb, var(--color-warning), var(--white) calc(90% * var(--tint-strength)));
            --warning-100: color-mix(in srgb, var(--color-warning), var(--white) calc(80% * var(--tint-strength)));
            --warning-200: color-mix(in srgb, var(--color-warning), var(--white) calc(65% * var(--tint-strength)));
            --warning-300: color-mix(in srgb, var(--color-warning), var(--white) calc(50% * var(--tint-strength)));
            --warning-400: color-mix(in srgb, var(--color-warning), var(--white) calc(30% * var(--tint-strength)));
            --warning-500: var(--color-warning);
            --warning-600: color-mix(in srgb, var(--color-warning), var(--black) calc(15% * var(--shade-strength)));
            --warning-700: color-mix(in srgb, var(--color-warning), var(--black) calc(30% * var(--shade-strength)));
            --warning-800: color-mix(in srgb, var(--color-warning), var(--black) calc(50% * var(--shade-strength)));
            --warning-900: color-mix(in srgb, var(--color-warning), var(--black) calc(70% * var(--shade-strength)));

            --error-50:  color-mix(in srgb, var(--color-error), var(--white) calc(90% * var(--tint-strength)));
            --error-100: color-mix(in srgb, var(--color-error), var(--white) calc(80% * var(--tint-strength)));
            --error-200: color-mix(in srgb, var(--color-error), var(--white) calc(65% * var(--tint-strength)));
            --error-300: color-mix(in srgb, var(--color-error), var(--white) calc(50% * var(--tint-strength)));
            --error-400: color-mix(in srgb, var(--color-error), var(--white) calc(30% * var(--tint-strength)));
            --error-500: var(--color-error);
            --error-600: color-mix(in srgb, var(--color-error), var(--black) calc(15% * var(--shade-strength)));
            --error-700: color-mix(in srgb, var(--color-error), var(--black) calc(30% * var(--shade-strength)));
            --error-800: color-mix(in srgb, var(--color-error), var(--black) calc(50% * var(--shade-strength)));
            --error-900: color-mix(in srgb, var(--color-error), var(--black) calc(70% * var(--shade-strength)));

            --info-50:  color-mix(in srgb, var(--color-info), var(--white) calc(90% * var(--tint-strength)));
            --info-100: color-mix(in srgb, var(--color-info), var(--white) calc(80% * var(--tint-strength)));
            --info-200: color-mix(in srgb, var(--color-info), var(--white) calc(65% * var(--tint-strength)));
            --info-300: color-mix(in srgb, var(--color-info), var(--white) calc(50% * var(--tint-strength)));
            --info-400: color-mix(in srgb, var(--color-info), var(--white) calc(30% * var(--tint-strength)));
            --info-500: var(--color-info);
            --info-600: color-mix(in srgb, var(--color-info), var(--black) calc(15% * var(--shade-strength)));
            --info-700: color-mix(in srgb, var(--color-info), var(--black) calc(30% * var(--shade-strength)));
            --info-800: color-mix(in srgb, var(--color-info), var(--black) calc(50% * var(--shade-strength)));
            --info-900: color-mix(in srgb, var(--color-info), var(--black) calc(70% * var(--shade-strength)));

            /* === BORDER RADIUS SCALE === */
            --radius-sm: calc(4px * var(--radius-base));
            --radius-md: calc(6px * var(--radius-base));
            --radius-lg: calc(12px * var(--radius-base));
            --radius-full: 9999px;

            /* === SPACING SCALE === */
            --space-1: 0.25rem;
            --space-2: 0.5rem;
            --space-3: 0.75rem;
            --space-4: 1rem;
            --space-6: 1.5rem;
            --space-8: 2rem;
            --space-12: 3rem;
            --space-16: 4rem;

            /* === TYPOGRAPHY SCALE === */
            --text-xs: 0.75rem;
            --text-sm: 0.875rem;
            --text-base: 1rem;
            --text-lg: 1.125rem;
            --text-xl: 1.25rem;
            --text-2xl: 1.5rem;
            --text-3xl: 2rem;
            --text-4xl: 2.5rem;

            --font-normal: 400;
            --font-medium: 500;
            --font-semibold: 600;
            --font-bold: 700;

            --leading-none: 1;
            --leading-tight: 1.25;
            --leading-normal: 1.5;
            --leading-loose: 2;

            /* === SHADOW SCALE === */
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);

            /* === TRANSITIONS === */
            --duration-fast: 150ms;
            --duration-normal: 250ms;
            --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;

    return <>
        <Button onClick={() => setOpen(true)}><FontAwesomeIcon icon={faPalette} /> Global Style Editor</Button>
        <Modal
            title={
                <div
                    style={{ width: '100%', cursor: 'move' }}
                    onMouseOver={() => { if (disabledTabs) setDisabledTabs(false); }}
                    onMouseOut={() => { setDisabledTabs(true); }}
                >
                    Global Style Editor - Tokens
                </div>
            }
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            width={400}
            className={classes.globalStyleModal}
            destroyOnClose={false}
            mask={false}
            maskClosable={false}
            wrapClassName={classes.globalStyleModalWrap}
            style={{ margin: 0, top: 40, left: 40, position: 'absolute' }}
            modalRender={(modal) => (
                <Draggable disabled={disabledTabs} bounds={boundsTabs} nodeRef={draggleRefTabs} onStart={(event, uiData) => onStartTabs(event, uiData)}>
                    <div ref={draggleRefTabs}>{modal}</div>
                </Draggable>
            )}
        >
            <style>{cssText}</style>
            <div className={classes.editorLayout} style={{ height: '75vh', display: 'flex', flexDirection: 'column' }}>
                <div ref={containerRef} className="global-style-editor-preview-container" style={{ flex: 1, overflow: 'hidden' }}>
                        <Tabs activeKey={activeTab} onChange={setActiveTab} tabPosition="top">
                            <Tabs.TabPane key="colors" tab="Colors">
                                <Button onClick={addBaseVariables} block style={{ marginBottom: 16 }}>
                                    Add Standard Base Variables
                                </Button>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                    <Button type="primary" onClick={addVar("color")}>
                                        Add Color
                                    </Button>
                                    <Select
                                        showSearch
                                        placeholder="Insert Ant Design Color Token"
                                        value={null}
                                        onChange={addSeedToken("color", antColorValues)}
                                        options={antColorTokens}
                                        style={{ flex: 1, minWidth: 0 }}
                                    />
                                </div>
                                {vars.map((v, i) => v.type === "color" && (
                                    <Space.Compact key={i} style={{ marginBottom: 8, display: 'flex', width: '100%' }}>
                                        <Editable
                                            placeholder="Color Name"
                                            value={v.name}
                                            onChange={updateVar(i, "name")}
                                        />
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0 8px',
                                        }} title="Copy CSS Variable">
                                            <Typography.Text copyable={{text: `var(--${v.name})`, onCopy: () => handleCopy(`var(--${v.name})`)}} />
                                        </div>
                                        <ColorPicker
                                            value={v.value}
                                            onChange={color => updateVar(i, "value")(color.toHexString())}
                                            placement="topRight"
                                        />
                                        <Editable
                                            placeholder="Color Value"
                                            value={v.value}
                                            onChange={updateVar(i, "value")}
                                        />
                                        <DeleteBtn entityType="CSS color" onClick={removeVar(i)} />
                                    </Space.Compact>
                                ))}
                            </Tabs.TabPane>
                            <Tabs.TabPane key="variables" tab="Variables">
                                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                    <Button type="primary" onClick={addVar("string")}>
                                        Add Variable
                                    </Button>
                                    <Select
                                        showSearch
                                        placeholder="Insert Ant Design Seed Token"
                                        value={null}
                                        onChange={addSeedToken("string", antVariableValues)}
                                        options={antVariableTokens}
                                        style={{ flex: 1, minWidth: 0 }}
                                    />
                                </div>
                                {vars.map((v, i) => v.type === "string" && (
                                    <Space.Compact key={i} style={{ marginBottom: 8, display: 'flex', width: '100%' }}>
                                        <Editable
                                            placeholder="Variable Name"
                                            value={v.name}
                                            onChange={updateVar(i, "name")}
                                        />
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0 8px',
                                        }} title="Copy CSS Variable">
                                            <Typography.Text copyable={{text: `var(--${v.name})`, onCopy: () => handleCopy(`var(--${v.name})`)}} />
                                        </div>
                                        <Editable
                                            placeholder="Variable Value"
                                            value={v.value}
                                            onChange={updateVar(i, "value")}
                                        />
                                        <DeleteBtn entityType="CSS variable" onClick={removeVar(i)} />
                                    </Space.Compact>
                                ))}
                            </Tabs.TabPane>
                            <Tabs.TabPane key="fonts" tab="Fonts">
                                <Button type="primary" onClick={addFont} style={{ marginBottom: 16 }}>
                                    Add Font
                                </Button>
                                {fonts.map((f, i) => (
                                    <div key={i} style={{ marginBottom: 16 }}>
                                        <Row wrap={false} gutter={16}>
                                            <Col flex="72px">
                                                <MediaPicker
                                                    imageId={f.fontId}
                                                    onSelect={updateFont(i, "fontId")}
                                                    small={true}
                                                />
                                            </Col>
                                            <Col flex="auto">
                                                <Label label="Font">
                                                    <Space.Compact style={{ display: 'flex', width: '100%' }}>
                                                        <Editable
                                                            placeholder="Font Family"
                                                            value={f.name}
                                                            onChange={updateFont(i, "name")}
                                                        />
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: '0 24px 0 4px',
                                                        }} title="Copy Font Name">
                                                            <Typography.Text copyable={{text: f.name, onCopy: () => handleCopy(f.name)}} />
                                                        </div>
                                                    </Space.Compact>
                                                </Label>
                                                <Label label="Weight">
                                                    <Select
                                                        value={f.weight || "normal"}
                                                        onChange={updateFont(i, "weight")}
                                                        style={{ width: '100%' }}
                                                        options={[
                                                            { value: '100', label: '100 - Thin' },
                                                            { value: '200', label: '200 - Extra Light' },
                                                            { value: '300', label: '300 - Light' },
                                                            { value: 'normal', label: '400 - Normal' },
                                                            { value: '500', label: '500 - Medium' },
                                                            { value: '600', label: '600 - Semi Bold' },
                                                            { value: 'bold', label: '700 - Bold' },
                                                            { value: '800', label: '800 - Extra Bold' },
                                                            { value: '900', label: '900 - Black' },
                                                        ]}
                                                    />
                                                </Label>
                                                <Label label="Style">
                                                    <Select
                                                        value={f.style || "normal"}
                                                        onChange={updateFont(i, "style")}
                                                        style={{ width: '100%' }}
                                                        options={[
                                                            { value: 'normal', label: 'Normal' },
                                                            { value: 'italic', label: 'Italic' },
                                                            { value: 'oblique', label: 'Oblique' }
                                                        ]}
                                                    />
                                                </Label>
                                                <div style={{ textAlign: "right", marginTop: "8px" }}>
                                                    <DeleteBtn label="Delete Font" entityType="font face" onClick={removeFont(i)} />
                                                </div>
                                            </Col>
                                        </Row>
                                        <hr className={classes.hr} />
                                    </div>
                                ))}
                            </Tabs.TabPane>
                            <Tabs.TabPane key="color_scales" tab="Scales">
                                <Space direction="vertical" style={{ width: '100%' }} size="large">
                                    {scales.map(scale => (
                                        <div key={scale.prefix}>
                                            <Typography.Title level={5} style={{ marginTop: 0 }}>{scale.name} Scale</Typography.Title>
                                            <Row gutter={[8, 8]}>
                                                {stops.map(stop => {
                                                    const varName = `--${scale.prefix}-${stop}`;
                                                    return (
                                                        <Col key={stop} span={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <div 
                                                                data-var={varName}
                                                                style={{
                                                                    width: '100%',
                                                                    height: 24,
                                                                    borderRadius: 4,
                                                                    backgroundColor: `var(${varName})`,
                                                                    border: '1px solid rgba(0,0,0,0.1)'
                                                                }}
                                                            />
                                                            <Text type="secondary" style={{ fontSize: 12, marginTop: 4 }} copyable={{text: `var(${varName})`, onCopy: () => handleCopy(`var(${varName})`)}}>
                                                                {stop}
                                                            </Text>
                                                            <Text style={{ fontSize: 10, wordBreak: 'break-all', textAlign: 'center' }}>
                                                                {computedColors[varName] ? computedColors[varName] : '...'}
                                                            </Text>
                                                        </Col>
                                                    );
                                                })}
                                            </Row>
                                        </div>
                                    ))}
                                </Space>
                            </Tabs.TabPane>
                            <Tabs.TabPane key="misc_previews" tab="Misc">
                                <Space direction="vertical" style={{ width: '100%' }} size="large">
                                    {miscVarsGroups.map(group => (
                                        <div key={group.title}>
                                            <Typography.Title level={5} style={{ marginTop: 0 }}>{group.title}</Typography.Title>
                                            <Row gutter={[8, 8]}>
                                                {group.items.map(item => {
                                                    return (
                                                        <Col key={item.name} span={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                                                            <div 
                                                                data-var={item.varName}
                                                                style={{
                                                                    visibility: 'hidden',
                                                                    position: 'absolute',
                                                                    pointerEvents: 'none',
                                                                    [item.prop]: `var(${item.varName})`
                                                                }}
                                                            />
                                                            <div style={{
                                                                width: '100%',
                                                                height: 48,
                                                                borderRadius: 4,
                                                                backgroundColor: '#fafafa',
                                                                border: '1px solid rgba(0,0,0,0.1)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                overflow: 'hidden',
                                                                whiteSpace: 'nowrap'
                                                            }}>
                                                                {group.prefix === 'radius' && <div style={{width: 24, height: 24, backgroundColor: 'var(--base-500)', borderRadius: `var(${item.varName})`}} />}
                                                                {group.prefix === 'space' && <div style={{width: `var(${item.varName})`, height: 12, backgroundColor: 'var(--base-500)'}} />}
                                                                {group.prefix === 'text' && <span style={{fontSize: `var(${item.varName})`, color: '#000'}}>Ag</span>}
                                                                {group.prefix === 'font' && <span style={{fontWeight: `var(${item.varName})`, color: '#000'}}>Ag</span>}
                                                                {group.prefix === 'shadow' && <div style={{width: 24, height: 24, backgroundColor: '#fff', boxShadow: `var(${item.varName})`, borderRadius: 4}} />}
                                                                {group.prefix === 'transition' && <span style={{fontSize: 12, color: '#000'}}>{item.name}</span>}
                                                                {group.prefix === 'leading' && <span style={{lineHeight: `var(${item.varName})`, backgroundColor: '#e6f7ff', padding: '0 4px', fontSize: 14, color: '#000'}}>A<br/>g</span>}
                                                            </div>
                                                            <Text type="secondary" style={{ fontSize: 12, marginTop: 4 }} copyable={{text: `var(${item.varName})`, onCopy: () => handleCopy(`var(${item.varName})`)}}>
                                                                {item.name}
                                                            </Text>
                                                            <Text style={{ fontSize: 10, wordBreak: 'break-all', textAlign: 'center' }}>
                                                                {computedColors[item.varName] || '...'}
                                                            </Text>
                                                        </Col>
                                                    );
                                                })}
                                            </Row>
                                        </div>
                                    ))}
                                </Space>
                            </Tabs.TabPane>
                        </Tabs>
                </div>
            </div>
        </Modal>

        <Modal
            title={
                <div
                    style={{ width: '100%', cursor: 'move' }}
                    onMouseOver={() => { if (disabledScss) setDisabledScss(false); }}
                    onMouseOut={() => { setDisabledScss(true); }}
                >
                    Global Style Editor - SCSS
                </div>
            }
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            width={400}
            className={classes.globalStyleModal}
            destroyOnClose={false}
            mask={false}
            maskClosable={false}
            wrapClassName={classes.globalStyleModalWrap}
            style={{ margin: 0, top: 40, right: 40, position: 'absolute' }}
            modalRender={(modal) => (
                <Draggable disabled={disabledScss} bounds={boundsScss} nodeRef={draggleRefScss} onStart={(event, uiData) => onStartScss(event, uiData)}>
                    <div ref={draggleRefScss}>{modal}</div>
                </Draggable>
            )}
        >
            <div className={classes.editorLayout} style={{ height: '75vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, border: '1px solid #d9d9d9', borderRadius: 6, overflow: 'hidden' }}>
                    <Editor
                        language="scss"
                        value={sass}
                        onChange={value=> updateGlobalStyles({ sass: value })}
                        theme="vs-dark"
                        onMount={(editor) => { editorRef.current = editor; }}
                        options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            wordWrap: 'on'
                        }}
                    />
                </div>
            </div>
        </Modal>
    </>;
});
