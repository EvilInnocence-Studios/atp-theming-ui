import { LayoutManager } from "@theming/components/LayoutManager";
import { ThemeManager } from "@theming/components/ThemeManager";
import { withRoute } from "@core/lib/withRoute";

export const themingRoutes = {
    admin: [
        {path: "/theme",             component: ThemeManager                                                               },
        {path: "/theme/:themeId",    component: withRoute(LayoutManager)                                                   },
    ]
}
