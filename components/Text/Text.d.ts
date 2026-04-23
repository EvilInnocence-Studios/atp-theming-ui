export declare interface ITextProps {

}

// What gets passed into the component from the parent as attributes
export declare interface ITextInputProps {
    className?: string;
    css?: string;
    markdown?: string;
    classes?: any;
    inline?: boolean;
    raw?: boolean;
    slots?: Index<ILayoutComponent[]>;
    __layoutId?: string;
}

export type TextProps = ITextInputProps & ITextProps;
