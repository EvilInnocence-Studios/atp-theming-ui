import { ITheme, NewTheme } from "@common-shared/theme/types";
import { IMethods } from "@core/lib/types";
import { getResults } from "@core/lib/util";
import { memoize } from "ts-functional";

export const themeServices = memoize(({ get, post, patch, remove }: IMethods) => ({
    theme: {
        search: (): Promise<ITheme[]> => get(`theme`).then(getResults),
        get: (id: string): Promise<ITheme> => get(`theme/${id}`).then(getResults),
        create: (theme: NewTheme): Promise<ITheme> => post(`theme`, theme),
        update: (id: string, value: Partial<ITheme>): Promise<ITheme> => patch(`theme/${id}`, value),
        remove: (id: string) => remove(`theme/${id}`),
        image: {
            upload: (id: string, file: File): Promise<string> => post(`theme/${id}/image`, file),
            remove: (id: string) => remove(`theme/${id}/image`),
        }
    },
}), {});