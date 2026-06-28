import { createInjector, inject, mergeProps } from "unstateless";
import {DataFieldComponent} from "./DataField.component";
import {IDataFieldInputProps, DataFieldProps, IDataFieldProps} from "./DataField.d";
import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import icon from './icon.svg';
import { DataFieldLayoutEditor } from "./DataField.layout";
import { DataFieldPropEditor } from "./DataField.props";
import { Index } from "ts-functional/dist/types";
import { useContext } from "react";
import { DataListContext } from "../DataList/DataList.util";

const injectDataFieldProps = createInjector(({column, dataType, data}:IDataFieldInputProps):IDataFieldProps => {
    const listContext = useContext(DataListContext);
    
    const thisData = data || listContext.row;
    const col = listContext.columns.find(col => col.name === column);

    const value = thisData && column && column in (thisData as Index<any>) ? (thisData as Index<any>)[column] : "";
    
    return {
        dataType: dataType || col?.dataType,
        value,
    };
});

const connect = inject<IDataFieldInputProps, DataFieldProps>(mergeProps(
    injectDataFieldProps,
));
export const connectDataField = connect;

export const DataField = withLayoutMetadata(
    overridable<IDataFieldInputProps>(connect(DataFieldComponent)),
    {
        name: "DataField",
        displayName: "DataField",
        category: "Layout",
        subCategory: "Structure",
        description: "",
        icon,
        getSlotDisplayName: (slotName, props) => props[slotName] || slotName,
        layoutEditor: DataFieldLayoutEditor,
        propEditor: DataFieldPropEditor,
    }
);
