import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { useLayoutManager } from "@theming/lib/layout/context";
import { findComponent } from "@theming/lib/layout/utils";
import { overridable } from "@core/lib/overridable";
import { Form, Input, Switch } from "antd";
import { useEffect } from "react";
import { ChildrenSelector } from "./ChildrenSelector.component";
import { Label } from "@core/components/Label";
import { Editable } from "@core/components/Editable";

export const PropertyPanel = overridable(() => {
    const { layout, selectedId, updateComponent, selectComponent, removeComponent } = useLayoutManager();
    const [form] = Form.useForm();

    const selectedComponent = layout && selectedId ? findComponent(layout, selectedId) : null;
    const componentDef = selectedComponent ? ComponentRegistry.get(selectedComponent.component) : null;

    useEffect(() => {
        if (selectedComponent) {
            form.setFieldsValue(selectedComponent.props || {});
        } else {
            form.resetFields();
        }
    }, [selectedComponent, form]);

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

    const handleValuesChange = (_: any, allValues: any) => {
        if (selectedId && selectedComponent) {
            updateComponent(selectedId, { props: { ...selectedComponent.props, ...allValues } });
        }
    };

    if(componentDef.propEditor) {
        return <div style={{ padding: '10px' }}>
            <h3>{componentDef.displayName || componentDef.name} Properties</h3>
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
        </div>;
    }

    return <div style={{ padding: '10px' }}>
        <h3>{componentDef.displayName || componentDef.name} Properties</h3>
        <Label label="Class">
            <Editable value={selectedComponent.props?.className} onChange={updateClassName} />
        </Label>
        <h4 style={{marginBottom: 0}}>Additional CSS Styling</h4>
        <Editable textArea value={selectedComponent.css || ""} captureTab onChange={updateCss} />
        <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
        >
            {componentDef.props && Object.entries(componentDef.props).map(([propName, propDesc]) => {
                let input = <Input />;
                switch (propDesc.type) {
                    case 'text':
                        input = <Input.TextArea />;
                        break;
                    case 'integer':
                    case 'decimal':
                        input = <Input type="number" />;
                        break;
                    case 'boolean':
                        // For boolean, we need to handle valuePropName="checked" in Form.Item
                        // But here we are just defining the input. 
                        // We'll handle it in the return.
                        break;
                    case 'select':
                        // We need options. options is a promise function.
                        // For now, let's just render a Select if we can get options, or just Input.
                        // This is getting complex for a single map.
                        // Let's extract a helper component.
                        break;
                }

                if (propDesc.type === 'boolean') {
                    return <Form.Item key={propName} name={propName} label={propDesc.displayName || propName} help={propDesc.description} valuePropName="checked">
                        <Switch />
                    </Form.Item>;
                }

                return <Form.Item key={propName} name={propName} label={propDesc.displayName || propName} help={propDesc.description}>
                    {input}
                </Form.Item>;
            })}
            {!componentDef.props && <div style={{ color: '#999' }}>No configurable properties</div>}
        </Form>
        <ChildrenSelector 
            selectedComponent={selectedComponent} 
            onSelectChild={selectComponent}
            onDeleteChild={removeComponent}
        />
    </div>;
});

