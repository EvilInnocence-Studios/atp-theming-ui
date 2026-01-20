import { overridable } from "@core/lib/overridable";
import { LayoutComponentProps } from "./LayoutComponent.d";

export const LayoutComponentComponent = overridable(({ Component, props, slots, css }: LayoutComponentProps) =>
    Component ? <>
        <Component {...props} css={css} slots={slots} />
    </> : null
);
