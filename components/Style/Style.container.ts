import { IMedia } from "@common-shared/media/types";
import { useSetting } from "@common/lib/setting/services";
import { services } from "@core/lib/api";
import { overridable } from "@core/lib/overridable";
import { useLoaderAsync } from "@core/lib/useLoader";
import { withLayoutMetadata } from "@theming/lib/layout/componentRegistry";
import { ILayoutComponent, ILayoutComponentSerialized } from "@theming/lib/layout/layout";
import { useTheme } from "@theming/lib/useTheme";
import { useEffect, useState } from "react";
import { createInjector, inject, mergeProps } from "unstateless";
import icon from './icon.svg';
import { StyleComponent } from "./Style.component";
import { IStyleFont, IStyleInputProps, IStyleProps, StyleProps } from "./Style.d";
import { StylePropEditor } from "./Style.props";

const injectStyleProps = createInjector(({vars, fonts}:IStyleInputProps):IStyleProps => {
    const theme = useTheme(vars || {});
    
    const [loadedFonts, setLoadedFonts] = useState<IStyleFont[]>([]);
    const loader = useLoaderAsync();
    const imgHost = useSetting("imageHost");
    const imgFolder = useSetting("mediaImageFolder");

    useEffect(() => {
        if (!fonts) {
            setLoadedFonts([]);
            return;
        }

        const fontArray = Object.values(fonts);
        if (fontArray.length === 0) {
            setLoadedFonts([]);
            return;
        }

        if (imgHost && imgFolder) {
            loader(async () => {
                const resolvedFonts = await Promise.all(
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
                setLoadedFonts(resolvedFonts);
            });
        }
    }, [fonts, imgHost, imgFolder]);
    
    return {theme, fonts: loadedFonts};
});

const connect = inject<IStyleInputProps, StyleProps>(mergeProps(
    injectStyleProps,
));
export const connectStyle = connect;

export const Style = withLayoutMetadata(
    overridable<IStyleInputProps>(connect(StyleComponent)),
    {
        name: "Style",
        displayName: "Style",
        category: "Misc",
        description: "",
        icon,
        getSlotDisplayName: (slotName, props) => props[slotName] || slotName,
        propEditor: StylePropEditor,
        serialize: async (cmp:ILayoutComponent, context: { addFile: (name: string, blob: Blob) => void }): Promise<ILayoutComponentSerialized<{fonts?: {img: IMedia, data: string, fontId: string}[]}>> => {
            const fonts = cmp.props?.fonts;
            if (!fonts) return cmp;
            
            const fontsData = [];
            const imgHost = await services().setting.get("imageHost");
            const imgFolder = await services().setting.get("mediaImageFolder");
            
            for (const fontId of Object.values(fonts).map((f: any) => f.fontId).filter(Boolean) as string[]) {
                try {
                    const img = await services().media.get(fontId);
                    const fullUrl = `${imgHost}/${imgFolder}/${encodeURIComponent(img.url || "")}`;
                    const blob = await fetch(fullUrl, { mode: 'cors', cache: 'no-cache' }).then(res => res.blob());
                    
                    if (context && context.addFile) {
                        context.addFile(img.url, blob);
                    }
                    fontsData.push({ img, data: img.url, fontId });
                } catch(e) {
                    console.error("Failed to serialize font", e);
                }
            }
            
            return {
                ...cmp,
                __data: {
                    fonts: fontsData
                }
            };
        },
        deserialize: async ({__data, ...cmp}:ILayoutComponentSerialized<{fonts?: {img: IMedia, data: string, fontId: string}[]}>, context: { getFile: (name: string) => Promise<Blob | null> }) => {
            if (!__data || !__data.fonts) return Promise.resolve(cmp);

            const newPropsFonts = cmp.props?.fonts ? { ...cmp.props.fonts } : {};
            let propsChanged = false;

            for (const {img, data, fontId} of __data.fonts) {
                const fileName = data;
                let blob: Blob | null = null;
                
                if (context && context.getFile) {
                    blob = await context.getFile(fileName);
                }

                if (!blob) {
                    console.warn(`Font file ${fileName} not found in theme package`);
                    continue;
                }

                const file = new File([blob], img.url);
                const newImg:Partial<IMedia> = await services().media.create(file, true);
                const newImageId = newImg.id as string;
                newImg.id = undefined;

                img.id = newImageId;
                await services().media.update(newImageId, img);
                
                // Find font input and update ID
                for (const key of Object.keys(newPropsFonts)) {
                    if (newPropsFonts[key].fontId === fontId) {
                        newPropsFonts[key].fontId = newImageId;
                        propsChanged = true;
                    }
                }
            }

            if (propsChanged) {
                return Promise.resolve({
                    ...cmp,
                    props: {
                        ...cmp.props,
                        fonts: newPropsFonts
                    }
                });
            }

            return Promise.resolve(cmp);
        }
    }
);
