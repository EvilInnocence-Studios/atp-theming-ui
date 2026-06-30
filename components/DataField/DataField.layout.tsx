import { ILayoutEditorProps, LayoutEditor } from "@theming/lib/layout/componentRegistry";

export const DataFieldLayoutEditor:LayoutEditor = ({css, className, column}:ILayoutEditorProps) => {
    return <>
        {css && <style>{css}</style>}
        <div className={className}>
            {column} data
        </div>
    </>;
};
