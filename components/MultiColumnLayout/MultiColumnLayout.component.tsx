import { overridable } from "@core/lib/overridable";
import {MultiColumnLayoutProps} from "./MultiColumnLayout.d";
import { Col, Row } from "antd";
import { SlotRenderer } from "../SlotRenderer";

export const MultiColumnLayoutComponent = overridable(({row, columns, className, breakpoint, css, slots, __layoutId}:MultiColumnLayoutProps) => <>
    {css && <style>{css}</style>}
    
    <Row className={className} {...row}>
        {(columns || []).map(({css, className:colClassName, ...column}, index) => <>
            {css && <style>{css}</style>}
            <Col
                key={index}
                {...column}
                className={
                    typeof colClassName === 'object' ? colClassName[breakpoint] : colClassName
                }
            >
                <SlotRenderer
                    slots={slots?.[`column-${column.id}`]}
                    parentId={__layoutId}
                    slotName={`column-${column.id}`}
                    getDisplayName={() => `Column ${index+1}`}
                />
            </Col>
        </>)}
    </Row>
</>);
