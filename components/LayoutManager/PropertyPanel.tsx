import { Editable } from "@core/components/Editable";
import { Label } from "@core/components/Label";
import { overridable } from "@core/lib/overridable";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { useLayoutManager } from "@theming/lib/layout/context";
import { findComponent } from "@theming/lib/layout/utils";
import { ChildrenSelector } from "./ChildrenSelector.component";

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

    return <div style={{ padding: '10px' }}>
        <h3>{componentDef.displayName || componentDef.name} Properties</h3>
        <Label label="Class">
            <Editable value={selectedComponent.props?.className} onChange={updateClassName} />
        </Label>
        <h4 style={{marginBottom: 0}}>Additional CSS Styling</h4>
        <Editable textArea value={selectedComponent.css || ""} captureTab onChange={updateCss} />
        {componentDef.propEditor && <div style={{ padding: '10px' }}>
            {componentDef.propEditor(selectedComponent.props || {}, (newProps: any) => {
                if (selectedId) {
                    updateComponent(selectedId, { props: newProps });
                }
            })}
            <ChildrenSelector 
                selectedComponent={selectedComponent} 
                onSelectChild={selectComponent}
                onDeleteChild={removeComponent}
            />
        </div>}
        {!componentDef.propEditor && <>
            <em>No configurable properties</em>
        </>}
        <ChildrenSelector 
            selectedComponent={selectedComponent} 
            onSelectChild={selectComponent}
            onDeleteChild={removeComponent}
        />
    </div>;
});

