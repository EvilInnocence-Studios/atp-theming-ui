import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { ILayoutComponent } from "@theming/lib/layout/layout";
import { addComponent, ensureIds, removeComponent, updateComponent, findComponent, findParent } from "@theming/lib/layout/utils";
import { overridable } from "@core/lib/overridable";
import { useCallback, useState } from "react";
import { createInjector, inject, mergeProps } from "unstateless";
import { LayoutManagerComponent } from "./LayoutManager.component";
import { ILayoutManagerInputProps, ILayoutManagerProps, LayoutManagerProps } from "./LayoutManager.d";
import { LayoutManagerContext, useLayoutManager } from "@theming/lib/layout/context";
import { ITheme } from "@common-shared/theme/types";
import { services } from "@core/lib/api";
import { useUpdater } from "@core/lib/useUpdater";
import { useToggle } from "@core/lib/useToggle";

export const LayoutManagerProvider = ({ children, themeId }: { children: React.ReactNode, themeId: string }) => {
    const updater = useUpdater<ITheme>(
        "theme",
        themeId,
        {id: themeId, json: null, name: "", description: "", imageUrl: null, enabled:false},
        services().theme.get,
        services().theme.update,
        "manual",
    );
    const isEditing = useToggle(true);

    const layout:ILayoutComponent | null = updater.history.entity.json?.layout
        ? ensureIds(updater.history.entity.json?.layout)
        : null;

    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleAddComponent = useCallback((parentId: string, slotName: string, component: ILayoutComponent, index?: number) => {
        console.log('Adding component', {layout, parentId, slotName, component, index });
        const newLayout = layout && layout.component ? addComponent(layout, parentId, slotName, ensureIds(component), index) : null;
        console.log('New layout', newLayout);
        updater.updateObject("json")({layout: newLayout});
    }, [layout]);

    const handleRemoveComponent = useCallback((id: string) => {
        const newLayout = layout && layout.component ? removeComponent(layout, id) : null;
        updater.updateObject("json")({layout: newLayout});
        if (selectedId === id) setSelectedId(null);
    }, [layout, selectedId]);

    const handleUpdateComponent = useCallback((id: string, updates: Partial<ILayoutComponent>) => {
        const newLayout = layout && layout.component ? updateComponent(layout, id, updates) : null;
        updater.updateObject("json")({layout: newLayout});
    }, [layout]);

    const handleDragEnd = useCallback((event: any) => {
        console.log("Drag end layout", layout);
        console.log("Drag end event", event);
        const { active, over } = event;
        if (!over) return;

        if (over.id === 'root-layout') {
            console.log("Adding root component", active.data.current?.component);
            const componentDef = active.data.current?.component;
            if (componentDef) {
                const newLayout = ensureIds({ component: componentDef.name });
                updater.updateObject("json")({layout: newLayout});
            }
            return;
        }

        if (active.id !== over.id) {
            // If dropping palette item into a slot
            if (active.id.toString().startsWith('palette-')) {
                 const componentDef = active.data.current?.component;
                 const { parentId, slotName } = over.data.current || {};
                 if (componentDef && parentId && slotName) {
                     handleAddComponent(parentId, slotName, { component: componentDef.name });
                 }
            } else {
                // Moving existing component
                const update = (prev: ILayoutComponent | null) => {
                    if (!prev) return null;
                    const movedId = active.id;
                    const component = findComponent(prev, movedId);
                    if (!component) return prev;

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
                        // Append to end
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
                updater.updateObject("json")({layout: newLayout});
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

    return <LayoutManagerContext.Provider value={{
        layout,
        isEditing,
        selectedId,
        selectComponent: (id: string | null) => {
            console.log('Selecting component', id);
            setSelectedId(id)
        },
        addComponent: handleAddComponent,
        removeComponent: handleRemoveComponent,
        updateComponent: handleUpdateComponent,
        UpdateButtons: () => <updater.UpdateButtons />,
    }}>
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            {children}
        </DndContext>
    </LayoutManagerContext.Provider>;
};

const injectLayoutManagerProps = createInjector(({ }: ILayoutManagerInputProps): ILayoutManagerProps => {
    const { layout, isEditing, selectedId, selectComponent, addComponent, removeComponent, updateComponent, UpdateButtons } = useLayoutManager();

    return {
        layout,
        isEditing,
        selectedId,
        selectComponent,
        addComponent,
        removeComponent,
        updateComponent,
        UpdateButtons,
    };
});

const connect = inject<ILayoutManagerInputProps, LayoutManagerProps>(mergeProps(
    injectLayoutManagerProps,
));

const ConnectedLayoutManager = connect(LayoutManagerComponent);

export const LayoutManager = overridable<LayoutManagerProps>((props) => 
    <LayoutManagerProvider themeId={props.themeId}>
        <ConnectedLayoutManager {...props} />
    </LayoutManagerProvider>
);
