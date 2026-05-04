import { overridable } from "@core/lib/overridable";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { SlotRendererProps } from "./SlotRenderer.d";
import styles from "./SlotRenderer.module.scss";

import { DeleteBtn } from "@core/components/DeleteBtn";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LayoutFixedContext, useLayoutEditor, useLayoutFixed } from "@theming/lib/layout/context";
import React, { createContext, useContext, useState } from "react";
import { SlotItemOverlay } from "./SlotItemOverlay";

export const DepthContext = createContext<number>(0);
export const useDepth = () => useContext(DepthContext);



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
        display: 'contents',
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
                data-layout-id={id}
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

export const SlotRendererComponent = overridable(({
    slots, parentId, slotName, classes = styles, depth: propDepth, getDisplayName, componentName, __fixed
}: SlotRendererProps & { depth?: number }) => {
    const contextDepth = useDepth();
    const depth = propDepth !== undefined ? propDepth : contextDepth;
    const { isEditing, selectedId, updateComponent, selectComponent, removeComponent } = useLayoutEditor();

    const isFixedContext = useLayoutFixed();
    const isFixed = __fixed || isFixedContext;

    const componentDef = ComponentRegistry.get(componentName || "");
    const componentDisplayName = componentDef?.displayName || componentName;

    const droppableId = (parentId && slotName) ? `${parentId}:${slotName}` : undefined;
    const itemIds = slots?.map(s => (s as any).id).filter(Boolean) || [];

    const { setNodeRef, isOver } = useDroppable({
        id: droppableId || 'unknown-slot',
        disabled: !isEditing || !droppableId,
        data: {
            parentId,
            slotName,
            depth
        }
    });

    const content = slots?.map((item, index) => {
        const { component, props, slots: childSlots, css, id, name } = item;
        const componentDef = ComponentRegistry.get(component);
        const layoutEditor = componentDef?.layoutEditor;
        const Component: React.ComponentType<any> | undefined = 
            isEditing?.isset && layoutEditor ? layoutEditor            :
            !!component               ? componentDef?.component :
                                        undefined;

        const componentDisplayName = name || componentDef?.displayName || component;

        const __update = (key:string) => (value:any) => {
            if (id) updateComponent(id, {props: {...props, [key]: value }});
        };

        const itemContent = Component ? (
            <DepthContext.Provider value={depth + 1}>
            <Component
                __fixed={isFixed}
                name={componentDisplayName}
                {...props}
                slots={childSlots}
                __layoutId={id}
                css={css}
                __update={__update}
                __isSelected={selectedId === id
            }/>
            </DepthContext.Provider>
        ) : null;

        if (isEditing?.isset && !isFixed && id) {
            return <SortableItem 
                key={id} 
                id={id} 
                selected={selectedId === id}
                className={classes.item}
                title={componentDisplayName}
                onSelect={() => selectComponent(id)}
                onDelete={() => removeComponent(id)}
                isContainer={componentDef?.isContainer}
                depth={depth}
                data={{ parentId, slotName, index }}
            >
                {itemContent}
            </SortableItem>;
        } 

        return <React.Fragment key={id || index}>{itemContent}</React.Fragment>;
    }) || [];

    const displayName = getDisplayName?.() || slotName;

    if (isEditing?.isset && !isFixed && droppableId) {
        const hasItems = slots && slots.length > 0;
        const result = <div 
            className={`slot-renderer-${slotName}`}
            data-slot-id={droppableId}
            style={{ 
                display: hasItems ? 'flex' : undefined,
                flexDirection: hasItems ? 'column' : undefined,
                // If empty, behave like a block
                minHeight: hasItems ? undefined : '40px',
                backgroundColor: (isOver && !hasItems) ? 'rgba(0, 255, 0, 0.1)' : undefined,
                border: (!hasItems && isEditing) ? '1px dashed #ccc' : undefined,
                padding: (!hasItems) ? '10px' : undefined,
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
                {content.map((child, index) => (
                    <React.Fragment key={`slot-item-${index}`}>
                        {child}
                    </React.Fragment>
                ))}
            </SortableContext>
            
            {!hasItems && !isFixed && (
                <div>
                    <FontAwesomeIcon icon={faSquarePlus} /> {componentDisplayName} {displayName}
                </div>
            )}
        </div>;

        return <LayoutFixedContext.Provider value={isFixed}>{result}</LayoutFixedContext.Provider>;
    }

    return <LayoutFixedContext.Provider value={isFixed}><>{content}</></LayoutFixedContext.Provider>;
});
