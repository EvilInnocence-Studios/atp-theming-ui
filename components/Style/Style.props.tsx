import { DeleteBtn } from "@core/components/DeleteBtn";
import { Editable } from "@core/components/Editable";
import { uuidv4 } from "@theming/lib/layout/utils";
import { Button, ColorPicker, Space, Tabs } from "antd";
import { objFilter, objMap } from "ts-functional";
import { IStyleInputProps, IStyleVar } from "./Style.d";

export const StylePropEditor = (
    {vars = {}}: IStyleInputProps,
    _updateProps: (props: any) => void,
    updateProp: (prop: string) => (value: any) => void
) => {
    const updateVar = (id:string, key: string) => (value: string) => {
        updateProp('vars')({...vars, [id]: {...vars[id], [key]: value}});
    };

    const addVar = (type: string) => () => updateProp("vars")({
        ...vars,
        [uuidv4()]: {
            name: "",
            value: "",
            type
        }
    });

    const removeVar = (id:string) => () => {
        const newVars = {...vars};
        delete newVars[id];
        
        updateProp("vars")(newVars);
    }

    return <>
        <Tabs>
            <Tabs.TabPane key="colors" tab="Colors">
                <Button
                    type="primary"
                    onClick={addVar("color")}
                >
                    Add Color
                </Button>
                {Object.values(objMap<IStyleVar, JSX.Element>((v, i) => 
                    <Space.Compact key={i}>
                        <Editable
                            placeholder="Color Name"
                            value={v.name}
                            onChange={updateVar(i, "name")}
                        />
                        <ColorPicker
                            value={v.value}
                            onChange={color => updateVar(i, "value")(color.toHexString())}
                            placement="topRight"
                        />
                        <Editable
                            placeholder="Color Value"
                            value={v.value}
                            onChange={updateVar(i, "value")}
                        />
                        <DeleteBtn entityType="CSS color" onClick={removeVar(i)} />
                    </Space.Compact>
                )(objFilter<IStyleVar>(v => v.type === "color")(vars)))}
            </Tabs.TabPane>
            <Tabs.TabPane key="variables" tab="Variables">
                <Button
                    type="primary"
                    onClick={addVar("string")}
                >
                    Add Variable
                </Button>
                {Object.values(objMap<IStyleVar, JSX.Element>((v, i) => <Space.Compact
                    key={i}
                >
                    <Editable
                        placeholder="Variable Name"
                        value={v.name}
                        onChange={updateVar(i, "name")}
                    />
                    <Editable
                        placeholder="Variable Value"
                        value={v.value}
                        onChange={updateVar(i, "value")}
                    />
                    <DeleteBtn entityType="CSS variable" onClick={removeVar(i)} />
                </Space.Compact>)(objFilter<IStyleVar>(v => v.type === "string")(vars)))}
            </Tabs.TabPane>
        </Tabs>
    </>;
}
