import { Editable } from "@core/components/Editable";
import { Label } from "@core/components/Label";
import { overridable } from "@core/lib/overridable";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { faPaintRoller } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelectableItem } from "@theming/components/SlotRenderer/SlotRenderer.component";
import slotStyles from "@theming/components/SlotRenderer/SlotRenderer.module.scss";
import { ComponentRegistry, LayoutRegistry } from "@theming/lib/layout/componentRegistry";
import { getAncestryPath } from "@theming/lib/layout/utils";
import { Col, Collapse, Row, Select, Switch } from "antd";
import SVG from 'react-inlinesvg';
import { Breadcrumb } from "./Breadcrumb.component";
import { LayoutManagerProps } from "./LayoutManager.d";
import styles from './LayoutManager.module.scss';
import { PropertyPanel } from "./PropertyPanel";

const DraggablePaletteItem = ({ component, classes }: { component: any, classes: any }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `palette-${component.name}`,
        data: { component }
    });
    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={classes.component}>
            {component.icon && <SVG src={component.icon} />}
            {component.displayName}
        </div>
    );
};

export const LayoutManagerComponent = overridable(({theme, updater, element, setElement, layout, isEditing, showJson, selectedId, selectComponent, removeComponent, classes = styles, UpdateButtons}:LayoutManagerProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'root-layout',
        disabled: !!layout && !!layout.component,
    });

    return <div className={classes.layoutManager}>
        <Row gutter={[16,16]}>
            <Col span={6}>
                <h1>
                    <FontAwesomeIcon icon={faPaintRoller} /> Theme Designer
                </h1>
            </Col>
            <Col span={12}>
                {theme && updater && <Label label="Theme Name"><Editable value={theme.name || ""} onChange={updater.updateString("name")} /></Label>}
            </Col>
            <Col span={6}>
                <div className={classes.header}>
                    <Switch checked={isEditing?.isset} onChange={isEditing?.toggle} checkedChildren="Edit" unCheckedChildren="Preview"/>
                    &nbsp;&nbsp;
                    <UpdateButtons />
                </div>
            </Col>
        </Row>
        <hr />
        <Row gutter={[16,16]}>
            {isEditing?.isset && <Col span={4}>
                <Select className={classes.layoutElementSelect} options={LayoutRegistry.getOptions()} value={element} onChange={setElement} />
                <hr />
                <Collapse>
                    {Array.from(ComponentRegistry.getCategories()).map((category) =>
                        <Collapse.Panel header={category} key={category}>
                            <div className={classes.componentList}>
                                {ComponentRegistry.byCategory(category).map((component) => <DraggablePaletteItem key={component.name} component={component} classes={classes} />)}
                            </div>
                        </Collapse.Panel>
                    )}
                </Collapse>
            </Col>}
            <Col span={isEditing?.isset ? 14 : 24} id="layout-editor-canvas" style={{ position: 'relative' }}>
                {layout && layout.component && isEditing?.isset && (
                    <Breadcrumb 
                        path={selectedId ? getAncestryPath(layout, selectedId) : [layout]} 
                        onSelect={selectComponent}
                    />
                )}
                {layout && layout.component ? (() => {
                    const Component = ComponentRegistry.get(layout.component)?.component;
                    const rootContent = Component ? <Component {...layout.props} slots={layout.slots} __layoutId={layout.id} /> : null;
                    
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
                                    className={slotStyles.item}
                                >
                                    {rootContent}
                                </SelectableItem>
                                <h3>Layout JSON</h3>
                                <Switch checked={showJson?.isset} onChange={showJson?.toggle} checkedChildren="Show" unCheckedChildren="Hide"/>
                                {showJson?.isset && <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                    <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'hidden' }}>
                                        {JSON.stringify(layout, null, 2)}
                                    </pre>
                                </div>}
                            </>
                        );
                    }
                    return null;
                })() : <div ref={setNodeRef} className={classes.rootDropTarget} style={{
                    border: '2px dashed #ccc',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: isOver ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    Drop a component here to start
                </div>}
            </Col>
            {isEditing?.isset && <Col span={6}>
                <PropertyPanel />
            </Col>}
        </Row>
    </div>;
});
