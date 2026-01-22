import { IModule } from "@core/lib/module";
import { StandardLayout } from "@theming/components/StandardLayout";
import { Container } from "./components/Container";
import { MultiColumnLayout } from "./components/MultiColumnLayout";
import { RouteTable } from "./components/RouteTable";
import { Text } from "./components/Text";
import { ComponentRegistry, LayoutRegistry } from "./lib/layout/componentRegistry";
import { themingMenus } from "./lib/menus";
import { themingRoutes } from "./lib/routes";

export const module: IModule = {
    name: "theming",
    menus: themingMenus,
    routes: themingRoutes,
};

ComponentRegistry.register("StandardLayout", StandardLayout, { category: "Layouts", displayName: "Standard Layout" });
ComponentRegistry.register("Empty", () => <div></div>, { category: "Layouts", displayName: "Empty" });
ComponentRegistry.register(MultiColumnLayout);
ComponentRegistry.register(Container);
ComponentRegistry.register(Text);
ComponentRegistry.register(RouteTable);

LayoutRegistry.register({name: "layout", displayName: "Page Layout", description: "The site container (header, footer, etc.)", defaultLayout: {
    component: "Content",
}});
LayoutRegistry.register({name: "homepage", displayName: "Homepage", description: "The homepage layout and design", defaultLayout: {
    component: "Empty"
}});