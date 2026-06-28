import { DataListNewComponent } from "./DataListNew.component";
import { connectDataListNew } from "./DataListNew.container";
import { ILayoutEditorProps, LayoutEditor } from "@theming/lib/layout/componentRegistry";

export const DataListNewLayoutEditor:LayoutEditor = ({css, className, ...props}:ILayoutEditorProps) => {
    const DataListNewOrig = connectDataListNew(DataListNewComponent);

    return <>
        {css && <style>{css}</style>}
        <div className={className}>
             <DataListNewOrig {...props} />
        </div>
    </>;
};
