import { ILayoutComponent } from "@theming/lib/layout/componentRegistry";

export declare type IDataListColumnType = 'text' | 'markdown' | 'number' | 'boolean' | 'date' | 'datetime' | 'time' | 'image';

export declare interface IDataListColumn {
    name: string;
    label: string;
    dataType: IDataListColumnType;
}

export declare interface IDataListProps {
}

// What gets passed into the component from the parent as attributes
export declare interface IDataListInputProps {
    className?: string;
    css?: string;
    classes?: any;
    slots?: Index<ILayoutComponent[]>;
    __layoutId?: string;
    name?: string;
    columns?: IDataListColumn[];
    data?: {}[];    
}

export type DataListProps = IDataListInputProps & IDataListProps;
