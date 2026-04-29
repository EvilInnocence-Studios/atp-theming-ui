import { createInjector, inject, mergeProps } from "unstateless";
import {GlobalStyleEditorComponent} from "./GlobalStyleEditor.component";
import {IGlobalStyleEditorInputProps, GlobalStyleEditorProps, IGlobalStyleEditorProps} from "./GlobalStyleEditor.d";
import { overridable } from "@core/lib/overridable";

const injectGlobalStyleEditorProps = createInjector(({}:IGlobalStyleEditorInputProps):IGlobalStyleEditorProps => {
    return {};
});

const connect = inject<IGlobalStyleEditorInputProps, GlobalStyleEditorProps>(mergeProps(
    injectGlobalStyleEditorProps,
));
export const connectGlobalStyleEditor = connect;

export const GlobalStyleEditor = overridable<IGlobalStyleEditorInputProps>(connect(GlobalStyleEditorComponent));
