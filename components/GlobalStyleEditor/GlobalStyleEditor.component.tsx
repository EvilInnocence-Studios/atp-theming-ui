import { overridable } from "@core/lib/overridable";
import {GlobalStyleEditorProps} from "./GlobalStyleEditor.d";
import styles from './GlobalStyleEditor.module.scss';
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette } from "@fortawesome/free-solid-svg-icons";

export const GlobalStyleEditorComponent = overridable(({classes = styles}:GlobalStyleEditorProps) => <>
    <Button><FontAwesomeIcon icon={faPalette} /> Global Style Editor</Button>
</>);
