import { MarkdownEditor } from "@core/components/MarkdownEditor";
import { Card, Checkbox } from "antd";
import { ITextInputProps } from "./Text";

export const TextPropEditor = ({markdown, inline}: ITextInputProps, _updateProps: (props: any) => void, updateProp: (prop: string) => (value: any) => void) => {
    return <>
        <Card size="small" title="Text">
            <MarkdownEditor value={markdown || ""} onChange={(markdown) => updateProp("markdown")(markdown)}/>
            <br/>
            <Checkbox checked={inline} onChange={(e) => updateProp("inline")(e.target.checked)} >Inline</Checkbox>
            <Checkbox checked={inline} onChange={(e) => updateProp("raw")(e.target.checked)} >Raw</Checkbox>
        </Card>
    </>;
};