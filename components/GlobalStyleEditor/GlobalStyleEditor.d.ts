import { ITheme } from "@theming-shared/theme/types";
import { IUpdater } from "@core/lib/useUpdater";

export declare interface IGlobalStyleEditorProps {

}

// What gets passed into the component from the parent as attributes
export declare interface IGlobalStyleEditorInputProps {
    classes?: any;
    theme: ITheme | null;
    updater: IUpdater<ITheme> | null;
}

export type GlobalStyleEditorProps = IGlobalStyleEditorInputProps & IGlobalStyleEditorProps;