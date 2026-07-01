import { overridable } from "@core/lib/overridable";
import { DataFieldProps } from "./DataField.d";
import Markdown from "marked-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { MediaImage } from "@common/components/MediaImage";

export const DataFieldComponent = overridable(({ className, css, dataType, value }: DataFieldProps) => {
    const renderValue = () => {
        if (value === undefined || value === null) {
            return null;
        }

        switch (dataType) {
            case "markdown":
                return <Markdown>{String(value)}</Markdown>;
            case "image":
                return <MediaImage imageId={String(value)} className={className} />;
            case "boolean":
                return <FontAwesomeIcon icon={value ? faCheck : faXmark} />;
            case "number":
            case "date":
            case "datetime":
            case "time":
            default:
                return String(value);
        }
    };

    return <>
        {css && <style>{css}</style>}
        {dataType === "image" ? (
            renderValue()
        ) : dataType === "markdown" ? (
            <div className={className}>{renderValue()}</div>
        ) : (
            <span className={className}>
                {renderValue()}
            </span>
        )}
    </>;
});

