import { createInjector, inject, mergeProps } from "unstateless";
import {SlotRendererComponent} from "./SlotRenderer.component";
import {ISlotRendererInputProps, SlotRendererProps, ISlotRendererProps} from "./SlotRenderer.d";
import { overridable } from "@core/lib/overridable";

const injectSlotRendererProps = createInjector(({}:ISlotRendererInputProps):ISlotRendererProps => {
    return {};
});

const connect = inject<ISlotRendererInputProps, SlotRendererProps>(mergeProps(
    injectSlotRendererProps,
));
export const connectSlotRenderer = connect;

export const SlotRenderer = overridable<ISlotRendererInputProps>(connect(SlotRendererComponent));
