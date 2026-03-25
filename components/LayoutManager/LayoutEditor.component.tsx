import { IToggle } from "@core/lib/useToggle";
import { overridable } from "@core/lib/overridable";
import { useDroppable } from "@dnd-kit/core";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { ILayoutComponent } from "@theming/lib/layout/layout";
import { getAncestryPath } from "@theming/lib/layout/utils";
import clsx from "clsx";
import { SelectableItem } from "@theming/components/SlotRenderer/SlotRenderer.component";
import slotStyles from "@theming/components/SlotRenderer/SlotRenderer.module.scss";
import { Breadcrumb } from "./Breadcrumb.component";
import { JsonLayoutDisplay } from "./JsonLayoutDisplay.component";
import styles from './LayoutManager.module.scss';

export interface LayoutEditorProps {
    layout: ILayoutComponent | null;
    isEditing?: IToggle | null;
    showJson?: IToggle | null;
    selectedId: string | null;
    selectComponent: (id: string | null) => void;
    removeComponent: (id: string) => void;
    updateComponent: (id: string, updates: Partial<ILayoutComponent>) => void;
    classes?: any;
    className?: string;
}

export const LayoutEditorComponent = overridable(({
    layout, isEditing, showJson, selectedId, selectComponent, removeComponent, updateComponent, classes = styles, className
}: LayoutEditorProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'root-layout',
        disabled: !!layout && !!layout.component,
    });

    const isEditMode = isEditing?.isset ?? true;

    return (
        <div className={clsx("layout-editor-canvas", className)}>
            {layout && layout.component && isEditMode && (
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
        </div>
    );
});

export const LayoutEditor = LayoutEditorComponent;
