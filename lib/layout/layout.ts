import { Index } from "ts-functional/dist/types";
import { IOperation } from "./derivers";

export declare interface ITheme {
    derivers?: Index<IOperation>;
    layout: ILayoutComponent;
}

export declare interface ILayoutComponentProps {
    __layoutId: string;
    __update: (key:string) => (value:any) => void;
    __isSelected: boolean;
}

export declare interface ILayoutComponent {
    id?: string;
    name?: string;
    component: string;
    slots?: Index<ILayoutComponent[]>;
    context?: Index<any>;
    props?: Index<any>;
    css?: string;
    map?: Index<string | { from: string }>;
}