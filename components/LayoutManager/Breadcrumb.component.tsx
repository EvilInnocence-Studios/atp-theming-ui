import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { ILayoutComponent } from "@theming/lib/layout/layout";
import SVG from 'react-inlinesvg';
import styles from './LayoutManager.module.scss';

interface BreadcrumbProps {
    path: ILayoutComponent[];
    onSelect: (id: string) => void;
}

export const Breadcrumb = ({ path, onSelect }: BreadcrumbProps) => {
    if (path.length === 0) {
        return null;
    }

    return (
        <div className={styles.breadcrumb}>
            {path.map((component, index) => {
                const componentDef = ComponentRegistry.get(component.component);
                const displayName = component.name || componentDef?.displayName || component.component;
                
                return (
                    <div key={component.id} className={styles.breadcrumbItem}>
                        {index > 0 && (
                            <FontAwesomeIcon 
                                icon={faChevronRight} 
                                className={styles.breadcrumbSeparator}
                            />
                        )}
                        <button
                            className={styles.breadcrumbButton}
                            onClick={() => onSelect(component.id!)}
                            title={`Select ${displayName}`}
                        >
                            {componentDef?.icon && <SVG src={componentDef?.icon} />} {displayName}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
