import { createContext, useContext } from "react";
import { ILayoutComponent } from "./layout";
import { IToggle } from "@core/lib/useToggle";
import { ITheme } from "@common-shared/theme/types";
import { IUpdater } from "@core/lib/useUpdater";

export interface ILayoutEditorContext {
    layout: ILayoutComponent | null;
    isEditing: IToggle | null;
    showJson: IToggle | null;
    selectedId: string | null;
    selectComponent: (id: string | null) => void;
    addComponent: (parentId: string, slotName: string, component: ILayoutComponent, index?: number) => void;
    removeComponent: (id: string) => void;
    updateComponent: (id: string, updates: Partial<ILayoutComponent>) => void;
}

export const LayoutEditorContext = createContext<ILayoutEditorContext>({
    layout: null,
    isEditing: null,
    showJson: null,
    selectedId: null,
    selectComponent: () => {},
    addComponent: () => {},
    removeComponent: () => {},
    updateComponent: () => {},
});

export const useLayoutEditor = () => useContext(LayoutEditorContext);

export interface ILayoutManagerContext {
    theme: ITheme | null;
    updater: IUpdater<ITheme> | null;
    element: string | null;
    setElement: (element: string) => void;
    UpdateButtons: () => JSX.Element | null;
}

export const LayoutManagerContext = createContext<ILayoutManagerContext>({
    theme: null,
    updater: null,
    element: null,
    setElement: () => {},
    UpdateButtons: () => null,
});

export const useLayoutManager = () => useContext(LayoutManagerContext);
