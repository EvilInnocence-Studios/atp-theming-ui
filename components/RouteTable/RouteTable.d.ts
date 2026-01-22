import { Index } from "ts-functional/dist/types";

export declare interface IRouteTableProps {
    activeRoute?: string;
}

// What gets passed into the component from the parent as attributes
export declare interface IRouteTableInputProps {
    className?: string;
    css?: string;
    classes?: any;
    slots?: Index<ILayoutComponent[]>;
    __layoutId?: string;
    routes?: Index<string>; // id -> route(s), wildcard, comma-separated
    __activeRoute?: string;
}

export type RouteTableProps = IRouteTableInputProps & IRouteTableProps;
