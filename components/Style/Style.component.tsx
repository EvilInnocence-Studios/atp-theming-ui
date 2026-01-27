import { overridable } from "@core/lib/overridable";
import { objMap } from "ts-functional";
import { IStyleVar, StyleProps } from "./Style.d";
import { ConfigProvider } from "antd";
import { SlotRenderer } from "../SlotRenderer";

export const StyleComponent = overridable(({slots, css, vars, theme, __layoutId}:StyleProps) => <>
    {css && <style>{css}</style>}
    <style>
        :root {"{"}
            {Object.values(objMap<IStyleVar, string>(v => `--${v.name}: ${v.value};`)(vars || {})).join("\n")}
        {"}"}
    </style>
    <ConfigProvider theme={theme}>
        <SlotRenderer
            slots={slots?.[`children`]} 
            parentId={__layoutId}
            slotName="children"
            getDisplayName={() => "Children"}
        />
    </ConfigProvider>
</>);
