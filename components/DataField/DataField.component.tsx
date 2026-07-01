import { overridable } from "@core/lib/overridable";
import { DataFieldProps } from "./DataField.d";
import Markdown from "marked-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { MediaImage } from "@common/components/MediaImage";
import dayjs from "dayjs";

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
                return String(value);
            case "date": {
                const d = dayjs(value);
                return d.isValid() ? d.format('MMMM D, YYYY') : String(value);
            }
            case "datetime": {
                const d = dayjs(value);
                return d.isValid() ? d.format('MMMM D, YYYY h:mm A') : String(value);
            }
            case "time": {
                const strVal = String(value);
                const timeMatch = strVal.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
                if (timeMatch) {
                    let hours = parseInt(timeMatch[1], 10);
                    const minutes = timeMatch[2];
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    return `${hours}:${minutes} ${ampm}`;
                }
                const d = dayjs(value);
                return d.isValid() ? d.format('h:mm A') : strVal;
            }
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

