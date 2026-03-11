import { ILayoutComponent } from "@theming/lib/layout/layout";

export declare interface ILayoutProps<Context = undefined> {
    component: ILayoutComponent | null;
}

// What gets passed into the component from the parent as attributes
export declare interface ILayoutInputProps<Context = undefined> {
    element: string;
    classes?: any;
}

export type LayoutProps<Context = undefined> = ILayoutInputProps<Context> & ILayoutProps<Context>;