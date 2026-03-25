import { Editable } from "@core/components/Editable";
import { Label } from "@core/components/Label";
import { overridable } from "@core/lib/overridable";
import { useDroppable } from "@dnd-kit/core";
import { faPaintRoller } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelectableItem } from "@theming/components/SlotRenderer/SlotRenderer.component";
import slotStyles from "@theming/components/SlotRenderer/SlotRenderer.module.scss";
import { ComponentRegistry, LayoutRegistry } from "@theming/lib/layout/componentRegistry";
import { getAncestryPath } from "@theming/lib/layout/utils";
import { Col, Row, Select, Switch } from "antd";
import { Breadcrumb } from "./Breadcrumb.component";
import { LayoutManagerProps } from "./LayoutManager.d";
import styles from './LayoutManager.module.scss';
import { PropertyPanel } from "./PropertyPanel";

import { ComponentLibrary } from "./ComponentLibrary.component";
import { JsonLayoutDisplay } from "./JsonLayoutDisplay.component";

// ... imports
import { ConfigProvider } from "antd";
import { useTheme } from "@theming/lib/useTheme";
import { objMap } from "ts-functional";
import { IStyleVar } from "@theming/components/Style/Style.d";
import { ILayoutComponent } from "@theming/lib/layout/layout";
import clsx from "clsx";

// ... existing code ...

export const LayoutManagerComponent = overridable(({
    theme, updater, element, setElement, layout,
    isEditing, showJson, selectedId,
    selectComponent, removeComponent, updateComponent,
    classes = styles, UpdateButtons,
}:LayoutManagerProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'root-layout',
        disabled: !!layout && !!layout.component,
    });

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
                    {layout && layout.component && isEditing?.isset && (
                        <Breadcrumb 
                            path={selectedId ? getAncestryPath(layout, selectedId) : [layout]} 
                            onSelect={selectComponent}
                        />
                    )}
                    {layout && layout.component ? (() => {
                        const Component = ComponentRegistry.get(layout.component)?.component;
                        const __update = (key:string) => (value:any) => {
                            if (layout.id) updateComponent(layout.id, {props: {...layout.props, [key]: value }});
                        };
                        const rootContent = Component ? <Component {...layout.props} slots={layout.slots} __layoutId={layout.id} css={layout.css} __update={__update} __isSelected={selectedId === layout.id} /> : null;
                    
                        if (rootContent) {
                            return (
                                <>
                                    <SelectableItem
                                        id={layout.id!}
                                        selected={selectedId === layout.id}
                                        title={layout.name || layout.component}
                                        onSelect={() => selectComponent(layout.id!)}
                                        onDelete={() => removeComponent(layout.id!)}
                                        classes={slotStyles} // Use SlotRenderer styles for the item
                                        className={clsx(slotStyles.item, "layout-editor-canvas")}
                                    >
                                        {rootContent}
                                    </SelectableItem>
                                    <JsonLayoutDisplay layout={layout} showJson={showJson} />
                                </>
                            );
                        }
                        return null;
                    })() : <div ref={setNodeRef} className={clsx(classes.rootDropTarget, { [classes.active]: isOver })}>
                        Drop a component here to start
                    </div>}
                </ConfigProvider>
            </Col>
            {isEditing?.isset && <Col span={6}>
                <PropertyPanel />
            </Col>}
        </Row>
    </div>;
});
