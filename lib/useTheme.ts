import { useSetting } from "@common/lib/setting/services";
import { services } from "@core/lib/api";
import { ITheme } from "@theming-shared/theme/types";
import { IStyleVar } from "@theming/components/Style/Style";
import { ThemeConfig, theme as antTheme } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { memoizePromise } from "ts-functional";
import { Index } from "ts-functional/dist/types";
import { useSharedState } from "unstateless";

const getThemes = memoizePromise(() => services().theme.preview(), {});

const useCurrentThemeId = useSharedState<string>("");
const usePreviewTheme = useSharedState<boolean>(false);

export const useLayoutTheme = () => {
    const defaultThemeId = useSetting("defaultThemeId");
    const [currentThemeId, setCurrentThemeId] = useCurrentThemeId();
    const [preview, setIsPreview] = usePreviewTheme();
    const [themes, setThemes] = useState<ITheme[]>([]);
    const [query] = useSearchParams();
    const themeFromQuery = query.get("themeId");

    useEffect(() => {
        getThemes().then(setThemes);
    }, []);

    useEffect(() => {
        if(themeFromQuery) {
            setIsPreview(true);
            setCurrentThemeId(themeFromQuery);
        }
    }, [themeFromQuery]);

    return {
        theme: themes.find(t => !!currentThemeId ? t.id === currentThemeId : t.id === defaultThemeId) || null,
        preview,
        onChange: setCurrentThemeId,
    };
}

export const useTheme = (_vars:Index<IStyleVar>) => {
    // Generate and return the Ant Design theme tokens
    const theme:ThemeConfig = {algorithm: antTheme.darkAlgorithm}

    return theme;
}
