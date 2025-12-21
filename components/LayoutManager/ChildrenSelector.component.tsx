import { ILayoutComponent } from "@theming/lib/layout/layout";
import { ComponentRegistry } from "@theming/lib/layout/componentRegistry";
import { faFolder, faCube } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DeleteBtn } from "@core/components/DeleteBtn";
import styles from './LayoutManager.module.scss';

interface ChildrenSelectorProps {
    selectedComponent: ILayoutComponent;
    onSelectChild: (id: string) => void;
    onDeleteChild: (id: string) => void;
}

export const ChildrenSelector = ({ selectedComponent, onSelectChild, onDeleteChild }: ChildrenSelectorProps) => {
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
                            {slotItems.length === 0 ? (
                                <div className={styles.emptySlot}>Empty slot</div>
                            ) : (
                                slotItems.map((item, index) => {
                                    if ('component' in item) {
                                        const component = item as ILayoutComponent;
                                        const componentDef = ComponentRegistry.get(component.component);
                                        const displayName = componentDef?.displayName || component.component;
                                        
                                        return (
                                            <div key={component.id || index} className={styles.childItem}>
                                                <button
                                                    className={styles.childButton}
                                                    onClick={() => component.id && onSelectChild(component.id)}
                                                    title={`Select ${displayName}`}
                                                >
                                                    <FontAwesomeIcon icon={faCube} className={styles.componentIcon} />
                                                    <span className={styles.componentName}>{displayName}</span>
                                                </button>
                                                <DeleteBtn
                                                    onClick={() => component.id && onDeleteChild(component.id)}
                                                    entityType="component"
                                                />
                                            </div>
                                        );
                                    }
                                    return null;
                                })
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
