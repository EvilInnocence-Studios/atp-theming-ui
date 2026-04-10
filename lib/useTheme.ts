import { ITheme } from "@common-shared/theme/types";
import { useSetting } from "@common/lib/setting/services";
import { IStyleVar } from "@theming/components/Style/Style";
import { ThemeConfig, theme as antTheme } from "antd";
import { Index } from "ts-functional/dist/types";
import { useSharedState } from "unstateless";
import { useEffect } from "react";
import { services } from "@core/lib/api";

export const useLayoutTheme = () => {
    const defaultThemeId = useSetting("defaultThemeId");
    const [currentThemeId, setCurrentThemeId] = useSharedState<string>("currentThemeId", defaultThemeId)();
    const [theme, setTheme] = useSharedState<ITheme | null>("currentThemeId", null)();

    useEffect(() => {
        if (!defaultThemeId) return;
        services().theme.get(currentThemeId).then(setTheme);
    }, [currentThemeId]);
    
    return { theme, onChange: setCurrentThemeId };
}

export const useTheme = (vars:Index<IStyleVar>) => {
    // Map var values to names
    const variables = Object.values(vars || {}).reduce((acc, v) => {
        acc[v.name] = v.value;
        return acc;
    }, {} as Index<string>);

    // Generate and return the Ant Design theme tokens
    const theme:ThemeConfig = Object.keys(variables).length === 0 ? {algorithm: antTheme.darkAlgorithm} : {
        algorithm: antTheme.darkAlgorithm,
        token: {
            colorPrimary: variables.primaryColor || '#000000',
            colorBorder: variables.borderColor || '#CCCCCC',
            colorBgBase: variables.bgColor || "#1A1A1A",
            colorText: variables.textColor || '#E0E0E0',
        },
        components: {
            Layout: {
                headerBg: variables.bgLightColor || '#2A2A2A',
                headerPadding: "0",
                siderBg: variables.bgLightColor || '#2A2A2A',
            },
            Card: {
                headerBg: variables.bgLightColor || '#2A2A2A',
    
            },
            Input: {
                activeShadow: `0 0 0 1px ${variables.secondaryColor || '#FFFFFF'}`,
            }
        }
    }

    return theme;
}
