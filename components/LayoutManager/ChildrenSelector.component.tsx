import { DeleteBtn } from "@core/components/DeleteBtn";
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { ILayoutComponent } from "@theming/lib/layout/layout";
import SVG from 'react-inlinesvg';
import styles from './LayoutManager.module.scss';

interface ChildrenSelectorProps {
    selectedComponent: ILayoutComponent;
    onSelectChild: (id: string) => void;
    onDeleteChild: (id: string) => void;
    onUpdateComponent: (updates: Partial<ILayoutComponent>) => void;
}

const SortableChildItem = ({ component, onSelectChild, onDeleteChild }: { component: ILayoutComponent, onSelectChild: (id: string) => void, onDeleteChild: (id: string) => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: component.id! });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: 'relative' as const,
        opacity: isDragging ? 0.5 : 1,
    };

    const componentDef = ComponentRegistry.get(component.component);
    const displayName = component.name || componentDef?.displayName || component.component;

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={styles.childItem}>
            <button
                className={styles.childButton}
                onClick={() => component.id && onSelectChild(component.id)}
                title={`Select ${displayName}`}
                // Prevent drag from starting when clicking button if needed, but usually we want drag on the whole item
                // or we add a handle. For now, entire item is handle.
            >
                {componentDef?.icon && <SVG src={componentDef.icon} />}
                <span className={styles.componentName}>{displayName}</span>
            </button>
            <DeleteBtn
                onClick={() => component.id && onDeleteChild(component.id)}
                entityType="component"
            />
        </div>
    );
};

export const ChildrenSelector = ({ selectedComponent, onSelectChild, onDeleteChild, onUpdateComponent }: ChildrenSelectorProps) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;
        if (active.id === over.id) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find which slot these items belong to
        // We assume IDs are unique across the whole component tree, but here we are checking children of *selectedComponent*
        if (!selectedComponent.slots) return;

        let sourceSlotName = '';
        let targetSlotName = '';
        let sourceIndex = -1;
        let targetIndex = -1;

        Object.entries(selectedComponent.slots).forEach(([slotName, items]) => {
            const sIndex = items.findIndex(item => (item as ILayoutComponent).id === activeId);
            if (sIndex !== -1) {
                sourceSlotName = slotName;
                sourceIndex = sIndex;
            }
            const tIndex = items.findIndex(item => (item as ILayoutComponent).id === overId);
            if (tIndex !== -1) {
                targetSlotName = slotName;
                targetIndex = tIndex;
            }
        });
        
        // Handling move between slots via "sortable" might be tricky if they are different lists.
        // For now, let's assume we are reordering within the SAME slot.
        // To support moving between slots, we'd need to know if we dropped on a different SortableContext.
        // dnd-kit can handle multiple sortable contexts.
        
        if (sourceSlotName && targetSlotName) {
            const newSlots = { ...selectedComponent.slots };
            
            if (sourceSlotName === targetSlotName) {
                // Reorder in same slot
                newSlots[sourceSlotName] = arrayMove(newSlots[sourceSlotName], sourceIndex, targetIndex);
            } else {
                // Move to different slot (if dropped on an item in that slot)
                const sourceItems = [...newSlots[sourceSlotName]];
                const targetItems = [...newSlots[targetSlotName]];
                
                const [movedItem] = sourceItems.splice(sourceIndex, 1);
                targetItems.splice(targetIndex, 0, movedItem);
                
                newSlots[sourceSlotName] = sourceItems;
                newSlots[targetSlotName] = targetItems;
            }
            
            onUpdateComponent({ slots: newSlots });
        }
    };

    if (!selectedComponent.slots || Object.keys(selectedComponent.slots).length === 0) {
        return (
            <div className={styles.childrenSelector}>
                <h4>Children</h4>
                <div className={styles.emptyChildren}>No child components</div>
            </div>
        );
    }

    return (
        <div className={styles.childrenSelector}>
             <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd}
                // We use a modifier to restrict to the container if needed, but not strictly required
            >
                <h4>Children</h4>
                <div className={styles.slotList}>
                    {Object.entries(selectedComponent.slots).map(([slotName, slotItems]) => (
                        <div key={slotName} className={styles.slotGroup}>
                            <div className={styles.slotHeader}>
                                <FontAwesomeIcon icon={faFolder} className={styles.slotIcon} />
                                <span className={styles.slotName}>{slotName}</span>
                                <span className={styles.slotCount}>({slotItems.length})</span>
                            </div>
                            <div className={styles.slotChildren}>
                                <SortableContext 
                                    id={slotName}
                                    items={slotItems.map(i => (i as ILayoutComponent).id!).filter(Boolean)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {slotItems.length === 0 ? (
                                        <div className={styles.emptySlot}>Empty slot</div>
                                    ) : (
                                        slotItems.map((item) => {
                                            if ('component' in item) {
                                                const component = item as ILayoutComponent;
                                                return (
                                                    <SortableChildItem 
                                                        key={component.id} 
                                                        component={component} 
                                                        onSelectChild={onSelectChild} 
                                                        onDeleteChild={onDeleteChild} 
                                                    />
                                                );
                                            }
                                            return null;
                                        })
                                    )}
                                </SortableContext>
                            </div>
                        </div>
                    ))}
                </div>
            </DndContext>
        </div>
    );
};
