import { ILayoutComponent } from "@theming/lib/layout/componentRegistry";

export declare interface IDataListNewProps {

}

// What gets passed into the component from the parent as attributes
export declare interface IDataListNewInputProps {
    className?: string;
    css?: string;
    classes?: any;
    slots?: Index<ILayoutComponent[]>;
    __layoutId?: string;
}

export type DataListNewProps = IDataListNewInputProps & IDataListNewProps;
