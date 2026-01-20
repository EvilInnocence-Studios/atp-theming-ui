export declare interface IContainerProps {

}

// What gets passed into the component from the parent as attributes
export declare interface IContainerInputProps {
    className?: string;
    css?: string;
    classes?: any;
    slots?: Index<ILayoutComponent[]>;
    __layoutId?: string;
}

export type ContainerProps = IContainerInputProps & IContainerProps;
