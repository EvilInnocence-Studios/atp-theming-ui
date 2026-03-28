import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { Collapse } from "antd";
import SVG from 'react-inlinesvg';
import styles from './LayoutEditor/LayoutEditor.module.scss';
import { overridable } from "@core/lib/overridable";

const DraggablePaletteItem = ({ component, classes }: { component: any, classes: any }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `palette-${component.name}`,
        data: { component }
    });
    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={classes.component}>
            {component.icon && <SVG src={component.icon} />}
            <span>{component.displayName}</span>
        </div>
    );
};

export interface ComponentLibraryProps {
    classes?: any;
}

export const ComponentLibraryComponent = overridable(({ classes = styles }: ComponentLibraryProps) => {
    return (
        <div className={classes.componentLibrary}>
            <h3 className={classes.paletteHeader}>Available Components</h3>
            <Collapse accordion size="small">
                {Array.from(ComponentRegistry.getCategories()).map((category) =>
                    <Collapse.Panel header={category} key={category}>
                        <div className={classes.componentList}>
                            {ComponentRegistry.byCategory(category).map((component) => (
                                <DraggablePaletteItem key={component.name} component={component} classes={classes} />
                            ))}
                        </div>
                    </Collapse.Panel>
                )}
            </Collapse>
        </div>
    );
});

export const ComponentLibrary = ComponentLibraryComponent;
