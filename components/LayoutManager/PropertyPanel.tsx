import { Editable } from "@core/components/Editable";
import { Label } from "@core/components/Label";
import { overridable } from "@core/lib/overridable";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { useLayoutManager } from "@theming/lib/layout/context";
import { findComponent } from "@theming/lib/layout/utils";
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
        <h3>{componentDef.icon && <SVG src={componentDef.icon} />} {componentDef.displayName || componentDef.name} Properties</h3>
        <Label label="Name">
            <Editable value={selectedComponent.name || ""} onChange={updateName} />
        </Label>
        <Label label="Class">
            <Editable value={selectedComponent.props?.className} onChange={updateClassName} />
        </Label>
        <h4 style={{marginBottom: 0}}>Additional CSS Styling</h4>
        <Editable textArea value={selectedComponent.css || ""} captureTab onChange={updateCss} placeholder="Enter CSS here"/>
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
        <ChildrenSelector 
            selectedComponent={selectedComponent} 
            onSelectChild={selectComponent}
            onDeleteChild={removeComponent}
            onUpdateComponent={(updates) => selectedId && updateComponent(selectedId, updates)}
        />
    </div>;
});

