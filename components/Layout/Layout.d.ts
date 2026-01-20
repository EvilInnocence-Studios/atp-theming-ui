import { ILayoutComponent } from "@theming/lib/layout/layout";

export declare interface ILayoutProps {
    component: ILayoutComponent | null;
}

// What gets passed into the component from the parent as attributes
export declare interface ILayoutInputProps {
    element: string;
    classes?: any;
}

export type LayoutProps = ILayoutInputProps & ILayoutProps;