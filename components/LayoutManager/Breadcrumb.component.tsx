import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { ILayoutComponent } from "@theming/lib/layout/layout";
import SVG from 'react-inlinesvg';
import styles from './LayoutEditor/LayoutEditor.module.scss';
import { Button, Card } from "antd";

interface BreadcrumbProps {
    path: ILayoutComponent[];
    onSelect: (id: string) => void;
}

export const Breadcrumb = ({ path, onSelect }: BreadcrumbProps) => {
    if (path.length === 0) {
        return null;
    }

    return (
        <Card className={styles.breadcrumb}>
            {path.map((component, index) => {
                const componentDef = ComponentRegistry.get(component.component);
                const displayName = component.name || componentDef?.displayName || component.component;
                let slotDisplayName: string | undefined;
                
                const child = path[index + 1];
                if (child && component.slots) {
                    const slotEntry = Object.entries(component.slots).find(([_, items]) => 
                        items.some(item => 'component' in item && (item as ILayoutComponent).id === child.id)
                    );
                    if (slotEntry) {
                        const slotName = slotEntry[0];
                        if (componentDef?.getSlotDisplayName) {
                            slotDisplayName = componentDef.getSlotDisplayName(slotName, component.props || {});
                        }
                    }
                }

                return (
                    <div key={component.id} className={styles.breadcrumbItem}>
                        {index > 0 && (
                            <FontAwesomeIcon 
                                icon={faChevronRight} 
                                className={styles.breadcrumbSeparator}
                            />
                        )}
                        <Button
                            type="link"
                            className={styles.breadcrumbButton}
                            onClick={() => onSelect(component.id!)}
                            title={slotDisplayName ? `Select ${displayName} (${slotDisplayName})` : `Select ${displayName}`}
                        >
                            {componentDef?.icon && <SVG src={componentDef?.icon} />} 
                            <div style={{ textAlign: 'left', position: 'relative' }}>
                                <span>{displayName}</span>
                                {slotDisplayName && (
                                    <span style={{ 
                                        position: 'absolute', 
                                        left: 0, 
                                        top: '100%', 
                                        fontSize: '0.85em', 
                                        fontStyle: 'italic', 
                                        opacity: 0.85,
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {slotDisplayName}
                                    </span>
                                )}
                            </div>
                        </Button>
                    </div>
                );
            })}
        </Card>
    );
};
