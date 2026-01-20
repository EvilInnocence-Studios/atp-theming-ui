import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import { createInjector, inject, mergeProps } from "unstateless";
import icon from './icon.svg';
import { TextComponent } from "./Text.component";
import { ITextInputProps, ITextProps, TextProps } from "./Text.d";
import { TextPropEditor } from "./Text.props";

const injectTextProps = createInjector(({}:ITextInputProps):ITextProps => {
    return {};
});

const connect = inject<ITextInputProps, TextProps>(mergeProps(
    injectTextProps,
));
export const connectText = connect;

export const Text = withLayoutMetadata(
    overridable<ITextInputProps>(connect(TextComponent)),
    {
        name: "Text",
        displayName: "Text",
        category: "Basic",
        description: "A simple text component",
        icon,
        propEditor: TextPropEditor,
    }
);
