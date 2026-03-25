import { Editable } from "@core/components/Editable";
import { Label } from "@core/components/Label";
import { overridable } from "@core/lib/overridable";
import { faPaintRoller } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LayoutRegistry } from "@theming/lib/layout/componentRegistry";
import { Col, Row, Select, Switch } from "antd";
import { LayoutManagerProps } from "./LayoutManager.d";
import styles from './LayoutManager.module.scss';
import { PropertyPanel } from "./PropertyPanel";

import { ComponentLibrary } from "./ComponentLibrary.component";
import { LayoutEditor } from "./LayoutEditor.component";

// ... imports
import { ConfigProvider } from "antd";
import { useTheme } from "@theming/lib/useTheme";
import { objMap } from "ts-functional";
import { IStyleVar } from "@theming/components/Style/Style.d";
import { ILayoutComponent } from "@theming/lib/layout/layout";

// ... existing code ...

export const LayoutManagerComponent = overridable(({
    theme, updater, element, setElement, layout,
    isEditing, showJson, selectedId,
    selectComponent, removeComponent, updateComponent,
    classes = styles, UpdateButtons,
}:LayoutManagerProps) => {
    // Find the Style layout to get global vars
    const styleLayout = theme && theme.json ? Object.values(theme.json).find((c:any) => c.component === "Style") as ILayoutComponent : null;
    const styleVars = styleLayout?.props?.vars;
    const styleCss = styleLayout?.props?.css;
    const antTheme = useTheme(styleVars || {});

    return <div className={classes.layoutManager}>
        <Row gutter={[16,16]}>
            <Col span={4}>
                <h1>
                    <FontAwesomeIcon icon={faPaintRoller} /> Theme Designer
                </h1>
            </Col>
            <Col span={6}>
                <Select className={classes.layoutElementSelect} options={LayoutRegistry.getOptions()} value={element} onChange={setElement} />
            </Col>
            <Col span={8}>
                {theme && updater && <Label label="Theme Name"><Editable value={theme.name || ""} onChange={updater.updateString("name")} /></Label>}
            </Col>
            <Col span={6}>
            </Col>
        </Row>
        <hr />
        <Row gutter={[16,16]}>
            {isEditing?.isset && <Col span={4}>
                <ComponentLibrary classes={classes} />
            </Col>}
            <Col span={isEditing?.isset ? 14 : 24} style={{ position: 'relative' }} id="layout-editor-canvas">
                <div className={classes.header}>
                    <Switch checked={isEditing?.isset} onChange={isEditing?.toggle} checkedChildren="Edit" unCheckedChildren="Preview"/>
                    &nbsp;&nbsp;
                    <UpdateButtons />
                </div>
                <ConfigProvider theme={antTheme}>
                    {styleCss && <style>{styleCss}</style>}
                    <style>
                        {`.layout-editor-canvas {
                            ${Object.values(objMap<IStyleVar, string>(v => `--${v.name}: ${v.value};`)(styleVars || {})).join("\n")}
                        }`}
                    </style>
                    <LayoutEditor
                        layout={layout}
                        isEditing={isEditing}
                        showJson={showJson}
                        selectedId={selectedId}
                        selectComponent={selectComponent}
                        removeComponent={removeComponent}
                        updateComponent={updateComponent}
                        classes={classes}
                    />
                </ConfigProvider>
            </Col>
            {isEditing?.isset && <Col span={6}>
                <PropertyPanel />
            </Col>}
        </Row>
    </div>;
});
