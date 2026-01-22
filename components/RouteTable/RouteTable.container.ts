import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import { createInjector, inject, mergeProps } from "unstateless";
import icon from './icon.svg';
import { RouteTableComponent } from "./RouteTable.component";
import { IRouteTableInputProps, IRouteTableProps, RouteTableProps } from "./RouteTable.d";
import { RouteTablePropEditor } from "./RouteTable.props";

const injectRouteTableProps = createInjector(({__activeRoute}:IRouteTableInputProps):IRouteTableProps => {
    const activeRoute = __activeRoute;
    
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
