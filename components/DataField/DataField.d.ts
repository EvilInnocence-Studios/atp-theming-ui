import { ILayoutComponent } from "@theming/lib/layout/componentRegistry";
import { IDataListColumnType } from "../DataList/DataList";

export declare interface IDataFieldProps {
    value: any;
    dataType?: IDataListColumnType;
}

// What gets passed into the component from the parent as attributes
export declare interface IDataFieldInputProps {
    className?: string;
    css?: string;
    classes?: any;
    slots?: Index<ILayoutComponent[]>;
    __layoutId?: string;
    column?: string;
    dataType?: IDataListColumnType;
    data?: {};
}

export type DataFieldProps = IDataFieldInputProps & IDataFieldProps;
