import { createInjector, inject, mergeProps } from "unstateless";
import {LayoutElementSelectComponent} from "./LayoutElementSelect.component";
import {ILayoutElementSelectInputProps, LayoutElementSelectProps, ILayoutElementSelectProps} from "./LayoutElementSelect.d";
import { overridable } from "@core/lib/overridable";
import { Index } from "ts-functional/dist/types";
import { ILayoutOption, LayoutRegistry } from "@theming/lib/layout/componentRegistry";
import { useModal } from "@core/lib/useModal";

interface ILayoutOptionDetails extends ILayoutOption {
    complete: boolean;
}

const injectLayoutElementSelectProps = createInjector(({theme, selectedElement,}:ILayoutElementSelectInputProps):ILayoutElementSelectProps => {
    const modal = useModal();
    
    const rawOptions = LayoutRegistry.getOptions();
    const options: Index<Index<ILayoutOptionDetails[]>> = rawOptions
        .reduce((acc, option) => {
            const category = option.category || "Other";
            const subCategory = option.subCategory || "Other";
            if (!acc[category]) {
                acc[category] = {};
            }
            if (!acc[category][subCategory]) {
                acc[category][subCategory] = [];
            }

            acc[category][subCategory].push({
                ...option,
                complete: theme?.json?.[option.value] !== undefined,
            });
            return acc;
        }, {} as Index<Index<ILayoutOptionDetails[]>>);

    const currentOption = rawOptions.find(o => o.value === selectedElement);

    return {currentOption, options, modal};
});

const connect = inject<ILayoutElementSelectInputProps, LayoutElementSelectProps>(mergeProps(
    injectLayoutElementSelectProps,
));
export const connectLayoutElementSelect = connect;

export const LayoutElementSelect = overridable<ILayoutElementSelectInputProps>(connect(LayoutElementSelectComponent));
