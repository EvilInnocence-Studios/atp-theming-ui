import { SlotRenderer } from "@theming/components/SlotRenderer";
import { forwardRef } from "react";
import { Index } from "ts-functional/dist/types";
import { ILayoutComponent } from "./layout";

// Component Registry

export declare interface IComponentMetadata {
    category?: string;
    icon?: string;
    displayName?: string;
    description?: string;
    isContainer?: boolean;
    propEditor?: (props: any, updateProps: (props: any) => void) => React.ReactNode;
    layoutEditor?: React.FC<any>;
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

interface IContainerLayoutComponentProps {
    slots?: Index<ILayoutComponent[]>,
    __layoutId?: string,
    dnd?: any,
    css?: string,
    className?: string,
    style?: React.CSSProperties
}
export const containerLayoutComponent = <P extends {children?: any, css?: string}>(Container: React.ComponentType<P>) => {
    const Wrapped = forwardRef<any, IContainerLayoutComponentProps & P>(({ slots, __layoutId, dnd, ...props }, _ref) => {
        console.log('Container', { slots, __layoutId, dnd, props });
        return (
            <Container 
                {...props as unknown as P} 
                ref={dnd?.ref}
                onClick={(e: React.MouseEvent) => {
                    // console.log('Container onClick', { dnd });
                    if (dnd?.onSelect) {
                        e.stopPropagation();
                        dnd.onSelect();
                    }
                    (props as any).onClick?.(e);
                }}
            >
                {dnd?.renderUi && dnd.renderUi()}
                {!!props.children && <>{props.children}</>}
                <SlotRenderer 
                    slots={slots?.children} 
                    slotName="children" 
                    parentId={__layoutId} 
                    depth={(dnd?.depth ?? 0) + 1} 
                    componentName={Container.displayName || Container.name}
                />
            </Container>
        );
    });
    
    // Hoist metadata
    if ((Container as any).layoutMetadata) {
        (Wrapped as any).layoutMetadata = (Container as any).layoutMetadata;
    }
    
    return Wrapped;
};

interface ILeafLayoutComponentProps {
    slots?: Index<ILayoutComponent[]>,
    __layoutId?: string,
    dnd?: any,
    css?: string,
    className?: string,
    style?: React.CSSProperties
}
export const leafLayoutComponent = <P extends object>(Component: React.ComponentType<P>, wrapperStyle?: React.CSSProperties) => {
    const Wrapped = forwardRef<any, ILeafLayoutComponentProps & P>(({
        slots, __layoutId, dnd, style, ...props
}, _ref) => {
        if (!dnd) {
            return (
                <>
                    <Component {...props as unknown as P} />
                </>
            );
        }

        return (
            <div 
                ref={dnd?.ref}
                onClick={(e: React.MouseEvent) => {
                    if (dnd?.onSelect) {
                        e.stopPropagation();
                        dnd.onSelect();
                    }
                    (props as any).onClick?.(e);
                }}
                style={{ position: 'relative', display: 'inline-block', ...wrapperStyle, ...style }}
            >
                {dnd?.renderUi && dnd.renderUi()}
                <Component {...props as unknown as P} />
            </div>
        );
    });

    // Hoist metadata
    if ((Component as any).layoutMetadata) {
        (Wrapped as any).layoutMetadata = (Component as any).layoutMetadata;
    }

    return Wrapped;
};
