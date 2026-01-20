import { MarkdownEditor } from "@core/components/MarkdownEditor";
import { Card } from "antd";
import { ITextInputProps } from "./Text";

export const TextPropEditor = ({markdown}: ITextInputProps, _updateProps: (props: any) => void, updateProp: (prop: string) => (value: any) => void) => {
    return <>
        <Card size="small" title="Text">
            <MarkdownEditor value={markdown || ""} onChange={(markdown) => updateProp("markdown")(markdown)}/>
        </Card>
    </>;
};