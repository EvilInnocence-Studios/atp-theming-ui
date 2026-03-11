import { overridable } from "@core/lib/overridable";
import Markdown from 'react-markdown';
import { TextProps } from "./Text.d";
import styles from "./Text.module.scss";
import clsx from "clsx";

export const TextComponent = overridable(({className, css, markdown, inline}:TextProps) => <>
    {css && <style>{css}</style>}
    {inline
        ? <span className={clsx(styles.inlineMarkdown, className)}><Markdown>{markdown}</Markdown></span>
        : <div className={className}>
            <Markdown>{markdown}</Markdown>
        </div>
    }
</>);

