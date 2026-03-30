import { overridable } from "@core/lib/overridable";
import { SlotRenderer } from "../SlotRenderer";
import { ContainerProps } from "./Container.d";

export const ContainerComponent = overridable(({slots, __layoutId, className, css, name, element}:ContainerProps) => {
    const Element: any = element || 'div';
    
    return <>
        {css && <style>{css}</style>}
        <Element className={className}>
            <SlotRenderer
                slots={slots?.[`children`]} 
                parentId={__layoutId}
                slotName="children"
                componentName={name}
                getDisplayName={() => "Children"}
            />
        </Element>
    </>;
});
