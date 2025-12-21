import { Col as AntDCol, Row as AntDRow, Input, Collapse, Checkbox, Select, Switch } from "antd";
import React from "react";
import { ComponentRegistry, containerLayoutComponent } from "./layout/componentRegistry";
import { Label } from "@core/components/Label";

const Col = containerLayoutComponent(AntDCol);
const Row = containerLayoutComponent(AntDRow);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const standardTags = [
    "div", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "a", "button", "form", "label", "section", "header", "footer", "nav", "article", "aside", "main", "table", "tr", "td", "th", "thead", "tbody"
];

const voidTags = [
    "img", "input", "br", "hr"
];

standardTags.forEach(tag => {
    const Wrapper = React.forwardRef(({css, ...props}: React.HTMLAttributes<HTMLElement> & {css?: string}, ref) => <>
        {!!css && <style>{css}</style>}
        {React.createElement(tag, { ...props, ref } as any)}
    </>);
    const Component = containerLayoutComponent(Wrapper);
    ComponentRegistry.register(capitalize(tag), Component, { category: "HTML Elements", displayName: capitalize(tag), isContainer: true });
});

voidTags.forEach(tag => {
    const Wrapper = React.forwardRef((props: React.HTMLAttributes<HTMLElement>, ref) => {
        const { children, ...rest } = props as any;
        return (
            <>
                {React.createElement(tag, { ...rest, ref })}
                {children}
            </>
        );
    });
    const Component = containerLayoutComponent(Wrapper);
    ComponentRegistry.register(capitalize(tag), Component, { category: "HTML Elements", displayName: capitalize(tag) });
});

const ColPropEditor = ({ props, updateProps }: { props: any, updateProps: (p: any) => void }) => {
    const renderNumberProp = (label: string, propKey: string) => (
        <Label label={label}>
            <Input type="number" value={props[propKey]} onChange={e => updateProps({ ...props, [propKey]: parseInt(e.target.value) || undefined })} />
        </Label>
    );

    const renderResponsiveProp = (size: string) => {
        const value = props[size];
        const isObject = typeof value === 'object' && value !== null;
        
        return (
            <Collapse.Panel header={size.toUpperCase()} key={size}>
                <div style={{ marginBottom: 8 }}>
                    <Checkbox checked={isObject} onChange={(e) => {
                        if (e.target.checked) {
                            updateProps({ ...props, [size]: { span: typeof value === 'number' ? value : 0 } });
                        } else {
                            updateProps({ ...props, [size]: (value && value.span) || 0 });
                        }
                    }}>Advanced Configuration</Checkbox>
                </div>
                {isObject ? (
                    <>
                        <Label label="Span">
                            <Input type="number" value={value.span} onChange={e => updateProps({ ...props, [size]: { ...value, span: parseInt(e.target.value) } })} />
                        </Label>
                        <Label label="Offset">
                            <Input type="number" value={value.offset} onChange={e => updateProps({ ...props, [size]: { ...value, offset: parseInt(e.target.value) } })} />
                        </Label>
                        <Label label="Order">
                            <Input type="number" value={value.order} onChange={e => updateProps({ ...props, [size]: { ...value, order: parseInt(e.target.value) } })} />
                        </Label>
                        <Label label="Pull">
                            <Input type="number" value={value.pull} onChange={e => updateProps({ ...props, [size]: { ...value, pull: parseInt(e.target.value) } })} />
                        </Label>
                        <Label label="Push">
                            <Input type="number" value={value.push} onChange={e => updateProps({ ...props, [size]: { ...value, push: parseInt(e.target.value) } })} />
                        </Label>
                    </>
                ) : (
                    <Label label="Span">
                        <Input type="number" value={value} onChange={e => updateProps({ ...props, [size]: parseInt(e.target.value) })} />
                    </Label>
                )}
            </Collapse.Panel>
        );
    };

    return (
        <>
            {renderNumberProp("Span", "span")}
            {renderNumberProp("Offset", "offset")}
            {renderNumberProp("Order", "order")}
            {renderNumberProp("Pull", "pull")}
            {renderNumberProp("Push", "push")}
            
            <Collapse ghost>
                {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(size => renderResponsiveProp(size))}
            </Collapse>
        </>
    );
};

const RowPropEditor = ({ props, updateProps }: { props: any, updateProps: (p: any) => void }) => {
    const renderResponsiveSelect = (label: string, propKey: string, options: { value: string, label: string }[]) => {
        const renderSelect = (value: any, onChange: (val: any) => void) => (
            <Select value={value} onChange={onChange} style={{ width: '100%' }}>
                {options.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
            </Select>
        );

        const renderResponsiveProp = (size: string) => {
            const value = props[propKey];
            const isObject = typeof value === 'object' && value !== null;
            const sizeValue = isObject ? value[size] : undefined;

            return (
                <Collapse.Panel header={size.toUpperCase()} key={size}>
                    <div style={{ marginBottom: 8 }}>
                        <Checkbox checked={!!sizeValue} onChange={(e) => {
                            if (e.target.checked) {
                                const newValue = isObject ? { ...value, [size]: options[0].value } : { [size]: options[0].value };
                                // If converting from simple string to object, we might want to preserve the base value as 'xs' or similar, 
                                // but typically 'align="middle"' applies to all. 
                                // AntD Row align/justify can be string OR object.
                                // If it was a string, we should probably make it the base (or xs) value?
                                // For simplicity, let's just start with the object.
                                if (!isObject && typeof value === 'string') {
                                    // If it was a string, keep it as base? AntD doesn't support "base" in object, it uses breakpoints.
                                    // So if we switch to object, we lose the "all" setting unless we set it for all?
                                    // Let's just init with the first option.
                                }
                                updateProps({ ...props, [propKey]: newValue });
                            } else {
                                const newValue = { ...value };
                                delete newValue[size];
                                if (Object.keys(newValue).length === 0) {
                                    updateProps({ ...props, [propKey]: undefined });
                                } else {
                                    updateProps({ ...props, [propKey]: newValue });
                                }
                            }
                        }}>Enable {size}</Checkbox>
                    </div>
                    {!!sizeValue && (
                        <Label label={label}>
                            {renderSelect(sizeValue, (val) => updateProps({ ...props, [propKey]: { ...value, [size]: val } }))}
                        </Label>
                    )}
                </Collapse.Panel>
            );
        };

        // Main simple select
        const simpleValue = typeof props[propKey] === 'string' ? props[propKey] : undefined;
        const isObject = typeof props[propKey] === 'object' && props[propKey] !== null;

        return <>
            <Label label={label}>
                <div style={{ marginBottom: 8 }}>
                    <Checkbox checked={isObject} onChange={(e) => {
                        if (e.target.checked) {
                            updateProps({ ...props, [propKey]: {} });
                        } else {
                            updateProps({ ...props, [propKey]: undefined }); // Reset to undefined or simple?
                        }
                    }}>Responsive Configuration</Checkbox>
                </div>
                {!isObject && renderSelect(simpleValue, (val) => updateProps({ ...props, [propKey]: val }))}
            </Label>
            {isObject && (
                <Collapse ghost>
                    {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(size => renderResponsiveProp(size))}
                </Collapse>
            )}
        </>;
    };

    const alignOptions = [
        { value: 'top', label: 'Top' },
        { value: 'middle', label: 'Middle' },
        { value: 'bottom', label: 'Bottom' },
        { value: 'stretch', label: 'Stretch' }
    ];

    const justifyOptions = [
        { value: 'start', label: 'Start' },
        { value: 'end', label: 'End' },
        { value: 'center', label: 'Center' },
        { value: 'space-around', label: 'Space Around' },
        { value: 'space-between', label: 'Space Between' },
        { value: 'space-evenly', label: 'Space Evenly' }
    ];

    return <>
        <Label label="Gutter">
            <Input type="number" value={props.gutter} onChange={e => updateProps({ ...props, gutter: parseInt(e.target.value) || undefined })} />
        </Label>
        
        {renderResponsiveSelect("Align", "align", alignOptions)}
        {renderResponsiveSelect("Justify", "justify", justifyOptions)}

        <Label label="Wrap">
            <Switch checked={props.wrap !== false} onChange={checked => updateProps({ ...props, wrap: checked })} />
        </Label>
    </>;
};

ComponentRegistry.register("Col", Col, {
    category: "Layouts",
    displayName: "Col",
    isContainer: true,
    propEditor: (props: any, updateProps: (props: any) => void) => <ColPropEditor props={props} updateProps={updateProps} />
});
ComponentRegistry.register("Row", Row, { 
    category: "Layouts", 
    displayName: "Row",
    isContainer: true,
    propEditor: (props: any, updateProps: (props: any) => void) => <RowPropEditor props={props} updateProps={updateProps} />
});
