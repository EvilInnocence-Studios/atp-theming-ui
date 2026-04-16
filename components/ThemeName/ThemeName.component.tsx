import { overridable } from "@core/lib/overridable";
import { ThemeNameProps } from "./ThemeName.d";

export const ThemeNameComponent = overridable(({className, css, name}:ThemeNameProps) => <>
    {css && <style>{css}</style>}
    <span className={className}>{name}</span>
</>);

