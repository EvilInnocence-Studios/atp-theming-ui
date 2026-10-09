import { ILayoutComponent } from "@theming/lib/layout/layout";

export const extractLayoutElements = (parsed: unknown): Record<string, ILayoutComponent> => {
    if (!parsed || typeof parsed !== 'object') return {};

    const obj = parsed as Record<string, unknown>;

    if (obj.json && typeof obj.json === 'object' && !Array.isArray(obj.json)) {
        return filterLayoutEntries(obj.json as Record<string, unknown>);
    }

    return filterLayoutEntries(obj);
};

const filterLayoutEntries = (obj: Record<string, unknown>): Record<string, ILayoutComponent> => {
    const nonLayoutKeys = new Set(['id', 'name', 'description', 'imageUrl', 'enabled', 'globalStyles', 'created', 'updated', 'deleted']);
    const result: Record<string, ILayoutComponent> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (!nonLayoutKeys.has(key) && value && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = value as ILayoutComponent;
        }
    }
    return result;
};
