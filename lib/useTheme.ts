import { useEffect } from "react";
import { useSettingGroup } from "@common/lib/setting/services"
import { ThemeConfig, theme as antTheme } from "antd";

export const useTheme = () => {
    const variables = useSettingGroup('theme') || {};

    // Apply the theme variables to the document root
    useEffect(() => {
        Object.entries(variables).forEach(([key, value]) => {
            if (value) {
                let computedValue = value;
                while(computedValue.startsWith("var(")) {
                    const varName = computedValue.slice(6, -1).trim();
                    computedValue = variables[varName];
                }
                document.documentElement.style.setProperty(`--${key}`, computedValue);
            }
        });
    }, [variables]);

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
