import { overridable } from "@core/lib/overridable";
import { SlotRenderer } from "../SlotRenderer";
import { ContainerProps } from "./Container.d";

export const ContainerComponent = overridable(({slots, __layoutId, className, css}:ContainerProps) => <>
    {css && <style>{css}</style>}
    <div className={className}>
        <SlotRenderer
            slots={slots?.[`children`]} 
            parentId={__layoutId}
            slotName="children"
            getDisplayName={() => "Children"}
        />
    </div>
</>);
