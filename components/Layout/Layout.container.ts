import { createInjector, inject, mergeProps } from "unstateless";
import {LayoutComponent} from "./Layout.component";
import {ILayoutInputProps, LayoutProps, ILayoutProps} from "./Layout.d";
import { overridable } from "@core/lib/overridable";
import { useEffect, useState } from "react";
import { ITheme } from "@common-shared/theme/types";
import { services } from "@core/lib/api";
import { useSetting } from "@common/lib/setting/services";

const injectLayoutProps = createInjector(({element}:ILayoutInputProps):ILayoutProps => {
    const [theme, setTheme] = useState<ITheme | null>(null);
    const defaultThemeId = useSetting("defaultThemeId");

    useEffect(() => {
        if (!defaultThemeId) return;
        services().theme.get(defaultThemeId).then(setTheme);
    }, [defaultThemeId]);

    return {component: theme && theme.json ? (theme.json as any)[element] || null : null};
});

const connect = inject<ILayoutInputProps, LayoutProps>(mergeProps(
    injectLayoutProps,
));
export const connectLayout = connect;

export const Layout = overridable<ILayoutInputProps>(connect(LayoutComponent));
