import { Index } from "ts-functional/dist/types";

export declare interface IStyleProps {

}

export declare interface IStyleVar {
    name: string;
    value: string;
    type: "color" | "string";
}

// What gets passed into the component from the parent as attributes
export declare interface IStyleInputProps {
    className?: string;
    css?: string;
    classes?: any;
    slots?: Index<ILayoutComponent[]>;
    __layoutId?: string;
    vars?: Index<IStyleVar>;
}

export type StyleProps = IStyleInputProps & IStyleProps;
