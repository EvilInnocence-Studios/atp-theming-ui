import { Index } from "ts-functional/dist/types";
import { ILayoutComponent } from "./layout";

// Component Registry

export declare interface ILayoutEditorProps {
    __layoutId: string;
    __update: (prop: string) => (value: any) => void;
    __isSelected: boolean;
    [key: string]: any;
}
export declare type LayoutEditor = React.FC<ILayoutEditorProps>;

export declare interface IComponentMetadata {
    category?: string;
    icon?: string;
    displayName?: string;
    description?: string;
    isContainer?: boolean;
    propEditor?: (props: any, updateProps: (props: any) => void, updateProp: (prop: string ) => (value: any) => void) => React.ReactNode;
    layoutEditor?: LayoutEditor;
    getSlotDisplayName?: (slotName: string, props: any) => string;
}

export declare interface IComponentRegistration extends IComponentMetadata {
    name: string;
    component: React.ComponentType<any>;
}

const components: Index<IComponentRegistration> = {};

export const withLayoutMetadata = <P extends object>(
    Component: React.FC<P>,
    metadata: IComponentMetadata & { name: string }
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

const layouts:Index<{
    name: string;
    displayName?: string;
    description?: string;
    defaultLayout: ILayoutComponent;
}> = {};

export const LayoutRegistry = {
    register: ({name, displayName, description, defaultLayout}: {name: string, displayName?: string, description?: string, defaultLayout:ILayoutComponent}) => {
        layouts[name] = {name, displayName, description, defaultLayout };
    },
    getDefault: (name: string): ILayoutComponent | undefined =>
        layouts[name]?.defaultLayout,
    getNames: (): string[] =>
        Object.keys(layouts),
    getOptions: () => Object.values(layouts).map(({ name, displayName, description }) => ({
        value: name,
        label: <>
            <div><b>{displayName || name}</b></div>
            <div><em>{description || ""}</em></div>
        </>
    })),
}
