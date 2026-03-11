import { ITheme } from "@common-shared/theme/types";
import { useSetting } from "@common/lib/setting/services";
import { services } from "@core/lib/api";
import { overridable } from "@core/lib/overridable";
import { LayoutRegistry } from "@theming/lib/layout/componentRegistry";
import { useEffect, useState } from "react";
import { createInjector, inject, mergeProps } from "unstateless";
import { LayoutComponent } from "./Layout.component";
import { ILayoutInputProps, ILayoutProps, LayoutProps } from "./Layout.d";

const injectLayoutProps = createInjector(<Context>({ element }: ILayoutInputProps): ILayoutProps<Context> => {
    const [theme, setTheme] = useState<ITheme | null>(null);
    const defaultThemeId = useSetting("defaultThemeId");

    useEffect(() => {
        if (!defaultThemeId) return;
        services().theme.get(defaultThemeId).then(setTheme);
    }, [defaultThemeId]);

    return { component: theme && theme.json ? (theme.json as any)[element] || null : null };
});

const connect = inject<ILayoutInputProps<any>, LayoutProps<any>>(mergeProps(
    injectLayoutProps,
));
export const connectLayout = connect;

export const Layout = overridable<ILayoutInputProps<any>>(connect(LayoutComponent));
