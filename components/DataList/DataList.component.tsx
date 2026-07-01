import { overridable } from "@core/lib/overridable";
import { DataListProps } from "./DataList.d";
import { DataListContext } from "./DataList.util";
import { SlotRenderer } from "../SlotRenderer";

const {Provider} = DataListContext;

export const DataListComponent = overridable(({slots, className, css, columns, data, __layoutId, name}:DataListProps) => <>
    {css && <style>{css}</style>}
    <div className={className}>
        {(data || []).map((row, idx) => <>
            <Provider value={{columns: columns || [], row}} key={idx}>
                <SlotRenderer
                    slots={slots?.[`children`]} 
                    parentId={__layoutId}
                    slotName="children"
                    componentName={name}
                    getDisplayName={() => "Children"}
                />
            </Provider>
        </>)}
    </div>
</>);

