import { overridable } from "@core/lib/overridable";
import { useLayoutTheme } from "@theming/lib/useTheme";
import { createInjector, inject, mergeProps } from "unstateless";
import { LayoutComponent } from "./Layout.component";
import { ILayoutInputProps, ILayoutProps, LayoutProps } from "./Layout.d";

const injectLayoutProps = createInjector(<Context>({ element }: ILayoutInputProps): ILayoutProps<Context> => {
    const { theme } = useLayoutTheme();

    return { component: theme && theme.json ? (theme.json as any)[element] || null : null };
});

const connect = inject<ILayoutInputProps<any>, LayoutProps<any>>(mergeProps(
    injectLayoutProps,
));
export const connectLayout = connect;

export const Layout = overridable<ILayoutInputProps<any>>(connect(LayoutComponent));
