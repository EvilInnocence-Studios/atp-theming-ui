import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import { createInjector, inject, mergeProps } from "unstateless";
import icon from './icon.svg';
import { RouteTableComponent } from "./RouteTable.component";
import { IRouteTableInputProps, IRouteTableProps, RouteTableProps } from "./RouteTable.d";
import { RouteTablePropEditor } from "./RouteTable.props";
import { useLayoutManager } from "@theming/lib/layout/context";
import { findMatchingRoute } from "@core/lib/routeUtils";
import { useLocation } from "react-router";

const injectRouteTableProps = createInjector(({__activeRoute, routes}:IRouteTableInputProps):IRouteTableProps => {
    const {isEditing} = useLayoutManager();

    const locationPath = useLocation().pathname;
    const matchingRouteId = findMatchingRoute(locationPath, routes);

    const activeRoute = isEditing ? __activeRoute : matchingRouteId;
    
    return {activeRoute};
});

const connect = inject<IRouteTableInputProps, RouteTableProps>(mergeProps(
    injectRouteTableProps,
));
export const connectRouteTable = connect;

export const RouteTable = withLayoutMetadata(
    overridable<IRouteTableInputProps>(connect(RouteTableComponent)),
    {
        name: "RouteTable",
        displayName: "RouteTable",
        category: "Layouts",
        description: "",
        icon,
        propEditor: RouteTablePropEditor,
        getSlotDisplayName: (slotName, props) => props.routes?.[slotName] || slotName,
    }
);
