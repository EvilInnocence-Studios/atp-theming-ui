import { ITheme } from "@theming-shared/theme/types";
import { ILayoutComponent } from "@theming/lib/layout/layout";
import { IStyleFont } from "../Style/Style";

export declare interface ILayoutProps<Context = undefined> {
    component: ILayoutComponent | null;
    theme: ITheme | null;
    fonts: IStyleFont[];
}

// What gets passed into the component from the parent as attributes
export declare interface ILayoutInputProps<Context = undefined> {
    element: string;
    classes?: any;
    global?: boolean;
}

export type LayoutProps<Context = undefined> = ILayoutInputProps<Context> & ILayoutProps<Context>;