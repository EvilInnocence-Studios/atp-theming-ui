import { createContext, useContext } from "react";
import { ILayoutComponent } from "./layout";
import { IToggle } from "@core/lib/useToggle";

export interface ILayoutManagerContext {
    layout: ILayoutComponent | null;
    isEditing: IToggle | null;
    selectedId: string | null;
    selectComponent: (id: string | null) => void;
    addComponent: (parentId: string, slotName: string, component: ILayoutComponent, index?: number) => void;
    removeComponent: (id: string) => void;
    updateComponent: (id: string, updates: Partial<ILayoutComponent>) => void;
    UpdateButtons: () => JSX.Element | null;
}

export const LayoutManagerContext = createContext<ILayoutManagerContext>({
    layout: null,
    isEditing: null,
    selectedId: null,
    selectComponent: () => {},
    addComponent: () => {},
    removeComponent: () => {},
    updateComponent: () => {},
    UpdateButtons: () => null,
});

export const useLayoutManager = () => useContext(LayoutManagerContext);
