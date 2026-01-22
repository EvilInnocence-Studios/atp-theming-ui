import { createInjector, inject, mergeProps } from "unstateless";
import {ContainerComponent} from "./Container.component";
import {IContainerInputProps, ContainerProps, IContainerProps} from "./Container.d";
import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import icon from './icon.svg';

const injectContainerProps = createInjector(({}:IContainerInputProps):IContainerProps => {
    return {};
});

const connect = inject<IContainerInputProps, ContainerProps>(mergeProps(
    injectContainerProps,
));
export const connectContainer = connect;

export const Container = withLayoutMetadata(
    overridable<IContainerInputProps>(connect(ContainerComponent)),
    {
        name: "Container",
        displayName: "Container",
        category: "Layouts",
        description: "A basic container for separating content",
        icon,
        getSlotDisplayName: (slotName) => slotName === 'children' ? 'Children' : slotName,
    }
);
