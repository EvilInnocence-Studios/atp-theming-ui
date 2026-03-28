import { overridable } from "@core/lib/overridable";
import { LayoutComponent as LayoutComponentImpl } from "@theming/components/LayoutComponent";
import { LayoutProps } from "./Layout.d";

export const LayoutComponent = overridable(({ component, __fixed }: LayoutProps) =>
    component ? <LayoutComponentImpl {...component} __fixed={__fixed} /> : null
);
