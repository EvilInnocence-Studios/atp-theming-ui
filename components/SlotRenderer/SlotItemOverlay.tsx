import { DeleteBtn } from "@core/components/DeleteBtn";
import { faGrip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CSS } from "@dnd-kit/utilities";
import styles from "./SlotRenderer.module.scss";

interface SlotItemOverlayProps {
    targetNode: HTMLElement | null;
    selected: boolean;
    title?: string;
    onSelect: () => void;
    onDelete: () => void;
    classes?: any;
    depth?: number;
    listeners?: any;
    setActivatorNodeRef?: (element: HTMLElement | null) => void;
    transform?: any;
    hovered?: boolean;
}

export const SlotItemOverlay = ({
    targetNode,
    selected,
    title,
    onSelect,
    onDelete,
    classes = styles,
    depth = 0,
    listeners,
    setActivatorNodeRef,
    transform,
    hovered
}: SlotItemOverlayProps) => {
    const [rect, setRect] = useState<DOMRect | null>(null);

    useLayoutEffect(() => {
        if (!targetNode) return;

        const findObservableElement = (el: Element): Element | null => {
            // Skip non-visual elements
            if (['STYLE', 'SCRIPT', 'LINK', 'META'].includes(el.tagName)) return null;
            
            // Check display type
            const style = window.getComputedStyle(el);
            if (style.display !== 'contents') return el;
            
            // If contents, traverse children
            for (let i = 0; i < el.children.length; i++) {
                 const found = findObservableElement(el.children[i]);
                 if (found) return found;
            }
            return null;
        };

        const updateRect = () => {
            const container = document.getElementById('layout-editor-canvas');
            if (container && targetNode) {
                // If targetNode is display: contents, we need to measure the actual visual child
                const measurementNode = findObservableElement(targetNode) || targetNode;
                
                const containerRect = container.getBoundingClientRect();
                const nodeRect = measurementNode.getBoundingClientRect();

                // If existing transform is present, subtract it from the measurement 
                // to get the base layout position.
                // Note: getBoundingClientRect includes the transform.
                const tx = transform ? transform.x : 0;
                const ty = transform ? transform.y : 0;

                setRect({
                    top: (nodeRect.top - containerRect.top) - ty,
                    left: (nodeRect.left - containerRect.left) - tx,
                    width: nodeRect.width,
                    height: nodeRect.height,
                    bottom: 0, // unused
                    right: 0, // unused
                    x: (nodeRect.left - containerRect.left) - tx,
                    y: (nodeRect.top - containerRect.top) - ty,
                    toJSON: () => {}
                });
            }
        };

        // Initial update
        updateRect();

        // Observer for size changes in target
        const resizeObserver = new ResizeObserver(updateRect);
        
        let currentObservableTarget: Element | null = null;

        const scanAndObserve = () => {
             const newTarget = findObservableElement(targetNode);
             if (newTarget !== currentObservableTarget) {
                 if (currentObservableTarget) resizeObserver.unobserve(currentObservableTarget);
                 if (newTarget) {
                     resizeObserver.observe(newTarget);
                 } else {
                     // Fallback to observing targetNode if nothing better found
                     resizeObserver.observe(targetNode);
                 }
                 currentObservableTarget = newTarget || targetNode;
             }
             updateRect();
        };

        // Watch for DOM changes (like image loading/mounting) within the wrapper
        const mutationObserver = new MutationObserver(scanAndObserve);
        mutationObserver.observe(targetNode, { childList: true, subtree: true });

        // Initial scan
        scanAndObserve();

        // Observer for size changes in container (layout shifts)
        const container = document.getElementById('layout-editor-canvas');
        if (container) resizeObserver.observe(container);

        window.addEventListener('scroll', updateRect, true);
        window.addEventListener('resize', updateRect);

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener('scroll', updateRect, true);
            window.removeEventListener('resize', updateRect);
        };
    }, [targetNode, transform]); 

    if (!targetNode || !rect) return null; // Removed !selected check to allow hover rendering

    const portalContainer = document.getElementById('layout-editor-canvas');
    if (!portalContainer) return null;

    const overlayStyle = {
        position: 'absolute' as const,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        outline: selected ? '2px solid #1890ff' : (hovered ? `2px solid hsl(${depth * 60}, 70%, 50%)` : 'none'),
        boxSizing: 'border-box' as const,
        zIndex: 200 + depth,
        pointerEvents: 'none' as const,
        transform: transform ? CSS.Transform.toString(transform) : undefined
    };

    return createPortal(
        <div style={overlayStyle}>
            
            {/* Toolbar */}
            {selected && <div
                className={classes.overlayToolbar}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    background: '#1890ff',
                    color: 'white',
                    padding: '1px 4px',
                    fontSize: '10px',
                    borderRadius: '0 0 4px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    pointerEvents: 'auto', 
                    cursor: 'pointer'
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
            >
                <span 
                    ref={setActivatorNodeRef} 
                    {...listeners} 
                    style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}
                >
                    <FontAwesomeIcon icon={faGrip} />
                </span>
                <span>{title}</span>
                <DeleteBtn onClick={onDelete} entityType={`${title} component`} />
            </div>}
        </div>,
        portalContainer
    );
};
