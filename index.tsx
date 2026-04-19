import { IModule } from "@core/lib/module";
import { StandardLayout } from "@theming/components/StandardLayout";
import { Container } from "./components/Container";
import { MultiColumnLayout } from "./components/MultiColumnLayout";
import { RouteTable } from "./components/RouteTable";
import { Style } from "./components/Style";
import { Text } from "./components/Text";
import { ThemeDescription } from "./components/ThemeDescription";
import { ThemeName } from "./components/ThemeName";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { ThemeSwitcherBar } from "./components/ThemeSwitcherBar";
import { ComponentRegistry, LayoutRegistry } from "./lib/layout/componentRegistry";
import { themingMenus } from "./lib/menus";
import { themingRoutes } from "./lib/routes";

export const module: IModule = {
    name: "theming",
    menus: themingMenus,
    routes: themingRoutes,
};

ComponentRegistry.register("StandardLayout", StandardLayout, { 
    category: "Layout", 
    subCategory: "Structure", 
    displayName: "Standard Layout",
    getSlotDisplayName: (slotName) => slotName.charAt(0).toUpperCase() + slotName.slice(1)
});
ComponentRegistry.register("Empty", () => <div></div>, { category: "Layout", subCategory: "Structure", displayName: "Empty" });
ComponentRegistry.register(MultiColumnLayout);
ComponentRegistry.register(Container);
ComponentRegistry.register(Text);
ComponentRegistry.register(RouteTable);
ComponentRegistry.register(Style);
ComponentRegistry.register(ThemeSwitcher);
ComponentRegistry.register(ThemeSwitcherBar);
ComponentRegistry.register(ThemeName);
ComponentRegistry.register(ThemeDescription);

LayoutRegistry.register({
    name: "layout",
    displayName: "Page Layout",
    description: "The site container (header, footer, etc.)",
    defaultLayout: {
        component: "Content",
    },
    priority: 100,
});
LayoutRegistry.register({
    name: "homepage",
    displayName: "Homepage",
    description: "The homepage layout and design",
    defaultLayout: {
        component: "Empty"
    },
    priority: 200,
});
