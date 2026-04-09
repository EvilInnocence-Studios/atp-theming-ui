import { ITheme } from "@common-shared/theme/types";
import { useToggle } from "@core/lib/useToggle";
import { DndContext, PointerSensor, pointerWithin, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { SelectableItem } from "@theming/components/SlotRenderer/SlotRenderer.component";
import slotStyles from "@theming/components/SlotRenderer/SlotRenderer.module.scss";
import { IStyleVar } from "@theming/components/Style/Style.d";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { LayoutEditorContext, useLayoutEditor } from "@theming/lib/layout/context";
import { ILayoutComponent } from "@theming/lib/layout/layout";
import { addComponent, ensureIds, findComponent, findParent, getAncestryPath, removeComponent, updateComponent } from "@theming/lib/layout/utils";
import { useTheme } from "@theming/lib/useTheme";
import { Col, ConfigProvider, Row, Switch } from "antd";
import clsx from "clsx";
import { useCallback, useState, useEffect } from "react";
import { objMap } from "ts-functional";
import { Breadcrumb } from "../Breadcrumb.component";
import { ComponentLibrary } from "../ComponentLibrary.component";
import { JsonLayoutDisplay } from "../JsonLayoutDisplay.component";
import { PropertyPanel } from "../PropertyPanel";
import defaultClasses from './LayoutEditor.module.scss';

export declare interface ILayoutEditorProviderProps {
    children: React.ReactNode;
    layout: ILayoutComponent | null;
    onChange: (layout: ILayoutComponent | null) => void;
}

export const LayoutEditorProvider = ({
    children, layout,
    onChange,
}: ILayoutEditorProviderProps) => {
    const isEditing = useToggle(true);
    const showJson = useToggle(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleAddComponent = useCallback((parentId: string, slotName: string, component: ILayoutComponent, index?: number) => {
        console.log('Adding component', {layout, parentId, slotName, component, index });
        const componentWithId = ensureIds(component);
        const newLayout = layout && layout.component ? addComponent(layout, parentId, slotName, componentWithId, index) : null;
        console.log('New layout', newLayout);
        onChange(newLayout);
        if (componentWithId.id) setSelectedId(componentWithId.id);
    }, [layout]);

    const handleRemoveComponent = useCallback((id: string) => {
        const newLayout = layout && layout.component ? removeComponent(layout, id) : null;
        onChange(newLayout);
        if (selectedId === id) setSelectedId(null);
    }, [layout, selectedId]);

    const handleUpdateComponent = useCallback((id: string, updates: Partial<ILayoutComponent>) => {
        const newLayout = layout && layout.component ? updateComponent(layout, id, updates) : null;
        onChange(newLayout);
    }, [layout]);

    const handleDragEnd = useCallback((event: any) => {
        const { active, over } = event;
        console.log("Drag end event safe", { 
            activeId: active?.id, 
            overId: over?.id, 
            activeData: active?.data?.current,
            overData: over?.data?.current 
        });

        if (!over) {
            console.log("Drag end: No over target");
            return;
        }

        if (over.id === 'root-layout') {
            console.log("Adding root component", active.data.current?.component);
            const componentDef = active.data.current?.component;
            if (componentDef) {
                const newLayout = ensureIds({ component: componentDef.name });                
                onChange(newLayout);
                if (newLayout.id) setSelectedId(newLayout.id);
            }
            return;
        }

        if (active.id !== over.id) {
            // If dropping palette item into a slot
            if (active.id.toString().startsWith('palette-')) {
                 const componentDef = active.data.current?.component;
                 const { parentId, slotName, index } = over.data.current || {};
                 if (componentDef && parentId && slotName) {
                     handleAddComponent(parentId, slotName, { component: componentDef.name }, index);
                 }
            } else {
                 // Moving existing component
                const update = (prev: ILayoutComponent | null) => {
                    if (!prev) return null;
                    const movedId = active.id;
                    const component = findComponent(prev, movedId);
                    if (!component) return prev;

                    const sourceInfo = findParent(prev, movedId);

                    // Remove from old location
                    const tempLayout = removeComponent(prev, movedId);
                    if (!tempLayout) return prev;

                    let targetParentId: string | undefined;
                    let targetSlot: string | undefined;
                    let targetIndex: number | undefined;

                    // Case 1: Dropped on a Slot (container)
                    if (over.data.current && over.data.current.parentId && over.data.current.slotName) {
                        targetParentId = over.data.current.parentId;
                        targetSlot = over.data.current.slotName;
                        targetIndex = over.data.current.index;

                        if (
                            sourceInfo &&
                            targetIndex !== undefined &&
                            sourceInfo.parent.id === targetParentId &&
                            sourceInfo.slotName === targetSlot &&
                            sourceInfo.index < targetIndex
                        ) {
                            targetIndex -= 1;
                        }
                    } 
                    // Case 2: Dropped on another Component
                    else {
                        // We need to find the parent of the 'over' item in the NEW layout (after removal)
                        // to get the correct index.
                        const parentInfo = findParent(tempLayout, over.id);
                        if (parentInfo) {
                            targetParentId = parentInfo.parent.id;
                            targetSlot = parentInfo.slotName;
                            targetIndex = parentInfo.index;
                        }
                    }

                    if (targetParentId && targetSlot) {
                        return addComponent(tempLayout, targetParentId, targetSlot, component, targetIndex);
                    }

                    return prev; // Fallback if target not found
                };
                
                const newLayout = layout && layout.component ? update(layout) : null;
                onChange(newLayout);
            }
        }
    }, [layout, handleAddComponent]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    return <LayoutEditorContext.Provider value={{
        layout,
        isEditing,
        showJson,
        selectedId,
        selectComponent: (id: string | null) => {
            console.log('Selecting component', id);
            setSelectedId(id)
        },
        addComponent: handleAddComponent,
        removeComponent: handleRemoveComponent,
        updateComponent: handleUpdateComponent,
    }}>
        <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={pointerWithin}>
            {children}
        </DndContext>
    </LayoutEditorContext.Provider>

}

export const LayoutEditor = ({ theme, classes = defaultClasses }: { theme: ITheme | null, classes?: any }) => {
    const { layout, isEditing, showJson, selectedId, selectComponent, removeComponent, updateComponent } = useLayoutEditor();
    
    const { setNodeRef, isOver } = useDroppable({
        id: 'root-layout',
        disabled: !!layout && !!layout.component,
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                isEditing?.toggle();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isEditing]);

    const styleLayout = theme && theme.json ? Object.values(theme.json).find((c:any) => c?.component === "Style") as ILayoutComponent : null;
    const styleVars = styleLayout?.props?.vars;
    const styleCss = styleLayout?.props?.css;
    const antTheme = useTheme(styleVars || {});

    return (
        <div className={classes.layoutEditor}>
            <Row gutter={[16,16]}>
            {isEditing?.isset && <Col span={5}>
                <ComponentLibrary classes={classes} />
            </Col>}
            <Col 
                span={isEditing?.isset ? 13 : 24} 
                style={{ position: 'relative' }} 
                id="layout-editor-canvas"
                onClickCapture={(e) => {
                    if (isEditing?.isset && (e.target as HTMLElement).closest('a')) {
                        e.preventDefault();
                    }
                }}
            >
                <div className={classes.header}>
                    <Switch checked={isEditing?.isset} onChange={isEditing?.toggle} checkedChildren="Edit" unCheckedChildren="Preview"/>
                    <span style={{ marginLeft: 8, fontSize: '0.8em', color: '#888' }}>(Ctrl+E)</span>
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
        </div>
    );
};
