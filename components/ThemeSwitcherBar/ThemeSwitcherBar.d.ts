import { ILayoutComponent } from "@theming/lib/layout/componentRegistry";

export declare interface IThemeSwitcherBarProps {

}

// What gets passed into the component from the parent as attributes
export declare interface IThemeSwitcherBarInputProps {
    className?: string;
    css?: string;
    classes?: any;
    slots?: Index<ILayoutComponent[]>;
    __layoutId?: string;
}

export type ThemeSwitcherBarProps = IThemeSwitcherBarInputProps & IThemeSwitcherBarProps;
