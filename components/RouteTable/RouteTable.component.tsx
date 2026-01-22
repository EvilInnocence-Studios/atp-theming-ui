import { overridable } from "@core/lib/overridable";
import {RouteTableProps} from "./RouteTable.d";
import styles from './RouteTable.module.scss';
import { SlotRenderer } from "../SlotRenderer";

export const RouteTableComponent = overridable(({classes = styles, slots, __layoutId, className, css, activeRoute, routes}:RouteTableProps) => {
    return <>
    {css && <style>{css}</style>}
    <div className={className}>
        {Object.entries(routes || {}).map(([routeId, routeName]) => (
            <div key={routeId} style={{ display: activeRoute === routeId ? 'contents' : 'none' }}>
                <SlotRenderer
                    slots={slots?.[routeId]}
                    parentId={__layoutId}
                    slotName={routeId}
                    getDisplayName={() => routeName || ""}
                />
            </div>
        ))}
    </div>
</>});
