import { useSetting } from "@common/lib/setting/services";
import { services } from "@core/lib/api";
import { overridable } from "@core/lib/overridable";
import { useLoaderAsync } from "@core/lib/useLoader";
import { useLayoutTheme } from "@theming/lib/useTheme";
import { useEffect, useState } from "react";
import { createInjector, inject, mergeProps } from "unstateless";
import { IStyleFont } from "../Style/Style";
import { LayoutComponent } from "./Layout.component";
import { ILayoutInputProps, ILayoutProps, LayoutProps } from "./Layout.d";
import { ITheme } from "@theming-shared/theme/types";
import { memoizePromise } from "ts-functional";

export const loadFonts = memoizePromise((theme:ITheme | null, imgHost:string | null, imgFolder:string | null):Promise<IStyleFont[]> => {
    if (!theme) return Promise.resolve([]);

    if (!imgHost || !imgFolder) return Promise.resolve([]);

    const fontArray = Object.values(theme.globalStyles?.fonts ?? {});
    if (fontArray.length === 0) return Promise.resolve([]);

    return Promise.all(
        fontArray.map(async (fontInput) => {
            const font: IStyleFont = { ...fontInput };
            if (font.fontId) {
                try {
                    const media = await services().media.get(font.fontId);
                    if (media && media.url) {
                        font.url = `${imgHost}/${imgFolder}/${encodeURIComponent(media.url)}`;
                    }
                } catch (e) {
                    console.error("Failed to load font media", e);
                }
            }
            return font;
        })
    );
}, {keyGen: ([theme, imgHost, imgFolder]:[ITheme | null, string | null, string | null]):string =>
    `${JSON.stringify(theme)}|${imgHost ?? 'null'}|${imgFolder ?? 'null'}`
});

const injectLayoutProps = createInjector(<Context>({ element }: ILayoutInputProps): ILayoutProps<Context> => {
    const { theme } = useLayoutTheme();
    const [fonts, setFonts] = useState<IStyleFont[]>([]);
    const loader = useLoaderAsync();
    const imgHost = useSetting("imageHost");
    const imgFolder = useSetting("mediaImageFolder");

    useEffect(() => {
        loader(async () => {
            const fonts = await loadFonts(theme, imgHost, imgFolder);
            setFonts(fonts);
        });
    }, [theme, imgHost, imgFolder]);

    return {
        component: theme && theme.json ? (theme.json as any)[element] || null : null,
        theme, fonts,
     };
});

const connect = inject<ILayoutInputProps<any>, LayoutProps<any>>(mergeProps(
    injectLayoutProps,
));
export const connectLayout = connect;

export const Layout = overridable<ILayoutInputProps<any>>(connect(LayoutComponent));
