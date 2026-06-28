import { IDataListNewInputProps } from "./DataListNew.d";

export const DataListNewPropEditor = (
    {}: IDataListNewInputProps,
    updateProps: (props: any) => void,
    updateProp: (prop: string) => (value: any) => void
) => {
    return <>
        Placeholder Prop Editor for DataListNew
    </>;
}
