import { useDndContext } from "@dnd-kit/core";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { globalMousePos } from "@theming/components/LayoutManager/LayoutEditor/LayoutEditor";
import { useLayoutEditor } from "@theming/lib/layout/context";
import { findComponent, findParent } from "@theming/lib/layout/utils";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";

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

export const DropIndicatorOverlay = () => {
    const { active, over } = useDndContext();
    const { layout } = useLayoutEditor();
    const [indicatorState, setIndicatorState] = useState<{
        top: number;
        left: number;
        width: number;
        height: number;
        opacity: number;
        tooltipText?: string;
    } | null>(null);

    const cacheRef = useRef<any>(null);

    useEffect(() => {
        if (!active || !over) {
            setIndicatorState(null);
            cacheRef.current = null;
            return;
        }

        const container = document.getElementById('layout-editor-canvas');
        if (!container) return;

        if (cacheRef.current?.overId !== over.id) {
            const isSlot = over.id.toString().includes(':'); 
            let node: HTMLElement | null = null;
            
            if (isSlot) {
                node = document.querySelector(`[data-slot-id="${over.id}"]`) as HTMLElement;
            } else {
                node = document.querySelector(`[data-layout-id="${over.id}"]`) as HTMLElement;
            }

            if (!node) {
                setIndicatorState(null);
                cacheRef.current = null;
                return;
            }

            const observable = findObservableElement(node) || node;
            const containerRect = container.getBoundingClientRect();
            
            // Read depth from the node's --depth variable
            const style = window.getComputedStyle(node);
            const depth = parseInt(style.getPropertyValue('--depth') || '0', 10);
            
            // Cross-axis indentation: 16px per depth level
            const indentation = depth * 16;

            let targetParentId: string | undefined;
            let targetSlot: string | undefined;

            if (isSlot) {
                targetParentId = over.data.current?.parentId;
                targetSlot = over.data.current?.slotName;
            } else if (layout && layout.component) {
                const parentInfo = findParent(layout, over.id.toString());
                if (parentInfo) {
                    targetParentId = parentInfo.parent.id;
                    targetSlot = parentInfo.slotName;
                }
            }

            let tooltipText = "";
            if (targetParentId && targetSlot && layout && layout.component) {
                const parentComponent = findComponent(layout, targetParentId);
                const componentDef = parentComponent ? ComponentRegistry.get(parentComponent.component) : null;
                const parentName = parentComponent ? (parentComponent.name || componentDef?.displayName || parentComponent.component) : "Slot";
                
                const displaySlotName = componentDef?.getSlotDisplayName 
                    ? componentDef.getSlotDisplayName(targetSlot, parentComponent?.props || {})
                    : targetSlot;
                    
                tooltipText = `Drop into ${parentName} (${displaySlotName})`;
            }

            cacheRef.current = {
                overId: over.id,
                isSlot,
                observable,
                depth,
                indentation,
                tooltipText,
                container,
                containerRect
            };
        }

        let rafId: number;

        const updateRect = () => {
            rafId = requestAnimationFrame(updateRect);

            const cache = cacheRef.current;
            if (!cache) return;

            const nodeRect = cache.observable.getBoundingClientRect();

            let top = 0;
            let left = 0;
            let width = 0;
            let height = 0;

            if (cache.isSlot) {
                // Empty slot highlighting
                top = (nodeRect.top - cache.containerRect.top) + cache.container.scrollTop;
                left = (nodeRect.left - cache.containerRect.left) + cache.container.scrollLeft;
                width = nodeRect.width;
                height = nodeRect.height;
                
                setIndicatorState(prev => {
                    if (prev && prev.top === top && prev.left === left && prev.width === width && prev.opacity === 0.2) return prev;
                    return { top, left, width, height, opacity: 0.2, tooltipText: cache.tooltipText };
                });
            } else {
                // Determine if dropping before or after based on mouse Y relative to the node's center
                const isAfter = globalMousePos.y > nodeRect.top + nodeRect.height / 2;
                
                top = (isAfter ? nodeRect.bottom : nodeRect.top) - cache.containerRect.top + cache.container.scrollTop;
                left = (nodeRect.left - cache.containerRect.left) + cache.container.scrollLeft + cache.indentation;
                width = nodeRect.width - cache.indentation;
                height = 4; // 4px thick line
                top -= 2;

                setIndicatorState(prev => {
                    if (prev && prev.top === top && prev.left === left && prev.width === width && prev.opacity === 1) return prev;
                    return { top, left, width, height, opacity: 1, tooltipText: cache.tooltipText };
                });
            }
        };

        rafId = requestAnimationFrame(updateRect);

        return () => cancelAnimationFrame(rafId);
    }, [active, over, layout]);

    const portalContainer = document.getElementById('layout-editor-canvas');
    if (!portalContainer) return null;

    const overlayStyle: React.CSSProperties = indicatorState ? {
        position: 'absolute',
        top: indicatorState.top,
        left: indicatorState.left,
        width: indicatorState.width,
        height: indicatorState.height,
        backgroundColor: '#1890ff',
        opacity: indicatorState.opacity,
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'opacity 0.1s, top 0.1s, left 0.1s, width 0.1s'
    } : {};

    return createPortal(
        <>
            {indicatorState && (
                <div style={overlayStyle}>
                    {indicatorState.tooltipText && (
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: '-20px',
                            background: '#1890ff',
                            color: 'white',
                            padding: '2px 6px',
                            fontSize: '10px',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                            {indicatorState.tooltipText}
                        </div>
                    )}
                </div>
            )}
        </>,
        portalContainer
    );
};
