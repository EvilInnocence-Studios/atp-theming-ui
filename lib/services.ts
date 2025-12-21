import { IMethods } from "@core/lib/types";
import { themeServices } from "./theme/services";

export const themingServices = (methods:IMethods) => ({
    ...themeServices(methods),
});