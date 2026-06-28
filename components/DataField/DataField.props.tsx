import { IDataFieldInputProps } from "./DataField.d";

export const DataFieldPropEditor = (
    {}: IDataFieldInputProps,
    updateProps: (props: any) => void,
    updateProp: (prop: string) => (value: any) => void
) => {
    return <>
        Placeholder Prop Editor for DataField
    </>;
}
