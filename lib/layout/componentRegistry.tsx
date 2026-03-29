import { Index } from "ts-functional/dist/types";
import { ILayoutComponent, ILayoutComponentSerialized } from "./layout";

// Component Registry

export declare interface ILayoutEditorProps {
    __layoutId: string;
    __update: (prop: string) => (value: any) => void;
    __isSelected: boolean;
    [key: string]: any;
}
export declare type LayoutEditor = React.FC<ILayoutEditorProps>;

export declare interface IComponentMetadata<T = undefined> {
    category?: string;
    subCategory?: string;
    icon?: string;
    displayName?: string;
    description?: string;
    isContainer?: boolean;
    propEditor?: (props: any, updateProps: (props: any) => void, updateProp: (prop: string) => (value: any) => void) => React.ReactNode;
    layoutEditor?: LayoutEditor;
    getSlotDisplayName?: (slotName: string, props: any) => string;
    serialize?: (cmp: ILayoutComponent, context: { addFile: (name: string, blob: Blob) => void }) => Promise<ILayoutComponentSerialized<T>>;
    deserialize?: (cmp: ILayoutComponentSerialized<T>, context: { getFile: (name: string) => Promise<Blob | null> }) => Promise<ILayoutComponent>;
}

export declare interface IComponentRegistration extends IComponentMetadata {
    name: string;
    component: React.ComponentType<any>;
}

const components: Index<IComponentRegistration> = {};

export const withLayoutMetadata = <P extends object, T = undefined>(
    Component: React.FC<P>,
    metadata: IComponentMetadata<T> & { name: string }
): React.FC<P> => {
    (Component as any).layoutMetadata = metadata;
    return Component;
};

export const ComponentRegistry = {
    register: (nameOrComponent: string | React.FC<any>, component?: React.FC<any>, metadata?: IComponentMetadata) => {
        if (typeof nameOrComponent === 'string') {
            if (!component) return;
            components[nameOrComponent] = {
                name: nameOrComponent,
                component,
                ...metadata
            };
        } else {
            const Comp = nameOrComponent;
            const meta = (Comp as any).layoutMetadata;
            if (meta) {
                components[meta.name] = {
                    component: Comp,
                    ...meta
                };
            }
        }
    },
    get: (name: string): IComponentRegistration | undefined =>
        components[name],
    getAll: (): Index<IComponentRegistration> =>
        components,
    getCategories: (): Set<string> =>
        new Set(Object.values(components)
            .map(({ category }) => category)
            .filter((category) => category !== undefined)),
    byCategory: (selectedCategory: string): IComponentRegistration[] =>
        Object.values(components)
            .filter(({ category }) => category === selectedCategory),
    bySearch: (search: string): IComponentRegistration[] =>
        Object.values(components)
            .filter(({ displayName }) => displayName?.toLowerCase().includes(search.toLowerCase())),
}

export declare interface ILayoutRegistration<Context = undefined> {
    name: string;
    displayName?: string;
    description?: string;
    defaultLayout: ILayoutComponent;
    priority: number;
}

const layouts: Index<ILayoutRegistration<any>> = {};

export const LayoutRegistry = {
    register: <Context extends undefined | any>(registration: ILayoutRegistration<Context>) => {
        layouts[registration.name] = registration;
    },
    get: <Context extends undefined | any>(name: string): ILayoutRegistration<Context> | undefined =>
        layouts[name],
    getDefault: (name: string): ILayoutComponent | undefined =>
        layouts[name]?.defaultLayout,
    getNames: (): string[] =>
        Object.keys(layouts),
    getOptions: () => Object.values(layouts)
        .sort((a, b) => a.priority - b.priority)
        .map(({ name, displayName, description }) => ({
            value: name,
            label: <>
                <div><b>{displayName || name}</b></div>
                <div><em>{description || ""}</em></div>
            </>
        })),
}
