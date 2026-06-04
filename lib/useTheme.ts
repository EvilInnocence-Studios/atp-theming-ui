import { useSetting } from "@common/lib/setting/services";
import { services } from "@core/lib/api";
import { ITheme } from "@theming-shared/theme/types";
import { IStyleVar } from "@theming/components/Style/Style";
import { ThemeConfig, theme as antTheme } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { memoizePromise } from "ts-functional";
import { Index } from "ts-functional/dist/types";
import { useSharedState } from "unstateless";

const getTheme = memoizePromise((id:string, preview: boolean = false) => {
    const load = preview ? services().theme.preview : services().theme.get;
    return load(id);
}, {});

const useCurrentId = useSharedState<string>("");
const useCurrentTheme = useSharedState<ITheme | null>(null);

// TODO: Integrate theme switcher bug fix
/*
export const useLayoutTheme = () => {
    const defaultThemeId = useSetting("defaultThemeId");
    const [currentThemeId, setCurrentThemeId] = useCurrentThemeId();
    const [themes, setThemes] = useState<ITheme[]>([]);

    useEffect(() => {
        getThemes().then(setThemes);
    }, []);

    return {
        theme: themes.find(t => !!currentThemeId ? t.id === currentThemeId : t.id === defaultThemeId),
        onChange: setCurrentThemeId,
    };
}
*/

export const useLayoutTheme = () => {
    const defaultThemeId = useSetting("defaultThemeId");
    const [currentThemeId, setCurrentThemeId] = useCurrentId();
    const [theme, setTheme] = useCurrentTheme();
    const [query] = useSearchParams();
    const themeFromQuery = query.get("themeId");

    useEffect(() => {
        console.log("Using theme", defaultThemeId, themeFromQuery);
        let id = defaultThemeId;
        if(themeFromQuery) {
            console.log("Using theme from query", themeFromQuery);
            id = themeFromQuery;
        }
        if(id && !currentThemeId) {
            setCurrentThemeId(id);
        }
    }, [defaultThemeId, themeFromQuery]);
    
    useEffect(() => {
        if (!currentThemeId) return;
        console.log("Loading theme", currentThemeId, !!themeFromQuery);
        getTheme(currentThemeId, !!themeFromQuery).then(setTheme);
    }, [currentThemeId]);
    
    return { theme, onChange: setCurrentThemeId, preview: !!themeFromQuery };
}

export const useTheme = (_vars:Index<IStyleVar>) => {
    // Generate and return the Ant Design theme tokens
    const theme:ThemeConfig = {algorithm: antTheme.darkAlgorithm}

    return theme;
}
