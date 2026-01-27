import { overridable } from "@core/lib/overridable";
import { objMap } from "ts-functional";
import { IStyleVar, StyleProps } from "./Style.d";

export const StyleComponent = overridable(({css, vars}:StyleProps) => <>
    {css && <style>{css}</style>}
    <style>
        :root {"{"}
            {Object.values(objMap<IStyleVar, string>(v => `--${v.name}: ${v.value};`)(vars || {})).join("\n")}
        {"}"}
    </style>
</>);

