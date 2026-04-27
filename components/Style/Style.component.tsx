import { overridable } from "@core/lib/overridable";
import { objMap } from "ts-functional";
import { IStyleVar, StyleProps } from "./Style.d";
import { ConfigProvider } from "antd";
import { SlotRenderer } from "../SlotRenderer";

export const StyleComponent = overridable(({slots, css, vars, fonts, theme, __layoutId, name}:StyleProps) => <>
    <style>
        {fonts?.filter(f => f.url).map(f => `
            @font-face {
                font-family: "${f.name}";
                src: url("${f.url}");
                font-weight: ${f.weight || "normal"};
                font-style: ${f.style || "normal"};
                font-display: swap;
            }
        `).join("\n")}
        .rootLayout {"{"}
            {Object.values(objMap<IStyleVar, string>(v => `--${v.name}: ${v.value};`)(vars || {})).join("\n")}

            /*==========================*/
            /* === Calculate values === */
            /*==========================*/

            /* === BASE SCALE === */
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

            /* === SECONDARY SCALE === */
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

            /* === NEUTRAL SCALE === */
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

            /* === SUCCESS SCALE === */
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

            /* === WARNING SCALE === */
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

            /* === ERROR SCALE === */
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

            /* === INFO SCALE === */
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
        {"}"}
        {css}
    </style>

    <div className="rootLayout" style={{display: "contents"}}>
        <ConfigProvider theme={theme}>
            <SlotRenderer
                slots={slots?.[`children`]} 
                parentId={__layoutId}
                slotName="children"
                componentName={name}
                getDisplayName={() => "Children"}
            />
        </ConfigProvider>
    </div>
</>);
