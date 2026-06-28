import { overridable } from "@core/lib/overridable";
import {DataListNewProps} from "./DataListNew.d";
import styles from './DataListNew.module.scss';

export const DataListNewComponent = overridable(({classes = styles, slots, __layoutId, className, css}:DataListNewProps) => <>
    {css && <style>{css}</style>}
    <div className={className}>DataListNew component goes here.</div>
</>);

