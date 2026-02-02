import { ISetting } from "@common-shared/setting/types";
import { ITheme, NewTheme } from "@common-shared/theme/types";
import { services } from "@core/lib/api";
import { flash } from "@core/lib/flash";
import { overridable } from "@core/lib/overridable";
import { useLoaderAsync } from "@core/lib/useLoader";
import { useEffect, useState } from "react";
import { createInjector, inject, mergeProps } from "unstateless";
import { ThemeManagerComponent } from "./ThemeManager.component";
import { IThemeManagerInputProps, IThemeManagerProps, ThemeManagerProps } from "./ThemeManager.d";
import { deserializeTheme } from "@theming/lib/serialize";

const newTheme: NewTheme = {
    name: "New Theme",
    description: "",
    imageUrl: null,
    json: null,
    enabled: false,
}

const injectThemeManagerProps = createInjector(({}:IThemeManagerInputProps):IThemeManagerProps => {
    const [themes, setThemes] = useState<ITheme[]>([]);
    const loader = useLoaderAsync();
    const [defaultThemeId, setDefaultThemeId] = useState<string | null>(null);

    useEffect(() => {
        services().setting.search()
            .then((settings:ISetting[]) => {
                const defaultTheme = settings.find((s:ISetting) => s.key === "defaultThemeId");
                if (defaultTheme) {
                    setDefaultThemeId(defaultTheme.value);
                }
            })
            .catch(flash.error(`Failed to load settings`));
    }, []);

    const refresh = () => {
        loader(() => services().theme.search()
            .then(themes => {
                setThemes(themes.sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch(flash.error(`Failed to load themes`)));
    }

    useEffect(refresh, []);

    const create = () => {
        services().theme.create(newTheme).then(refresh).catch(flash.error(`Failed to create theme`));
    }

    const setDefaultTheme = (id:string) => () => {
        services().setting.updateByKey("defaultThemeId", id)
            .then(() => {
                refresh();
                flash.success(`Default theme set to ${id}`);
                setDefaultThemeId(id);
            })
            .catch(flash.error(`Failed to set default theme`));
    }

    const importTheme = async (file: File) => {
        const [theme, thumbnail] = await deserializeTheme(file);

        if(!theme) {
            flash.error(`Failed to import theme`);
            return;
        }

        const newTheme = await services().theme.create(theme);
        console.log(newTheme);
        console.log(thumbnail);
        if(thumbnail) {
            console.log("Uploading thumbnail");
            await services().theme.image.upload(newTheme.id, thumbnail);
        }
        flash.success(`Theme ${newTheme.name} imported successfully`)();
        refresh();
    }
    
    return {create, themes, isLoading: loader.isLoading, refresh, defaultThemeId, setDefaultTheme, importTheme};
});

const connect = inject<IThemeManagerInputProps, ThemeManagerProps>(mergeProps(
    injectThemeManagerProps,
));
export const connectThemeManager = connect;

export const ThemeManager = overridable<IThemeManagerInputProps>(connect(ThemeManagerComponent));
