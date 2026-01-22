import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import { createInjector, inject, mergeProps } from "unstateless";
import icon from './icon.svg';
import { MultiColumnLayoutComponent } from "./MultiColumnLayout.component";
import { IMultiColumnLayoutInputProps, IMultiColumnLayoutProps, MultiColumnLayoutProps } from "./MultiColumnLayout.d";
import { MultiColumnLayoutPropEditor } from "./MultiColumnLayout.props";

const injectMultiColumnLayoutProps = createInjector(({}:IMultiColumnLayoutInputProps):IMultiColumnLayoutProps => {
    return {};
});

const connect = inject<IMultiColumnLayoutInputProps, MultiColumnLayoutProps>(mergeProps(
    injectMultiColumnLayoutProps,
));
export const connectMultiColumnLayout = connect;

export const MultiColumnLayout = withLayoutMetadata(
    overridable<IMultiColumnLayoutInputProps>(connect(MultiColumnLayoutComponent)),
    {
        name: "MultiColumnLayout",
        displayName: "Multi Column Layout",
        category: "Layouts",
        description: "A multi column layout",
        icon,
        propEditor: MultiColumnLayoutPropEditor,
        getSlotDisplayName: (slotName, props) => {
            if (!slotName.startsWith('column-')) return slotName;
            const id = slotName.replace('column-', '');
            const index = props.columns?.findIndex((c: any) => c.id === id);
            return (index !== undefined && index !== -1) ? `Column ${index + 1}` : slotName;
        },
    }
);
