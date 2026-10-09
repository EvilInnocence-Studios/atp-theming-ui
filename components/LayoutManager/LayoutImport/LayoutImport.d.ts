import { ITheme } from "@theming-shared/theme/types";
import { ILayoutComponent } from "@theming/lib/layout/layout";

export declare interface ILayoutImportInputProps {
    theme: ITheme | null;
    onImport: (importedLayouts: Record<string, ILayoutComponent>) => void;
    classes?: Record<string, string>;
}

export declare interface ILayoutImportProps {
    modalStep: 'none' | 'select' | 'confirm';
    fileName: string;
    fileElements: Record<string, ILayoutComponent>;
    selectedKeys: string[];
    overwrittenKeys: string[];
    newKeys: string[];
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onSelectOnlyNew: () => void;
    onToggleKey: (key: string) => void;
    onTriggerFilePrompt: () => void;
    onFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onProceedToConfirm: () => void;
    onBackToSelect: () => void;
    onConfirmImport: () => void;
    onClose: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export type LayoutImportProps = ILayoutImportInputProps & ILayoutImportProps;
