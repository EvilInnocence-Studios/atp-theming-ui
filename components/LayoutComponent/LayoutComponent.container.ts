import { createInjector, inject, mergeProps } from "unstateless";
import { LayoutComponentComponent } from "./LayoutComponent.component";
import { ILayoutComponentInputProps, LayoutComponentProps, ILayoutComponentProps } from "./LayoutComponent.d";
import { overridable } from "@core/lib/overridable";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";

const injectLayoutComponentProps = createInjector(({ component }: ILayoutComponentInputProps): ILayoutComponentProps => {
    return {
        Component: !!component
            ? ComponentRegistry.get(component)?.component
            : undefined
    };
});

const connect = inject<ILayoutComponentInputProps, LayoutComponentProps>(mergeProps(
    injectLayoutComponentProps,
));
export const connectLayoutComponent = connect;

export const LayoutComponent = overridable<ILayoutComponentInputProps>(connect(LayoutComponentComponent));
