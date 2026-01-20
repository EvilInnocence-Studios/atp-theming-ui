import { ILayoutComponent } from "@theming/lib/layout/layout";
import { ColProps, RowProps } from "antd";
import { Index } from "ts-functional/dist/types";

export declare interface IMultiColumnLayoutProps {

}

export declare interface IColProps extends ColProps {
    id: string;
    className?: string;
    css?: string;
}

// What gets passed into the component from the parent as attributes
export declare interface IMultiColumnLayoutInputProps {
    row?: RowProps;
    columns?: IColProps[];
    className?: string;
    css?: string;
    classes?: any;
    slots?: Index<ILayoutComponent[]>;
    __layoutId?: string;
}

export type MultiColumnLayoutProps = IMultiColumnLayoutInputProps & IMultiColumnLayoutProps;
