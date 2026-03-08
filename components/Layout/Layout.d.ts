import { ILayoutComponent } from "@theming/lib/layout/layout";
import { Provider } from "react";

export declare interface ILayoutProps<Context = undefined> {
    component: ILayoutComponent | null;
    Provider?: Provider<Context>;
}

// What gets passed into the component from the parent as attributes
export declare interface ILayoutInputProps<Context = undefined> {
    element: string;
    classes?: any;
    context?: Context;
}

export type LayoutProps<Context = undefined> = ILayoutInputProps<Context> & ILayoutProps<Context>;