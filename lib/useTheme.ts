import { IStyleVar } from "@theming/components/Style/Style";
import { ThemeConfig, theme as antTheme } from "antd";
import { Index } from "ts-functional/dist/types";

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
