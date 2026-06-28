import { overridable } from "@core/lib/overridable";
import { DataFieldProps } from "./DataField.d";

export const DataFieldComponent = overridable(({ className, css, dataType, value }: DataFieldProps) => <>
    {css && <style>{css}</style>}
    <span className={className}>
        {value}
    </span>
</>);

