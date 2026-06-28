import { DataFieldComponent } from "./DataField.component";
import { connectDataField } from "./DataField.container";
import { ILayoutEditorProps, LayoutEditor } from "@theming/lib/layout/componentRegistry";

export const DataFieldLayoutEditor:LayoutEditor = ({css, className, ...props}:ILayoutEditorProps) => {
    const DataFieldOrig = connectDataField(DataFieldComponent);

    return <>
        {css && <style>{css}</style>}
        <div className={className}>
             <DataFieldOrig {...props} />
        </div>
    </>;
};
