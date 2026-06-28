import { ILayoutEditorProps, LayoutEditor } from "@theming/lib/layout/componentRegistry";
import { SlotRenderer } from "../SlotRenderer";

export const DataListLayoutEditor:LayoutEditor = ({css, className, slots, __layoutId, name}:ILayoutEditorProps) => {
    return <>
        {css && <style>{css}</style>}
        <div className={className}>
            DataList layout editor goes here
            <SlotRenderer
                slots={slots?.[`children`]}
                parentId={__layoutId}
                slotName="children"
                componentName={name}
                getDisplayName={() => "Children"}
            />
        </div>
    </>;
};
