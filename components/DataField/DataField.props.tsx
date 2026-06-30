import { Label } from "@core/components/Label";
import { IDataFieldInputProps } from "./DataField.d";
import { Editable } from "@core/components/Editable";

export const DataFieldPropEditor = (
    {column}: IDataFieldInputProps,
    _updateProps: (props: any) => void,
    updateProp: (prop: string) => (value: any) => void
) => {
    return <>
        <Label label="Column">
            <Editable onChange={updateProp("column")} value={column || ""} />
        </Label>
    </>;
}
