import { ITheme, IThemeSerialized } from "@common-shared/theme/types";
import { Index } from "ts-functional/dist/types";
import { ComponentRegistry } from "./layout/componentRegistry";
import { ILayoutComponent, ILayoutComponentSerialized } from "./layout/layout";

export const serializeTheme = async (theme:ITheme):Promise<IThemeSerialized> => {
    const imageUrl = theme.imageUrl ? theme.imageUrl : null;
    const imageData = imageUrl ? await fetch(imageUrl).then(res => res.arrayBuffer()) : null;

    const serializedJson:Index<ILayoutComponentSerialized<any>> = theme.json ?Object.fromEntries(
        await Promise.all(
            Object.entries(theme.json).map(
                async ([id, cmp]) => [id, await serializeComponent(cmp, id)]
            )
        )
    ) : null;

    // Serialize the theme
    const serialized:IThemeSerialized = {
        name: theme.name,
        description: theme.description,
        imageUrl,
        imageData,
        json: serializedJson,
        enabled: theme.enabled
    };
console.log("Serialized theme:", serialized);
    return serialized;
}

const serializeComponent = async (cmp:ILayoutComponent, id:string):Promise<ILayoutComponentSerialized<any>> => {
    // Fetch the component definition
    const def = ComponentRegistry.get(cmp.component);
    if (!def) {
        throw new Error(`Component ${cmp.component} not found`);
    }
    
    // Determine if there is a serialize function
    const serialize = def.serialize || (a => a);

    // Serialize children components in the slots
    const slots:Index<ILayoutComponentSerialized<any>[]> = cmp.slots ? Object.fromEntries(
        await Promise.all(
            Object.entries(cmp.slots).map(
                async ([slotName, slots]) => [slotName, await Promise.all(slots.map(slot => serializeComponent(slot, id)))]
            )
        )
    ) : {};

    // Serialize the component
    const serialized:ILayoutComponentSerialized<any> = await serialize(cmp);
    serialized.slots = slots;
    
    return serialized;
}

export const deserializeTheme = async (serialized:IThemeSerialized):Promise<[Omit<ITheme, 'id'>, Blob | null]> => {
    const imageUrl = serialized.imageUrl ? serialized.imageUrl : null;
    const imageData = serialized.imageData ? new Blob([serialized.imageData]) : null;

    const deserializedJson:Index<ILayoutComponent> = serialized.json ? Object.fromEntries(
        await Promise.all(
            Object.entries(serialized.json).map(
                async ([id, cmp]) => [id, await deserializeComponent(cmp, id)]
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

    return [deserialized, imageData];
}

const deserializeComponent = async (cmp:ILayoutComponentSerialized<any>, id:string):Promise<ILayoutComponent> => {
    // Fetch the component definition
    const def = ComponentRegistry.get(cmp.component);
    if (!def) {
        throw new Error(`Component ${cmp.component} not found`);
    }
    
    // Determine if there is a deserialize function
    const deserialize = def.deserialize || (a => a);

    // Deserialize children components in the slots
    const slots:Index<ILayoutComponent[]> = cmp.slots ? Object.fromEntries(
        await Promise.all(
            Object.entries(cmp.slots).map(
                async ([slotName, slots]) => [slotName, await Promise.all(slots.map(slot => deserializeComponent(slot, id)))]
            )
        )
    ) : {};

    // Deserialize the component
    const deserialized:ILayoutComponent = await deserialize(cmp);
    deserialized.slots = slots;
    
    return deserialized;
}
