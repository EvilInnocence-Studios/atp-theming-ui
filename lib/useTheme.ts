import { ITheme } from "@common-shared/theme/types";
import { useSetting } from "@common/lib/setting/services";
import { services } from "@core/lib/api";
import { IStyleVar } from "@theming/components/Style/Style";
import { ThemeConfig, theme as antTheme } from "antd";
import { useEffect } from "react";
import { memoizePromise } from "ts-functional";
import { Index } from "ts-functional/dist/types";
import { useSharedState } from "unstateless";

const getTheme = memoizePromise((id:string) => services().theme.get(id), {});

const useCurrentId = useSharedState<string>("");
const useCurrentTheme = useSharedState<ITheme | null>(null);

export const useLayoutTheme = () => {
    const defaultThemeId = useSetting("defaultThemeId");
    const [currentThemeId, setCurrentThemeId] = useCurrentId();
    const [theme, setTheme] = useCurrentTheme();

    useEffect(() => {
        if(!currentThemeId && defaultThemeId) {
            setCurrentThemeId(defaultThemeId);
        }
    }, [defaultThemeId]);
    
    useEffect(() => {
        if (!currentThemeId) return;
        getTheme(currentThemeId).then(setTheme);
    }, [currentThemeId]);
    
    return { theme, onChange: setCurrentThemeId };
}

export const useTheme = (_vars:Index<IStyleVar>) => {
    // Generate and return the Ant Design theme tokens
    const theme:ThemeConfig = {algorithm: antTheme.darkAlgorithm}

    return theme;
}
