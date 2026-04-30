import { IMethods } from "@core/lib/types";
import { getResults, handleError } from "@core/lib/util";
import { themeServices } from "./theme/services";

export const themingServices = (methods:IMethods) => ({
    ...themeServices(methods),
    sass: {
        compile: (sass:string):Promise<string> => methods.post<{css:string}>(`sass/compile`, { sass })
            .then(getResults)
            .then((res:any) => res?.css)
            .catch(handleError)
    }
});