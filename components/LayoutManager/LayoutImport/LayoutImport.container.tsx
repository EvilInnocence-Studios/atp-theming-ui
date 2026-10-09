import { flash } from "@core/lib/flash";
import { overridable } from "@core/lib/overridable";
import { ILayoutComponent } from "@theming/lib/layout/layout";
import { ensureIds } from "@theming/lib/layout/utils";
import JSZip from "jszip";
import { useMemo, useRef, useState } from "react";
import { createInjector, inject, mergeProps } from "unstateless";
import { LayoutImportComponent } from "./LayoutImport.component";
import { ILayoutImportInputProps, ILayoutImportProps, LayoutImportProps } from "./LayoutImport.d";
import { extractLayoutElements } from "./util";

const injectLayoutImportProps = createInjector(({ theme, onImport }: ILayoutImportInputProps): ILayoutImportProps => {
    const [modalStep, setModalStep] = useState<'none' | 'select' | 'confirm'>('none');
    const [fileName, setFileName] = useState<string>('');
    const [fileElements, setFileElements] = useState<Record<string, ILayoutComponent>>({});
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const overwrittenKeys = useMemo(() => {
        return selectedKeys.filter(key => theme?.json && theme.json[key] !== undefined);
    }, [selectedKeys, theme]);

    const newKeys = useMemo(() => {
        return selectedKeys.filter(key => !theme?.json || theme.json[key] === undefined);
    }, [selectedKeys, theme]);

    const onTriggerFilePrompt = () => {
        fileInputRef.current?.click();
    };

    const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            let elements: Record<string, ILayoutComponent> = {};

            if (file.name.endsWith('.zip')) {
                const zip = await JSZip.loadAsync(file);
                const themeJsonFile = zip.file("theme.json");
                if (!themeJsonFile) {
                    flash.error("Invalid theme archive: theme.json not found inside zip")();
                    return;
                }
                const text = await themeJsonFile.async("string");
                const parsed = JSON.parse(text);
                elements = extractLayoutElements(parsed);
            } else {
                const text = await file.text();
                const parsed = JSON.parse(text);
                elements = extractLayoutElements(parsed);
            }

            const keys = Object.keys(elements);
            if (keys.length === 0) {
                flash.error("No valid layout elements found in the uploaded theme file")();
                return;
            }

            setFileElements(elements);
            setFileName(file.name);
            setSelectedKeys(keys); // Select all by default
            setModalStep('select');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Invalid format';
            flash.error(`Failed to read theme file: ${message}`)();
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const onSelectAll = () => {
        setSelectedKeys(Object.keys(fileElements));
    };

    const onDeselectAll = () => {
        setSelectedKeys([]);
    };

    const onSelectOnlyNew = () => {
        const onlyNew = Object.keys(fileElements).filter(
            key => !theme?.json || theme.json[key] === undefined
        );
        setSelectedKeys(onlyNew);
    };

    const onToggleKey = (key: string) => {
        setSelectedKeys(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const onProceedToConfirm = () => {
        if (selectedKeys.length === 0) return;
        setModalStep('confirm');
    };

    const onBackToSelect = () => {
        setModalStep('select');
    };

    const onConfirmImport = () => {
        const importedLayouts: Record<string, ILayoutComponent> = {};
        for (const key of selectedKeys) {
            if (fileElements[key]) {
                importedLayouts[key] = ensureIds(fileElements[key]);
            }
        }

        onImport(importedLayouts);
        flash.success(`Imported ${selectedKeys.length} layout element(s) successfully`)();
        onClose();
    };

    const onClose = () => {
        setModalStep('none');
        setFileElements({});
        setSelectedKeys([]);
        setFileName('');
    };

    return {
        modalStep,
        fileName,
        fileElements,
        selectedKeys,
        overwrittenKeys,
        newKeys,
        onSelectAll,
        onDeselectAll,
        onSelectOnlyNew,
        onToggleKey,
        onTriggerFilePrompt,
        onFileSelected,
        onProceedToConfirm,
        onBackToSelect,
        onConfirmImport,
        onClose,
        fileInputRef,
    };
});

const connect = inject<ILayoutImportInputProps, LayoutImportProps>(mergeProps(
    injectLayoutImportProps,
));

export const LayoutImport = overridable<ILayoutImportInputProps>(connect(LayoutImportComponent));
