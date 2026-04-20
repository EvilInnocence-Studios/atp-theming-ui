import { createInjector, inject, mergeProps } from "unstateless";
import {ThemeSwitcherBarComponent} from "./ThemeSwitcherBar.component";
import {IThemeSwitcherBarInputProps, ThemeSwitcherBarProps, IThemeSwitcherBarProps} from "./ThemeSwitcherBar.d";
import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import icon from './icon.svg';

const injectThemeSwitcherBarProps = createInjector(({}:IThemeSwitcherBarInputProps):IThemeSwitcherBarProps => {
    return {};
});

const connect = inject<IThemeSwitcherBarInputProps, ThemeSwitcherBarProps>(mergeProps(
    injectThemeSwitcherBarProps,
));
export const connectThemeSwitcherBar = connect;

export const ThemeSwitcherBar = withLayoutMetadata(
    overridable<IThemeSwitcherBarInputProps>(connect(ThemeSwitcherBarComponent)),
    {
        name: "ThemeSwitcherBar",
        displayName: "ThemeSwitcherBar",
        category: "Theme",
        subCategory: "Display",
        description: "",
        icon,
        getSlotDisplayName: (slotName, props) => props[slotName] || slotName,
    }
);
