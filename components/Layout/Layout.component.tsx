import { overridable } from "@core/lib/overridable";
import { LayoutComponent as LayoutComponentImpl } from "@theming/components/LayoutComponent";
import { LayoutProps } from "./Layout.d";

export const LayoutComponent = overridable(({ component, Provider, context }: LayoutProps) =>
    component && Provider ? <Provider value={context}><LayoutComponentImpl {...component} /></Provider> :
    component             ? <LayoutComponentImpl {...component} /> :
                            null
);
