import { ITheme } from "@common-shared/theme/types";
import { services } from "@core/lib/api";
import { overridable } from "@core/lib/overridable";
import { useUpdater } from "@core/lib/useUpdater";
import { ILayoutComponent } from "@theming/lib/layout/layout";
import { ensureIds } from "@theming/lib/layout/utils";
import { useState } from "react";
import { createInjector, inject, mergeProps } from "unstateless";
import { LayoutManagerComponent } from "./LayoutManager.component";
import { ILayoutManagerInputProps, ILayoutManagerProps, LayoutManagerProps } from "./LayoutManager.d";

const injectLayoutManagerProps = createInjector(({ themeId }: ILayoutManagerInputProps): ILayoutManagerProps => {
    const [element, setElement] = useState<string>("layout");
    
    const updater = useUpdater<ITheme>(
        "theme",
        themeId,
        {id: themeId, json: null, name: "", description: "", imageUrl: null, enabled:false},
        services().theme.get,
        services().theme.update,
        "manual",
    );

    const theme = updater.history.entity;
    const themeJson = theme?.json || {};
    const layout:ILayoutComponent | null = themeJson?.[element]
        ? ensureIds(themeJson?.[element])
        : null;


    const onChange = (layout: ILayoutComponent | null) => {
        updater.updateObject("json")({...themeJson, [element]: layout});
    }

    return {
        theme,
        updater,
        element,
        setElement,
        layout,
        onChange,
        UpdateButtons: updater.UpdateButtons,
    };
});

const connect = inject<ILayoutManagerInputProps, LayoutManagerProps>(mergeProps(
    injectLayoutManagerProps,
));

export const LayoutManager = overridable<LayoutManagerProps>(connect(LayoutManagerComponent));
