import { MediaPicker } from "@common/components/MediaPicker";
import { DeleteBtn } from "@core/components/DeleteBtn";
import { Editable } from "@core/components/Editable";
import { Label } from "@core/components/Label";
import { uuidv4 } from "@theming/lib/layout/utils";
import { Button, Col, ColorPicker, Row, Select, Space, Tabs } from "antd";
import { objFilter, objMap } from "ts-functional";
import { IStyleFontInput, IStyleInputProps, IStyleVar } from "./Style.d";
import styles from './Style.module.scss';

const antColorValues: Record<string, string> = {
    colorBgBase: '#fff',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    colorLink: '#1677ff',
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorTextBase: '#000',
    colorWarning: '#faad14',
    blue: '#1677FF',
    purple: '#722ED1',
    cyan: '#13C2C2',
    green: '#52C41A',
    magenta: '#EB2F96',
    pink: '#EB2F96',
    red: '#F5222D',
    orange: '#FA8C16',
    yellow: '#FADB14',
    volcano: '#FA541C',
    geekblue: '#2F54EB',
    lime: '#A0D911',
    gold: '#FAAD14',
};

const antColorTokens = Object.entries(antColorValues).map(([key, value]) => ({
    value: key,
    label: `${key} (${value})`
}));

const antVariableValues: Record<string, string> = {
    borderRadius: '6',
    controlHeight: '32',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    fontFamilyCode: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '14',
    lineType: 'solid',
    lineWidth: '1',
    motion: 'true',
    motionBase: '0',
    motionEaseInBack: 'cubic-bezier(0.71, -0.46, 0.88, 0.6)',
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseInOutCirc: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
    motionEaseInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    motionEaseOutBack: 'cubic-bezier(0.12, 0.4, 0.29, 1.46)',
    motionEaseOutCirc: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
    motionEaseOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
    motionUnit: '0.1',
    opacityImage: '1',
    sizePopupArrow: '16',
    sizeStep: '4',
    sizeUnit: '4',
    wireframe: 'false',
    zIndexBase: '0',
    zIndexPopupBase: '1000',
};

const antVariableTokens = Object.entries(antVariableValues).map(([key, value]) => ({
    value: key,
    label: `${key}${value.length < 20 ? ` (${value})` : ''}`
}));

export const StylePropEditor = (
    {vars = {}, fonts = {}, antdAlgorithm}: IStyleInputProps,
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

    const addSeedToken = (type: "color" | "string", valuesMap: Record<string, string>) => (tokenName: string) => {
        updateProp("vars")({
            ...vars,
            [uuidv4()]: {
                name: tokenName,
                value: valuesMap[tokenName] || "",
                type
            }
        });
    };

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

    const addBaseVariables = () => {
        const newVars: Record<string, any> = {};
        const baseVariables = [
            { name: 'color-base', value: '#3b82f6', type: 'color' },
            { name: 'color-secondary', value: '#10b981', type: 'color' },
            { name: 'color-neutral', value: '#6b7280', type: 'color' },
            { name: 'tint-strength', value: '1', type: 'string' },
            { name: 'shade-strength', value: '1', type: 'string' },
            { name: 'white', value: '#ffffff', type: 'color' },
            { name: 'black', value: '#000000', type: 'color' },
            { name: 'color-success', value: '#22c55e', type: 'color' },
            { name: 'color-warning', value: '#eab308', type: 'color' },
            { name: 'color-error', value: '#ef4444', type: 'color' },
            { name: 'color-info', value: '#0ea5e9', type: 'color' },
            { name: 'radius-base', value: '1', type: 'string' }
        ];

        const existingNames = Object.values(vars).map((v: any) => v.name);
        
        baseVariables.forEach(bv => {
            if (!existingNames.includes(bv.name)) {
                newVars[uuidv4()] = {
                    name: bv.name,
                    value: bv.value,
                    type: bv.type
                };
            }
        });

        if (Object.keys(newVars).length > 0) {
            updateProp("vars")({
                ...vars,
                ...newVars
            });
        }
    };

    return <>

        <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
            <Select
                value={antdAlgorithm || "default"}
                onChange={updateProp("antdAlgorithm")}
                style={{ width: '100%' }}
                options={[
                    { value: "default", label: "Light Theme" },
                    { value: "dark", label: "Dark Theme" },
                    { value: "compact", label: "Compact Theme" },
                ]}
            />
            <Button onClick={addBaseVariables} block>
                Add Standard Base Variables
            </Button>
        </Space>
        <Tabs>
            <Tabs.TabPane key="colors" tab="Colors">
                <Space style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        onClick={addVar("color")}
                    >
                        Add Color
                    </Button>
                    <Select
                        showSearch
                        placeholder="Insert Ant Design Color Token"
                        value={null}
                        onChange={addSeedToken("color", antColorValues)}
                        options={antColorTokens}
                        style={{ width: 250 }}
                    />
                </Space>
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
                <Space style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        onClick={addVar("string")}
                    >
                        Add Variable
                    </Button>
                    <Select
                        showSearch
                        placeholder="Insert Ant Design Seed Token"
                        value={null}
                        onChange={addSeedToken("string", antVariableValues)}
                        options={antVariableTokens}
                        style={{ width: 250 }}
                    />
                </Space>
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
