import { overridable } from "@core/lib/overridable";
import { objMap } from "ts-functional";
import { IStyleVar, StyleProps } from "./Style.d";
import { ConfigProvider } from "antd";
import { SlotRenderer } from "../SlotRenderer";

export const StyleComponent = overridable(({slots, css, vars, fonts, theme, __layoutId, name}:StyleProps) => <>
    <style>
        {fonts?.filter(f => f.url).map(f => `
            @font-face {
                font-family: "${f.name}";
                src: url("${f.url}");
                font-weight: ${f.weight || "normal"};
                font-style: ${f.style || "normal"};
                font-display: swap;
            }
        `).join("\n")}
        #rootLayout {"{"}
            {Object.values(objMap<IStyleVar, string>(v => `--${v.name}: ${v.value};`)(vars || {})).join("\n")}
        {"}"}
        {css}
    </style>

    <div id="rootLayout" style={{display: "contents"}}>
        <ConfigProvider theme={theme}>
            <SlotRenderer
                slots={slots?.[`children`]} 
                parentId={__layoutId}
                slotName="children"
                componentName={name}
                getDisplayName={() => "Children"}
            />
        </ConfigProvider>
    </div>
</>);
