import { ILayoutComponent, RouteTable, SlotItem } from "@core/lib/layout/layout";

export declare interface ISlotRendererProps {

}

// What gets passed into the component from the parent as attributes
export declare interface ISlotRendererInputProps {
    classes?: any;
    slots?: SlotItem[];
    parentId?: string;
    slotName?: string;
    componentName?: string;
    depth?: number;
}

export type SlotRendererProps = ISlotRendererInputProps & ISlotRendererProps;