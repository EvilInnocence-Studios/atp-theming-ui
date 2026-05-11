import { overridable } from "@core/lib/overridable";
import { LayoutComponent as LayoutComponentImpl } from "@theming/components/LayoutComponent";
import { generateCss } from "@theming/components/GlobalStyleEditor/util";
import { LayoutProps } from "./Layout.d";

export const LayoutComponent = overridable(({ component, theme, global, fonts, }: LayoutProps) => <>
    {global && <>
        <style>
            {generateCss(theme, fonts)}
        </style>
    </>}
    {component && <LayoutComponentImpl {...component} __fixed={true} />}
</>);
