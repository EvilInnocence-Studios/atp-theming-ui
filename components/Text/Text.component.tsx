import { overridable } from "@core/lib/overridable";
import Markdown from 'react-markdown';
import { TextProps } from "./Text.d";
import styles from "./Text.module.scss";
import clsx from "clsx";

export const TextComponent = overridable(({className, css, markdown, inline, raw}:TextProps) => <>
    {css && <style>{css}</style>}
    {inline
        ? <span className={clsx(styles.inlineMarkdown, className)}>
            {raw ? markdown : <Markdown>{markdown}</Markdown>}
        </span>
        : <div className={className}>
            {raw ? markdown : <Markdown>{markdown}</Markdown>}
        </div>
    }
</>);

