import { createInjector, inject, mergeProps } from "unstateless";
import {ThemeListItemComponent} from "./ThemeListItem.component";
import {IThemeListItemInputProps, ThemeListItemProps, IThemeListItemProps} from "./ThemeListItem.d";
import { overridable } from "@core/lib/overridable";
import { useUpdater } from "@core/lib/useUpdater";
import { ITheme } from "@common-shared/theme/types";
import { services } from "@core/lib/api";
import { flash } from "@core/lib/flash";

const injectThemeListItemProps = createInjector(({theme, refresh}:IThemeListItemInputProps):IThemeListItemProps => {
    const updater = useUpdater<ITheme>(
        "theme",
        theme.id,
        theme,
        services().theme.get,
        services().theme.update,
        "automatic",
        () => () => refresh(),
    )

    const upload = (file:File) => services().theme.image.upload(theme.id, file)
        .then(refresh)
        .catch(() => {flash.error(`Failed to upload theme image`)});
    const remove = () => services().theme.remove(theme.id)
        .then(refresh)
        .catch(() => {flash.error(`Failed to remove theme`)});

    return {...updater, upload, remove};
});

const connect = inject<IThemeListItemInputProps, ThemeListItemProps>(mergeProps(
    injectThemeListItemProps,
));
export const connectThemeListItem = connect;

export const ThemeListItem = overridable<IThemeListItemInputProps>(connect(ThemeListItemComponent));
