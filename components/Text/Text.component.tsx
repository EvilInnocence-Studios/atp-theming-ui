import { overridable } from "@core/lib/overridable";
import Markdown from 'react-markdown';
import { TextProps } from "./Text.d";

export const TextComponent = overridable(({className, css, markdown}:TextProps) => <>
    {css && <style>{css}</style>}
    <div className={className}>
        <Markdown>{markdown}</Markdown>
    </div>
</>);

