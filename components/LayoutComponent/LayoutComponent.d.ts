import { ILayoutComponent } from "@core/lib/layout/layout";
import { Index } from "ts-functional/dist/types";

export declare interface ILayoutComponentProps {
    Component: React.ComponentType<any> | undefined;
}

// What gets passed into the component from the parent as attributes
export declare interface ILayoutComponentInputProps extends ILayoutComponent {
    component: string;
    props: Index<any>;
    slots: Index<ILayoutComponent>;
    classes?: any;
}

export type LayoutComponentProps = ILayoutComponentInputProps & ILayoutComponentProps;