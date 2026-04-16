import { createInjector, inject, mergeProps } from "unstateless";
import {ThemeNameComponent} from "./ThemeName.component";
import {IThemeNameInputProps, ThemeNameProps, IThemeNameProps} from "./ThemeName.d";
import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import icon from './icon.svg';
import { useLayoutTheme } from "@theming/lib/useTheme";

const injectThemeNameProps = createInjector(({}:IThemeNameInputProps):IThemeNameProps => {
    const {theme} = useLayoutTheme();

    return {
        name: theme?.name || "No Theme Selected"
    };
});

const connect = inject<IThemeNameInputProps, ThemeNameProps>(mergeProps(
    injectThemeNameProps,
));
export const connectThemeName = connect;

export const ThemeName = withLayoutMetadata(
    overridable<IThemeNameInputProps>(connect(ThemeNameComponent)),
    {
        name: "ThemeName",
        displayName: "Theme Name",
        category: "Theme",
        subCategory: "Display",
        description: "",
        icon,
        getSlotDisplayName: (slotName, props) => props[slotName] || slotName,
    }
);
