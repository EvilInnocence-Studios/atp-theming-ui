import { overridable } from "@core/lib/overridable";
import { LayoutComponentProps } from "./LayoutComponent.d";
import { LayoutFixedContext, useLayoutFixed } from "@theming/lib/layout/context";

export const LayoutComponentComponent = overridable(({ Component, props, slots, css, __fixed }: LayoutComponentProps) => {
    const isFixedContext = useLayoutFixed();
    const isFixed = __fixed || isFixedContext;

    return Component ? <LayoutFixedContext.Provider value={isFixed}>
        <Component {...props} css={css} slots={slots} __fixed={isFixed} />
    </LayoutFixedContext.Provider> : null;
});
