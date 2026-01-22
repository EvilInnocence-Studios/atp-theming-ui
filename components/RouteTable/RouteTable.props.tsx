import { Editable } from "@core/components/Editable";
import { onInputChange, onRadioChange } from "@core/lib/onInputChange";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { uuidv4 } from "@theming/lib/layout/utils";
import { Button, Input, Radio, Space } from "antd";
import { objMap } from "ts-functional";
import { IRouteTableInputProps } from "./RouteTable.d";

export const RouteTablePropEditor = (
    {routes, __activeRoute}: IRouteTableInputProps,
    updateProps: (props: any) => void,
    updateProp: (prop: string) => (value: any) => void
) => {
    const addRoute = (route: string) => {
        const id = uuidv4();
        updateProp("routes")({
            ...routes,
            [id]: route,
        });
    };

    const removeRoute = (id: string) => () => {
        updateProp("routes")({
            ...routes,
            [id]: undefined,
        });
    };

    const updateRoute = (id: string) => (route: string) => {
        updateProp("routes")({
            ...routes,
            [id]: route,
        });
    };

    const setActiveRoute = (id: string) => {
        updateProp("__activeRoute")(id);
    };

    return <>
        <Button onClick={() => addRoute("")}>
            <FontAwesomeIcon icon={faPlus} />
            Add Route
        </Button>
        <br/>
        <Radio.Group value={__activeRoute} onChange={onRadioChange(setActiveRoute)}>
            {!!routes && Object.values(objMap<string, JSX.Element>((route, id) => <Space.Compact>
                <Radio value={id} />
                <Input value={route} onChange={onInputChange(updateRoute(id))} />
                <Button onClick={removeRoute(id)}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
            </Space.Compact>)(routes))}
        </Radio.Group>
    </>;
}
