import { ITheme } from "@common-shared/theme/types";
import { services } from "@core/lib/api";
import { overridable } from "@core/lib/overridable";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import { useLayoutTheme } from "@theming/lib/useTheme";
import { useEffect, useState } from "react";
import { createInjector, inject, mergeProps } from "unstateless";
import icon from './icon.svg';
import { ThemeSwitcherComponent } from "./ThemeSwitcher.component";
import { IThemeSwitcherInputProps, IThemeSwitcherProps, ThemeSwitcherProps } from "./ThemeSwitcher.d";

const injectThemeSwitcherProps = createInjector(({}:IThemeSwitcherInputProps):IThemeSwitcherProps => {
    const { theme, onChange } = useLayoutTheme();
    const [themes, setThemes] = useState<ITheme[]>([]);

    useEffect(() => {
        services().theme.search().then(themes => {
            setThemes(themes.filter(t => t.enabled));
        });
    }, []);

    return { themes, currentThemeId: theme?.id || "", onChange };
});

const connect = inject<IThemeSwitcherInputProps, ThemeSwitcherProps>(mergeProps(
    injectThemeSwitcherProps,
));
export const connectThemeSwitcher = connect;

export const ThemeSwitcher = withLayoutMetadata(
    overridable<IThemeSwitcherInputProps>(connect(ThemeSwitcherComponent)),
    {
        name: "ThemeSwitcher",
        displayName: "ThemeSwitcher",
        category: "General",
        subCategory: "Misc",
        description: "",
        icon,
        getSlotDisplayName: (slotName, props) => props[slotName] || slotName,
    }
);
