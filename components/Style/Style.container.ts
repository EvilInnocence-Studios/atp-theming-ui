import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import { useTheme } from "@theming/lib/useTheme";
import { createInjector, inject, mergeProps } from "unstateless";
import icon from './icon.svg';
import { StyleComponent } from "./Style.component";
import { IStyleInputProps, IStyleProps, StyleProps } from "./Style.d";
import { StylePropEditor } from "./Style.props";

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
