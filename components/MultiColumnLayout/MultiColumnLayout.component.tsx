import { overridable } from "@core/lib/overridable";
import {MultiColumnLayoutProps} from "./MultiColumnLayout.d";
import { Col, Row } from "antd";
import { SlotRenderer } from "../SlotRenderer";

export const MultiColumnLayoutComponent = overridable(({row, columns, className, css, slots, __layoutId}:MultiColumnLayoutProps) => <>
    {css && <style>{css}</style>}
    
    <Row className={className} {...row}>
        {(columns || []).map((column, index) => <>
            {column.css && <style>{column.css}</style>}
            <Col key={index} {...column} className={column.className}>
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
