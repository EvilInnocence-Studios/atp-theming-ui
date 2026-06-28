import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import { createInjector, inject, mergeProps } from "unstateless";
import { DataListComponent } from "./DataList.component";
import { DataListProps, IDataListInputProps, IDataListProps } from "./DataList.d";
import { DataListLayoutEditor } from "./DataList.layout";
import { DataListPropEditor } from "./DataList.props";
import icon from './icon.svg';

const injectDataListProps = createInjector(({ }:IDataListInputProps):IDataListProps => {
    return {};
});

const connect = inject<IDataListInputProps, DataListProps>(mergeProps(
    injectDataListProps,
));
export const connectDataList = connect;

export const DataList = withLayoutMetadata(
    overridable<IDataListInputProps>(connect(DataListComponent)),
    {
        name: "DataList",
        displayName: "DataList",
        category: "Layout",
        subCategory: "Structure",
        description: "",
        icon,
        getSlotDisplayName: (slotName, props) => props[slotName] || slotName,
        propEditor: DataListPropEditor,
        layoutEditor: DataListLayoutEditor,
    }
);
