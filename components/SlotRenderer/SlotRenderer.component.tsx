import { overridable } from "@core/lib/overridable";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { SlotRendererProps } from "./SlotRenderer.d";
import styles from "./SlotRenderer.module.scss";

import { DeleteBtn } from "@core/components/DeleteBtn";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLayoutManager } from "@theming/lib/layout/context";
import { useState } from "react";
import { SlotItemOverlay } from "./SlotItemOverlay";

export const SelectableItem = ({
    // id,
    children,
    selected,
    className,
    title,
    onSelect,
    onDelete,
    classes,
    depth = 0
}: {
    id: string,
    children: React.ReactNode,
    selected: boolean,
    className?: string,
    title?: string,
    onSelect: () => void,
    onDelete: () => void,
    classes?: any,
    depth?: number
}) => {
    const renderUi = () => (
        <>
            {selected && <div
                className={classes?.title}
                style={{
                    position: 'absolute',
                    zIndex: 200 + depth,
                    cursor: 'pointer',
                    padding: '2px 4px',
                    background: selected ? '#1890ff' : 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    borderRadius: '0 0 4px 0',
                    top: 0,
                    left: 0,
                    fontSize: '10px',
                    pointerEvents: 'auto'
                }}
                // onClick handled by parent wrapper now
                data-selected={selected}
            >
                <span>{title}</span>
                <DeleteBtn onClick={onDelete} entityType="Component" />
            </div>}
        </>
    );

    return (
        <div 
            className={className}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            data-selected={selected}
            style={{ 
                position: 'relative', 
                border: selected ? '2px solid #1890ff' : '1px dashed transparent',
                boxSizing: 'border-box',
                // @ts-ignore
                '--depth': depth
            }}
        >
            {children}
            {renderUi()}
        </div>
    );
};



export const SortableItem = ({
    id,
    children,
    selected,
    className,
    title,
    onSelect,
    onDelete,
    data,
    depth = 0
}: {
    id: string,
    children: React.ReactNode,
    selected: boolean,
    className?: string,
    title?: string,
    onSelect: () => void,
    onDelete: () => void,
    data?: any,
    depth?: number,
    isContainer?: boolean
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id, data });

    const [node, setNode] = useState<HTMLElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        // @ts-ignore
        '--depth': depth,
    };

    const handleRef = (element: HTMLElement | null) => {
        setNodeRef(element);
        setNode(element);
    };

    // We clone the child to pass the 'dnd' prop
    return (
        <>
            <SlotItemOverlay 
                targetNode={node}
                selected={!!selected} // Force boolean
                title={title}
                onSelect={onSelect}
                onDelete={onDelete}
                depth={depth}
                listeners={listeners}
                setActivatorNodeRef={setActivatorNodeRef}
                transform={transform}
                hovered={isHovered}
            />
            <div 
                className={`slot-renderer-item ${className || ''}`} 
                ref={handleRef} 
                style={style}
                data-selected={selected}
                onClick={(e) => { e.stopPropagation(); onSelect(); }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                {...attributes}
            >
                {children}
            </div>
        </>
    );
};

export const SlotRendererComponent = overridable(({ slots, parentId, slotName, classes = styles, depth = 0, getDisplayName }: SlotRendererProps & { depth?: number }) => {
    const { isEditing, selectedId, updateComponent, selectComponent, removeComponent } = useLayoutManager();

    const droppableId = (parentId && slotName) ? `${parentId}:${slotName}` : undefined;
    const itemIds = slots?.map(s => (s as any).id).filter(Boolean) || [];

    const { setNodeRef, isOver } = useDroppable({
        id: droppableId || 'unknown-slot',
        disabled: !isEditing || !droppableId,
        data: {
            parentId,
            slotName
        }
    });

    const content = slots?.map((item) => {
        const { component, props, slots, css, id, name } = item;
        const componentDef = ComponentRegistry.get(component);
        const layoutEditor = componentDef?.layoutEditor;
        const Component: React.ComponentType<any> | undefined = 
            isEditing?.isset && layoutEditor ? layoutEditor            :
            !!component               ? componentDef?.component :
                                        undefined;

        const __update = (key:string) => (value:any) => {
            updateComponent(id, {props: {...props, [key]: value }});
        };

        const itemContent = Component ? (
            <Component {...props} slots={slots} __layoutId={id} css={css} __update={__update} __isSelected={selectedId === id}/>
        ) : null;

        if (isEditing?.isset && id) {
            return <SortableItem 
                key={id} 
                id={id} 
                selected={selectedId === id}
                className={classes.item}
                title={name || componentDef?.displayName || component}
                onSelect={() => selectComponent(id)}
                onDelete={() => removeComponent(id)}
                isContainer={componentDef?.isContainer}
                depth={depth}
            >
                {itemContent}
            </SortableItem>;
        }

        return itemContent;
    });

    const displayName = getDisplayName?.() || slotName;

    if (isEditing?.isset && droppableId) {
        const hasItems = slots && slots.length > 0;
        return <div 
            className={`slot-renderer-${slotName}`}
            style={{ 
                display: hasItems ? 'contents' : undefined,
                // If empty, behave like a block
                minHeight: hasItems ? undefined : '50px',
                backgroundColor: (isOver && !hasItems) ? 'rgba(0, 255, 0, 0.1)' : undefined,
                border: (!hasItems && isEditing) ? '1px dashed #ccc' : undefined,
                padding: (!hasItems) ? '20px' : undefined,
                width: (!hasItems) ? '100%' : undefined,
                textAlign: (!hasItems) ? 'center' : undefined,
            }}
            // If empty, we attach ref here. If not empty, we attach ref to the filler.
            ref={(node) => {
                if (!hasItems) {
                    setNodeRef(node);
                }
            }}
        >
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                {content}
            </SortableContext>
            
            {!hasItems && selectedId === parentId && (
                <div>
                    Drop {displayName} components here
                </div>
            )}

            {/* Filler Drop Target for non-empty lists */}
            {hasItems && selectedId === parentId && (
                <div 
                    ref={setNodeRef}
                    style={{
                        flexGrow: 1,
                        minWidth: '20px',
                        minHeight: '20px',
                        display: 'block', 
                        backgroundColor: isOver ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
                        alignSelf: 'stretch',
                        padding: '20px',
                        border: '1px dashed #ccc',
                        textAlign: 'center',
                        zIndex: 9999,
                    }}
                >
                    Drop {displayName} components here
                </div>
            )}
        </div>;
    }

    return <>{content}</>;
});
