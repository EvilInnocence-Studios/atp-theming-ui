import { Editable } from "@core/components/Editable";
import { Label } from "@core/components/Label";
import { overridable } from "@core/lib/overridable";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { useLayoutManager } from "@theming/lib/layout/context";
import { findComponent } from "@theming/lib/layout/utils";
import { Collapse } from "antd";
import SVG from 'react-inlinesvg';
import { ChildrenSelector } from "./ChildrenSelector.component";
import styles from "./LayoutManager.module.scss";

export const PropertyPanel = overridable(() => {
    const { layout, selectedId, updateComponent, selectComponent, removeComponent } = useLayoutManager();

    const selectedComponent = layout && selectedId ? findComponent(layout, selectedId) : null;
    const componentDef = selectedComponent ? ComponentRegistry.get(selectedComponent.component) : null;

    if (!selectedComponent || !componentDef) {
        return <div style={{ padding: '20px', color: '#999', textAlign: 'center' }}>
            Select a component to edit its properties
        </div>;
    }

    const updateProp = (key:string) => (value:any) => {
        if(selectedId) {
            updateComponent(selectedId, {props: {...selectedComponent.props, [key]: value}});
        }
    }

    const updateCss = (css:string) => {
        if(selectedId) {
            updateComponent(selectedId, {css});
        }
    }

    const updateClassName = (className:string) => {
        updateProp("className")(className);
    }

    const updateName = (name:string) => {
        if(selectedId) {
            updateComponent(selectedId, {name});
        }
    }

    return <div className={styles.propertyPanel}>
        <h3 className={styles.paletteHeader}>
            {componentDef.icon && <SVG src={componentDef.icon} />}
            <b>{selectedComponent.name || componentDef.displayName || componentDef.name}</b> <em>Properties</em>
        </h3>
        <div className={styles.cssPanel}>
            <Collapse accordion>
                <Collapse.Panel key="css" header="Custom Styling">
                    <Label label="Name">
                        <Editable value={selectedComponent.name || ""} onChange={updateName} />
                    </Label>
                    <Label label="Class">
                        <Editable value={selectedComponent.props?.className} onChange={updateClassName} />
                    </Label>
                    <h4>Custom CSS</h4>
                    <Editable textArea value={selectedComponent.css || ""} captureTab onChange={updateCss} placeholder="Enter CSS here"/>
                </Collapse.Panel>
                <Collapse.Panel key="props" header="Properties">
                    {componentDef.propEditor && <div className={styles.propEditor}>
                        {componentDef.propEditor(selectedComponent.props || {}, (newProps: any) => {
                            if (selectedId) {
                                updateComponent(selectedId, { props: newProps });
                            }
                        }, updateProp)}

                    </div>}
                    {!componentDef.propEditor && <>
                        <br/><br/>
                        <em>No configurable properties</em>
                    </>}
                </Collapse.Panel>
                <Collapse.Panel key="children" header="Children">
                    <ChildrenSelector 
                        selectedComponent={selectedComponent} 
                        onSelectChild={selectComponent}
                        onDeleteChild={removeComponent}
                        onUpdateComponent={(updates) => selectedId && updateComponent(selectedId, updates)}
                    />
                </Collapse.Panel>
            </Collapse>
        </div>
    </div>;
});

