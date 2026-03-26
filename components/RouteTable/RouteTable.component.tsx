import { overridable } from "@core/lib/overridable";
import { SlotRenderer } from "../SlotRenderer";
import { RouteTableProps } from "./RouteTable.d";

export const RouteTableComponent = overridable(({slots, __layoutId, className, css, activeRoute, routes, isEditing, name}:RouteTableProps) => {
    return <>
    {css && <style>{css}</style>}
    <div className={className}>
        {isEditing && Object.entries(routes || {}).map(([routeId, routeName]) => (
            <div key={routeId} style={{ display: activeRoute === routeId ? 'contents' : 'none' }}>
                <SlotRenderer
                    slots={slots?.[routeId]}
                    parentId={__layoutId}
                    slotName={routeId}
                    componentName={name}
                    getDisplayName={() => routeName || ""}
                />
            </div>
        ))}
        {!isEditing && <SlotRenderer
            slots={slots?.[activeRoute || ""]}
            parentId={__layoutId}
            slotName={activeRoute}
            componentName={name}
            getDisplayName={() => activeRoute || ""}
        />}
    </div>
</>});
