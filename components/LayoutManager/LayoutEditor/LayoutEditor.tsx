import { useToggle } from "@core/lib/useToggle";
import { CollisionDetection, DndContext, DragOverlay, PointerSensor, pointerWithin, useDndContext, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { ITheme } from "@theming-shared/theme/types";
import { DropIndicatorOverlay } from "@theming/components/SlotRenderer/DropIndicatorOverlay";
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
import { useCallback, useEffect, useState } from "react";
import SVG from 'react-inlinesvg';
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

const findObservableElement = (el: Element): Element | null => {
    if (['STYLE', 'SCRIPT', 'LINK', 'META'].includes(el.tagName)) return null;
    const style = window.getComputedStyle(el);
    if (style.display !== 'contents') return el;
    for (let i = 0; i < el.children.length; i++) {
         const found = findObservableElement(el.children[i]);
         if (found) return found;
    }
    return null;
};

const customMeasure = (element: HTMLElement) => {
    const observable = findObservableElement(element) || element;
    const rect = observable.getBoundingClientRect();
    return {
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right,
        width: rect.width,
        height: rect.height,
    };
};

export const globalMousePos = { x: 0, y: 0 };
export let debugCollisionCount = 0;
export let debugDroppableCount = 0;

if (typeof window !== 'undefined') {
    window.addEventListener('pointermove', (e) => {
        globalMousePos.x = e.clientX;
        globalMousePos.y = e.clientY;
    });
}

const customCollisionDetection: CollisionDetection = (args) => {
    debugDroppableCount = args.droppableContainers.length;
    const pointerCollisions = pointerWithin(args);
    debugCollisionCount = pointerCollisions.length;
    
    if (!pointerCollisions.length) {
        return pointerCollisions;
    }

    const { pointerCoordinates } = args;
    if (!pointerCoordinates) {
        return pointerCollisions;
    }

    const collisions = pointerCollisions.map(c => {
        const depth = c.data?.droppableContainer?.data?.current?.depth || 0;
        const rect = c.data?.droppableContainer?.rect?.current;
        return { ...c, depth, rect };
    });

    collisions.sort((a, b) => b.depth - a.depth);

    for (const collision of collisions) {
        if (!collision.rect) continue;
        const indentedLeft = collision.rect.left + (collision.depth * 16);
        
        if (pointerCoordinates.x >= indentedLeft - 8) {
            return [collision];
        }
    }

    return collisions.length > 0 ? [collisions[0]] : pointerCollisions;
};

const LayoutDragOverlay = () => {
    const { active } = useDndContext();
    if (!active) return null;

    if (active.id.toString().startsWith('palette-')) {
        const component = active.data.current?.component;
        if (!component) return null;
        return (
            <div style={{
                padding: '8px 16px',
                background: '#141414',
                color: '#fff',
                border: '1px solid #434343',
                borderRadius: 6,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 500,
                opacity: 0.9,
                cursor: 'grabbing'
            }}>
                {component.icon && <SVG src={component.icon} style={{ width: 16, height: 16 }} />}
                <span>{component.displayName || component.name}</span>
            </div>
        );
    }
    
    return (
            <div style={{
                padding: '8px 16px',
                background: 'rgba(24, 144, 255, 0.2)',
                border: '1px dashed #1890ff',
                color: '#1890ff',
                borderRadius: 6,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                fontSize: 14,
                fontWeight: 500,
                opacity: 0.9,
                cursor: 'grabbing'
            }}>
                {active.data.current?.title || 'Moving Component'}
            </div>
        );
};

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
                 let targetParentId = over.data.current?.parentId;
                 let targetSlot = over.data.current?.slotName;
                 let targetIndex = over.data.current?.index;

                 if (targetParentId && targetSlot) {
                     if (targetIndex !== undefined) {
                         const overRect = over.rect;
                         if (overRect) {
                             const overCenterY = overRect.top + overRect.height / 2;
                             if (globalMousePos.y > overCenterY) {
                                 targetIndex += 1;
                             }
                         }
                     }
                     handleAddComponent(targetParentId, targetSlot, { component: componentDef.name }, targetIndex);
                 }
            } else {
                 // Moving existing component
                const update = (prev: ILayoutComponent | null) => {
                    if (!prev) return null;
                    const movedId = active.id;
                    const component = findComponent(prev, movedId.toString());
                    if (!component) return prev;

                    // Remove from old location
                    const tempLayout = removeComponent(prev, movedId.toString());
                    if (!tempLayout) return prev;

                    let targetParentId: string | undefined;
                    let targetSlot: string | undefined;
                    let targetIndex: number | undefined;

                    // Dropped on a Slot (empty container)
                    if (over.id.toString().includes(':')) {
                        targetParentId = over.data.current?.parentId;
                        targetSlot = over.data.current?.slotName;
                        targetIndex = 0;
                    } 
                    // Dropped on another Component
                    else {
                        const parentInfo = findParent(tempLayout, over.id.toString());
                        if (parentInfo) {
                            targetParentId = parentInfo.parent.id;
                            targetSlot = parentInfo.slotName;
                            targetIndex = parentInfo.index;

                            const overRect = over.rect;
                            if (overRect) {
                                const overCenterY = overRect.top + overRect.height / 2;
                                if (globalMousePos.y > overCenterY) {
                                    targetIndex += 1;
                                }
                            }
                        }
                    }

                    if (targetParentId && targetSlot) {
                        return addComponent(tempLayout, targetParentId, targetSlot, component, targetIndex);
                    }

                    return prev;
                };
                
                const newLayout = layout && layout.component ? update(layout) : null;
                onChange(newLayout);
            }
        }
    }, [layout, handleAddComponent, onChange]);

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
        <DndContext 
            onDragEnd={handleDragEnd} 
            sensors={sensors} 
            collisionDetection={customCollisionDetection}
            measuring={{
                droppable: {
                    measure: customMeasure
                }
            }}
        >
            {children}
            <DropIndicatorOverlay />
            <DragOverlay dropAnimation={null} zIndex={999999}>
                <LayoutDragOverlay />
            </DragOverlay>
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
                    })() : <div ref={setNodeRef} data-layout-id="root-layout" className={clsx(classes.rootDropTarget, { [classes.active]: isOver })}>
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
