import { ITheme, IThemeSerialized } from "@common-shared/theme/types";
import { services } from "@core/lib/api";
import JSZip from 'jszip';
import { Index } from "ts-functional/dist/types";
import { ComponentRegistry } from "./layout/componentRegistry";
import { ILayoutComponent, ILayoutComponentSerialized } from "./layout/layout";

const fetchThumbnail = async (fileName:string):Promise<Blob | null> => {
    if(fileName) {
        const imgHost = await services().setting.get("imageHost");
        const imgFolder = await services().setting.get("themeThumbnailFolder");
        const fullUrl =  !!imgHost && !!imgFolder
            ? `${imgHost}/${imgFolder}/${encodeURIComponent(fileName)}`
            : "";
            
        try {
            const res = await fetch(fullUrl, { mode: 'cors', cache: 'no-cache' });
            if (!res.ok) {
                console.error(`Failed to fetch thumbnail: ${res.statusText}`);
                return null;
            }
            return await res.blob();
        } catch (e) {
            console.error("Error fetching thumbnail", e);
            return null;
        }
    }
    return null;
}

export const serializeTheme = async (theme:ITheme):Promise<Blob> => {
    const zip = new JSZip();

    // Fetch and add thumbnail
    const thumbnailBlob = await fetchThumbnail(theme.imageUrl || "");
    if (thumbnailBlob && theme.imageUrl) {
        // We might want to standardize the thumbnail name or keep original
        zip.file(`thumbnail_${theme.imageUrl}`, thumbnailBlob);
    }
    
    const context = {
        addFile: (name: string, blob: Blob) => {
            zip.file(name, blob);
        }
    };

    const serializedJson:Index<ILayoutComponentSerialized<any>> = theme.json ? Object.fromEntries(
        await Promise.all(
            Object.entries(theme.json).map(
                async ([id, cmp]) => [id, await serializeComponent(cmp, id, context)]
            )
        )
    ) : null;

    // Serialize the theme
    const serialized:IThemeSerialized = {
        name: theme.name,
        description: theme.description,
        imageUrl: theme.imageUrl,
        json: serializedJson,
        enabled: theme.enabled
    };
    
    zip.file("theme.json", JSON.stringify(serialized, null, 2));

    return zip.generateAsync({type:"blob"});
}

const serializeComponent = async (cmp:ILayoutComponent, id:string, context: { addFile: (name: string, blob: Blob) => void }):Promise<ILayoutComponentSerialized<any>> => {
    // Fetch the component definition
    const def = ComponentRegistry.get(cmp.component);
    if (!def) {
        throw new Error(`Component ${cmp.component} not found`);
    }
    
    // Determine if there is a serialize function
    const serialize = def.serialize || (a => Promise.resolve(a));

    // Serialize children components in the slots
    const slots:Index<ILayoutComponentSerialized<any>[]> = cmp.slots ? Object.fromEntries(
        await Promise.all(
            Object.entries(cmp.slots).map(
                async ([slotName, slots]) => [slotName, await Promise.all(slots.map(slot => serializeComponent(slot, id, context)))]
            )
        )
    ) : {};

    // Serialize the component
    const serialized:ILayoutComponentSerialized<any> = await serialize(cmp, context);
    serialized.slots = slots;
    
    return serialized;
}

export const deserializeTheme = async (zipFile:Blob):Promise<[Omit<ITheme, 'id'>, File | null]> => {
    const zip = await JSZip.loadAsync(zipFile);
    
    const themeJson = zip.file("theme.json");
    if(!themeJson) {
        throw new Error("Invalid theme file: theme.json missing");
    }

    const serialized:IThemeSerialized = JSON.parse(await themeJson.async("string"));
    
    const imageUrl = serialized.imageUrl ? serialized.imageUrl : null;
    let thumbnail:File | null = null;

    if(imageUrl) {
        const thumbFile = zip.file(`thumbnail_${imageUrl}`);
        if(thumbFile) {
            const blob = await thumbFile.async("blob");
            thumbnail = new File([blob], imageUrl);
        }
    }

    const context = {
        getFile: async (name: string):Promise<Blob | null> => {
            const file = zip.file(name);
            return file ? file.async("blob") : null;
        }
    };

    const deserializedJson:Index<ILayoutComponent> = serialized.json ? Object.fromEntries(
        await Promise.all(
            Object.entries(serialized.json).map(
                async ([id, cmp]) => [id, await deserializeComponent(cmp, id, context)]
            )
        )
    ) : null;

    // Deserialize the theme
    const deserialized:Omit<ITheme, 'id'> = {
        name: serialized.name,
        description: serialized.description,
        imageUrl,
        json: deserializedJson,
        enabled: serialized.enabled
    };

    return [deserialized, thumbnail];
}

const deserializeComponent = async (cmp:ILayoutComponentSerialized<any>, id:string, context: { getFile: (name: string) => Promise<Blob | null> }):Promise<ILayoutComponent> => {
    // Fetch the component definition
    const def = ComponentRegistry.get(cmp.component);
    if (!def) {
        throw new Error(`Component ${cmp.component} not found`);
    }
    
    // Determine if there is a deserialize function
    const deserialize = def.deserialize || (a => Promise.resolve(a));

    // Deserialize children components in the slots
    const slots:Index<ILayoutComponent[]> = cmp.slots ? Object.fromEntries(
        await Promise.all(
            Object.entries(cmp.slots).map(
                async ([slotName, slots]) => [slotName, await Promise.all(slots.map(slot => deserializeComponent(slot, id, context)))]
            )
        )
    ) : {};

    // Deserialize the component
    const deserialized:ILayoutComponent = await deserialize(cmp, context);
    deserialized.slots = slots;
    
    return deserialized;
}
