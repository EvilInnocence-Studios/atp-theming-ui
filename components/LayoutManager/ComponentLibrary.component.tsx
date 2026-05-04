import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { Collapse, Tabs, Select, Button } from "antd";
import SVG from 'react-inlinesvg';
import styles from './LayoutEditor/LayoutEditor.module.scss';
import { overridable } from "@core/lib/overridable";
import { useEffect, useState } from "react";

const DraggablePaletteItem = ({ component, classes }: { component: any, classes: any }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `palette-${component.name}`,
        data: { component }
    });

    return (
        <Button ref={setNodeRef} style={{ opacity: isDragging ? 0.3 : 1 }} {...listeners} {...attributes} className={classes.component}>
            {component.icon && <SVG src={component.icon} />}
            <span>{component.displayName}</span>
        </Button>
    );
};

const DraggableSelectOption = ({ component, classes, onDragStateChange }: { component: any, classes: any, onDragStateChange: (isDragging: boolean) => void }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `palette-select-${component.name}`,
        data: { component }
    });
    
    useEffect(() => {
        onDragStateChange(isDragging);
    }, [isDragging]);

    return (
        <div className={classes.componentList}>
            <div ref={setNodeRef} style={{ flex: '1 1 100%', maxWidth: '100%', margin: 0, opacity: isDragging ? 0.3 : 1 }} {...listeners} {...attributes} className={classes.component}>
                {component.icon && <SVG src={component.icon} style={{ width: 16, height: 16 }} />}
                <span>{component.displayName || component.name}</span>
            </div>
        </div>
    );
};

export interface ComponentLibraryProps {
    classes?: any;
}

export const ComponentLibraryComponent = overridable(({ classes = styles }: ComponentLibraryProps) => {
    const [selectOpen, setSelectOpen] = useState(false);
    const [isDraggingAny, setIsDraggingAny] = useState(false);
    
    // Group components by Category -> SubCategory
    const components = Object.values(ComponentRegistry.getAll());
    const categoriesMap = new Map<string, Map<string, any[]>>();

    components.forEach(cmp => {
        const category = cmp.category || "Misc";
        const subCategory = cmp.subCategory || "Misc";
        
        if (!categoriesMap.has(category)) {
            categoriesMap.set(category, new Map());
        }
        const catMap = categoriesMap.get(category)!;
        if (!catMap.has(subCategory)) {
            catMap.set(subCategory, []);
        }
        catMap.get(subCategory)!.push(cmp);
    });

    return (
        <div className={classes.componentLibrary}>
            <Select
                showSearch
                placeholder="Search components..."
                allowClear
                open={selectOpen}
                onDropdownVisibleChange={(open) => {
                    if (!isDraggingAny) setSelectOpen(open);
                }}
                onSelect={() => {
                    if (!isDraggingAny) setSelectOpen(false);
                }}
                style={{ width: '100%', marginBottom: 16 }}
                popupClassName={classes.layoutEditor}
                filterOption={(input, option) => {
                    const item = option?.data;
                    if (!item) return false;
                    const searchInput = input.toLowerCase();
                    return (item.displayName || item.name).toLowerCase().includes(searchInput) || 
                           (item.description || '').toLowerCase().includes(searchInput);
                }}
                options={[...components].sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name)).map(comp => ({
                    value: comp.name,
                    label: <DraggableSelectOption 
                        key={`select-${comp.name}`} 
                        component={comp} 
                        classes={classes} 
                        onDragStateChange={(isDrag) => {
                            if (isDrag) {
                                setIsDraggingAny(true);
                            } else {
                                setTimeout(() => setIsDraggingAny(false), 50);
                            }
                        }}
                    />,
                    data: comp,
                }))}
            />
            <Tabs 
                type="card"
                className={classes.wrappedTabs}
                items={Array.from(categoriesMap.entries())
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([catName, subCats]) => ({
                        key: catName,
                        label: catName,
                        children: (
                            <Collapse accordion size="small" defaultActiveKey={['Misc']}>
                                {Array.from(subCats.entries())
                                    .sort((a, b) => a[0].localeCompare(b[0]))
                                    .map(([subCatName, comps]) => (
                                    <Collapse.Panel header={subCatName} key={subCatName}>
                                        <div className={classes.componentList}>
                                            {[...comps].sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name)).map((component) => (
                                                <DraggablePaletteItem key={component.name} component={component} classes={classes} />
                                            ))}
                                        </div>
                                    </Collapse.Panel>
                                ))}
                            </Collapse>
                        )
                }))}
            />
        </div>
    );
});

export const ComponentLibrary = ComponentLibraryComponent;
