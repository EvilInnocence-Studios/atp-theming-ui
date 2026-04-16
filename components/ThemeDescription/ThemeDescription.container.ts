import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import { useLayoutTheme } from "@theming/lib/useTheme";
import { createInjector, inject, mergeProps } from "unstateless";
import icon from './icon.svg';
import { ThemeDescriptionComponent } from "./ThemeDescription.component";
import { IThemeDescriptionInputProps, IThemeDescriptionProps, ThemeDescriptionProps } from "./ThemeDescription.d";

const injectThemeDescriptionProps = createInjector(({}:IThemeDescriptionInputProps):IThemeDescriptionProps => {
    const {theme} = useLayoutTheme();
    
    return {
        description: theme?.description || "No Theme Selected"
    };
});

const connect = inject<IThemeDescriptionInputProps, ThemeDescriptionProps>(mergeProps(
    injectThemeDescriptionProps,
));
export const connectThemeDescription = connect;

export const ThemeDescription = withLayoutMetadata(
    overridable<IThemeDescriptionInputProps>(connect(ThemeDescriptionComponent)),
    {
        name: "ThemeDescription",
        displayName: "Theme Description",
        category: "Theme",
        subCategory: "Display",
        description: "",
        icon,
        getSlotDisplayName: (slotName, props) => props[slotName] || slotName,
    }
);
