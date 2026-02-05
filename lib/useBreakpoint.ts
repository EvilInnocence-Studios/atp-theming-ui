import { Grid } from "antd";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

// xs  = {xs: true,  sm: false, md: false, lg: false, xl: false, xxl: false}
// sm  = {xs: false, sm: true,  md: false, lg: false, xl: false, xxl: false}
// md  = {xs: false, sm: true,  md: true,  lg: false, xl: false, xxl: false}
// lg  = {xs: false, sm: true,  md: true,  lg: true,  xl: false, xxl: false}
// xl  = {xs: false, sm: true,  md: true,  lg: true,  xl: true,  xxl: false}
// xxl = {xs: false, sm: true,  md: true,  lg: true,  xl: true,  xxl: true }

export const useBreakpoint = (): Breakpoint => {
    const screens = Grid.useBreakpoint();

    return screens.xxl ? "xxl" :
           screens.xl  ? "xl"  :
           screens.lg  ? "lg"  :
           screens.md  ? "md"  :
           screens.sm  ? "sm"  :
                         "xs";
};