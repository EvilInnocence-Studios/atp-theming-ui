import { overridable } from "@core/lib/overridable";
import { ThemeDescriptionProps } from "./ThemeDescription.d";

export const ThemeDescriptionComponent = overridable(({className, css, description}:ThemeDescriptionProps) => <>
    {css && <style>{css}</style>}
    <span className={className}>{description}</span>
</>);

