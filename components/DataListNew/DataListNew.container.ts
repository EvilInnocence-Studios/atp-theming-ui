import { createInjector, inject, mergeProps } from "unstateless";
import {DataListNewComponent} from "./DataListNew.component";
import {IDataListNewInputProps, DataListNewProps, IDataListNewProps} from "./DataListNew.d";
import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import icon from './icon.svg';
import { DataListNewLayoutEditor } from "./DataListNew.layout";
import { DataListNewPropEditor } from "./DataListNew.props";

const injectDataListNewProps = createInjector(({}:IDataListNewInputProps):IDataListNewProps => {
    return {};
});

const connect = inject<IDataListNewInputProps, DataListNewProps>(mergeProps(
    injectDataListNewProps,
));
export const connectDataListNew = connect;

export const DataListNew = withLayoutMetadata(
    overridable<IDataListNewInputProps>(connect(DataListNewComponent)),
    {
        name: "DataListNew",
        displayName: "DataListNew",
        category: "Layout",
        subCategory: "Structure",
        description: "",
        icon,
        getSlotDisplayName: (slotName, props) => props[slotName] || slotName,
        layoutEditor: DataListNewLayoutEditor,
        propEditor: DataListNewPropEditor,
    }
);
