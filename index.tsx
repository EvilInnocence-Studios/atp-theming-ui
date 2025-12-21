import { IModule } from "@core/lib/module";
import { StandardLayout } from "@theming/components/StandardLayout";
import { ComponentRegistry } from "./lib/layout/componentRegistry";
import { themingMenus } from "./lib/menus";
import "./lib/registerComponents";
import { themingRoutes } from "./lib/routes";

export const module: IModule = {
    name: "theming",
    menus: themingMenus,
    routes: themingRoutes,
};

ComponentRegistry.register("StandardLayout", StandardLayout, { category: "Layouts", displayName: "Standard Layout" });
