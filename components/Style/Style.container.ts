import { createInjector, inject, mergeProps } from "unstateless";
import {StyleComponent} from "./Style.component";
import {IStyleInputProps, StyleProps, IStyleProps} from "./Style.d";
import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import icon from './icon.svg';
import { StylePropEditor } from "./Style.props";
import { useTheme } from "@theming/lib/useTheme";

const injectStyleProps = createInjector(({vars}:IStyleInputProps):IStyleProps => {
    const theme = useTheme(vars || {});
    
    return {theme};
});

const connect = inject<IStyleInputProps, StyleProps>(mergeProps(
    injectStyleProps,
));
export const connectStyle = connect;

export const Style = withLayoutMetadata(
    overridable<IStyleInputProps>(connect(StyleComponent)),
    {
        name: "Style",
        displayName: "Style",
        category: "Misc",
        description: "",
        icon,
        getSlotDisplayName: (slotName, props) => props[slotName] || slotName,
        propEditor: StylePropEditor,
    }
);
