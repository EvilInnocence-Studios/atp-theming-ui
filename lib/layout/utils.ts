import { Index } from "ts-functional/dist/types";
import { ILayoutComponent } from "./layout";

export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const ensureIds = (component: ILayoutComponent): ILayoutComponent => {
    const id = component.id || uuidv4();
    const slots: Index<ILayoutComponent[]> = {};
    if (component.slots) {
        Object.keys(component.slots).forEach(key => {
            slots[key] = component.slots![key].map(item => {
                if ('component' in item) {
                    return ensureIds(item as ILayoutComponent);
                }

                return item;
            });
        });
    }
    return { ...component, id, slots: component.slots ? slots : undefined };
};

export const findComponent = (root: ILayoutComponent, id: string): ILayoutComponent | null => {
    if (root.id === id) return root;
    if (!root.slots) return null;
    
    for (const slotName of Object.keys(root.slots)) {
        for (const item of root.slots[slotName]) {
            if ('component' in item) {
                const found = findComponent(item as ILayoutComponent, id);
                if (found) return found;
            }
        }
    }
    return null;
};

export const findParent = (root: ILayoutComponent, childId: string): { parent: ILayoutComponent, slotName: string, index: number } | null => {
    if (!root.slots) return null;

    for (const slotName of Object.keys(root.slots)) {
        const items = root.slots[slotName];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if ('component' in item) {
                if ((item as ILayoutComponent).id === childId) {
                    return { parent: root, slotName, index: i };
                }
                const found = findParent(item as ILayoutComponent, childId);
                if (found) return found;
            }
        }
    }
    return null;
};

export const removeComponent = (root: ILayoutComponent, id: string): ILayoutComponent | null => {
    if (root.id === id) return null; // Cannot remove root this way usually, or handled by caller
    if (!root.slots) return root;

    const newSlots: Index<ILayoutComponent[]> = {};
    let changed = false;

    Object.keys(root.slots).forEach(slotName => {
        const items = root.slots![slotName];
        const newItems: ILayoutComponent[] = [];
        items.forEach(item => {
            if ('component' in item) {
                if ((item as ILayoutComponent).id === id) {
                    changed = true;
                    // Skip adding this item (remove it)
                } else {
                    const updatedItem = removeComponent(item as ILayoutComponent, id);
                    if (updatedItem !== item) changed = true;
                    if (updatedItem) newItems.push(updatedItem);
                }
            } else {
                newItems.push(item);
            }
        });
        newSlots[slotName] = newItems;
    });

    return changed ? { ...root, slots: newSlots } : root;
};

export const addComponent = (root: ILayoutComponent, parentId: string, slotName: string, component: ILayoutComponent, index?: number): ILayoutComponent => {
    if (root.id === parentId) {
        const slots = root.slots || {};
        const currentSlot = slots[slotName] || [];
        const newSlot = [...currentSlot];
        if (typeof index === 'number' && index >= 0) {
            newSlot.splice(index, 0, component);
        } else {
            newSlot.push(component);
        }
        return { ...root, slots: { ...slots, [slotName]: newSlot } };
    }

    if (!root.slots) return root;

    const newSlots: Index<ILayoutComponent[]> = {};
    let changed = false;

    Object.keys(root.slots).forEach(key => {
        newSlots[key] = root.slots![key].map(item => {
            if ('component' in item) {
                const updated = addComponent(item as ILayoutComponent, parentId, slotName, component, index);
                if (updated !== item) changed = true;
                return updated;
            }
            return item;
        });
    });

    return changed ? { ...root, slots: newSlots } : root;
};

export const updateComponent = (root: ILayoutComponent, id: string, updates: Partial<ILayoutComponent>): ILayoutComponent => {
    if (root.id === id) {
        console.log("Updating component");
        console.log("Original", root);
        console.log("Updates", updates);
        console.log("Combined", {...root, ...updates});
        return { ...root, ...updates };
    }
    if (!root.slots) return root;

    const newSlots: Index<ILayoutComponent[]> = {};
    let changed = false;

    Object.keys(root.slots).forEach(key => {
        newSlots[key] = root.slots![key].map(item => {
            if ('component' in item) {
                const updated = updateComponent(item as ILayoutComponent, id, updates);
                if (updated !== item) changed = true;
                return updated;
            }
            return item;
        });
    });

    return changed ? { ...root, slots: newSlots } : root;
};

export const getAncestryPath = (root: ILayoutComponent, targetId: string): ILayoutComponent[] => {
    const path: ILayoutComponent[] = [];
    
    const findPath = (component: ILayoutComponent): boolean => {
        path.push(component);
        
        if (component.id === targetId) {
            return true;
        }
        
        if (component.slots) {
            for (const slotName of Object.keys(component.slots)) {
                for (const item of component.slots[slotName]) {
                    if ('component' in item) {
                        if (findPath(item as ILayoutComponent)) {
                            return true;
                        }
                    }
                }
            }
        }
        
        path.pop();
        return false;
    };
    
    findPath(root);
    return path;
};
