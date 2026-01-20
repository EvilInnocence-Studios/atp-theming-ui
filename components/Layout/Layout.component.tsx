import { overridable } from "@core/lib/overridable";
import { LayoutComponent as LayoutComponentImpl } from "@theming/components/LayoutComponent";
import { LayoutProps } from "./Layout.d";

export const LayoutComponent = overridable(({component}:LayoutProps) =>
    component ? <LayoutComponentImpl {...component} /> : null
);
