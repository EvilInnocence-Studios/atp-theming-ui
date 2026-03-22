import { ThemeConfig } from "antd";
import { Index } from "ts-functional/dist/types";

export declare interface IStyleProps {
    theme: ThemeConfig;
    fonts?: IStyleFont[];
}

export declare interface IStyleVar {
    name: string;
    value: string;
    type: "color" | "string";
}

export declare interface IStyleFontInput {
    name: string;
    fontId?: string;
    weight: string;
    style: string;
}

export declare interface IStyleFont extends IStyleFontInput {
    url?: string;
}

// What gets passed into the component from the parent as attributes
export declare interface IStyleInputProps {
    className?: string;
    css?: string;
    classes?: any;
    slots?: Index<ILayoutComponent[]>;
    __layoutId?: string;
    vars?: Index<IStyleVar>;
    fonts?: Index<IStyleFontInput>;
}

export type StyleProps = IStyleInputProps & IStyleProps;
