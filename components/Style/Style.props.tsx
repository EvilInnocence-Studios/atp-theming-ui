import { MediaPicker } from "@common/components/MediaPicker";
import { DeleteBtn } from "@core/components/DeleteBtn";
import { Editable } from "@core/components/Editable";
import { Label } from "@core/components/Label";
import { uuidv4 } from "@theming/lib/layout/utils";
import { Button, Col, ColorPicker, Row, Select, Space, Tabs } from "antd";
import { objFilter, objMap } from "ts-functional";
import { IStyleFontInput, IStyleInputProps, IStyleVar } from "./Style.d";
import styles from './Style.module.scss';

export const StylePropEditor = (
    {vars = {}, fonts = {}}: IStyleInputProps,
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
    };

    const updateFont = (id:string, key: string) => (value: string) => {
        updateProp('fonts')({...fonts, [id]: {...fonts[id], [key]: value}});
    };

    const addFont = () => updateProp("fonts")({
        ...fonts,
        [uuidv4()]: {
            name: "NewFont",
            fontId: "",
            weight: "normal",
            style: "normal"
        }
    });

    const removeFont = (id:string) => () => {
        const newFonts = {...fonts};
        delete newFonts[id];
        
        updateProp("fonts")(newFonts);
    };

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
            <Tabs.TabPane key="fonts" tab="Fonts">
                <Button
                    type="primary"
                    onClick={addFont}
                >
                    Add Font
                </Button>
                <hr/>
                {Object.values(objMap<IStyleFontInput, JSX.Element>((f, i) => <div
                    key={i}
                >
                    <Row wrap={false} gutter={16}>
                        <Col flex="72px">
                            <MediaPicker
                                imageId={f.fontId}
                                onSelect={updateFont(i, "fontId")}
                                small={true}
                            />
                        </Col>
                        <Col flex="auto">
                            <Label label="Font Family">
                                <Editable
                                    placeholder="Font Family"
                                    value={f.name}
                                    onChange={updateFont(i, "name")}
                                />
                            </Label>
                            <Label label="Weight">
                                <Select
                                    value={f.weight || "normal"}
                                    onChange={updateFont(i, "weight")}
                                    style={{ width: '100%' }}
                                    options={[
                                        { value: '100', label: '100 - Thin' },
                                        { value: '200', label: '200 - Extra Light' },
                                        { value: '300', label: '300 - Light' },
                                        { value: 'normal', label: '400 - Normal' },
                                        { value: '500', label: '500 - Medium' },
                                        { value: '600', label: '600 - Semi Bold' },
                                        { value: 'bold', label: '700 - Bold' },
                                        { value: '800', label: '800 - Extra Bold' },
                                        { value: '900', label: '900 - Black' },
                                    ]}
                                />
                            </Label>
                            <Label label="Style">
                                <Select
                                    value={f.style || "normal"}
                                    onChange={updateFont(i, "style")}
                                    style={{ width: '100%' }}
                                    options={[
                                        { value: 'normal', label: 'Normal' },
                                        { value: 'italic', label: 'Italic' },
                                        { value: 'oblique', label: 'Oblique' }
                                    ]}
                                />
                            </Label>
                            <div style={{ textAlign: "right", marginTop: "8px" }}>
                                <DeleteBtn label="Delete Font" entityType="font face" onClick={removeFont(i)} />
                            </div>
                        </Col>
                    </Row>
                    <hr className={styles.hr} />
                </div>)(fonts))}
            </Tabs.TabPane>
        </Tabs>
    </>;
}
