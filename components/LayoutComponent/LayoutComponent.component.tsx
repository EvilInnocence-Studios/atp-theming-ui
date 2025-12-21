import { overridable } from "@core/lib/overridable";
import { LayoutComponentProps } from "./LayoutComponent.d";

export const LayoutComponentComponent = overridable(({ Component, props, slots }: LayoutComponentProps) =>
    Component ? <>
        <Component {...props} slots={slots} />
    </> : null
);
