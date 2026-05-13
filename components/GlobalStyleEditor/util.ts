import { ITheme } from "@theming-shared/theme/types";
import { IStyleFont, IStyleVar } from "../Style/Style";

export const titleCaseWords = (input:string) => input
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const tintStops = [[50, 90], [100, 80], [200, 65], [300, 50], [400, 30]] as const;
export const shadeStops = [[600, 15], [700, 30], [800, 50], [900, 70]] as const;

export const scales = (vars:IStyleVar[]) => 
    vars.filter(v => v.type === 'color' && !['white', 'black'].includes(v.name)).map(v => ({
        name: titleCaseWords(v.name),
        prefix: v.name
    }));

export const stops = [...tintStops.map(s => s[0]), ...shadeStops.map(s => s[0])];

export const generateCss = (theme:ITheme | null, fonts:IStyleFont[] = []) => {
    const globalStyles = theme?.globalStyles;
    const vars = globalStyles?.variables ?? [];
    const {css} = globalStyles ?? {};
    const colors = vars.filter(v => v.type === 'color' && !['white', 'black'].includes(v.name)).map(v => v.name);
    
    const cssText = `
        ${vars.map((v: IStyleVar) => `--${v.name}: ${v.value};`).join("\n")}

        ${colors.map((color) => tintStops.map(([stop, percent]) => 
            `--${color}-${stop}: color-mix(in srgb, var(--${color}), var(--white) calc(${percent}% * var(--tint-strength)));`
        ).join("\n")).join("\n")}

        ${colors.map((color) => 
            `--${color}-500: var(--${color});`
        ).join("\n")}

        ${colors.map((color) => shadeStops.map(([stop, percent]) => 
            `--${color}-${stop}: color-mix(in srgb, var(--${color}), var(--black) calc(${percent}% * var(--shade-strength)));`
        ).join("\n")).join("\n")}

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

        /* === FONTS === */
        ${fonts.map((f) => `@font-face {
            font-family: '${f.name}';
            src: url('${f.url}');
            font-weight: ${f.weight};
            font-style: ${f.style};
        }`).join("\n")}

        ${css}
    `;

    return cssText;
}