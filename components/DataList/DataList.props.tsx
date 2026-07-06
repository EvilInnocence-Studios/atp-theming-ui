import { onInputChange } from "@core/lib/onInputChange";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Checkbox, DatePicker, Input, InputNumber, Modal, Select, Space, Table, TimePicker } from "antd";
import dayjs from "dayjs";
import { useState, useMemo, useRef } from "react";
import { IDataListColumn, IDataListInputProps } from "./DataList.d";
import { MarkdownEditor } from "@core/components/MarkdownEditor";
import { MediaPicker } from "@common/components/MediaPicker";

export const DataListPropEditor = (
    { columns, data }: IDataListInputProps,
    _updateProps: (props: any) => void,
    updateProp: (prop: string) => (value: any) => void
) => {
    const cols = columns || [];
    const rows = data || [];
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Keep rows updated in a ref to prevent stale closures in useMemo
    const rowsRef = useRef(rows);
    rowsRef.current = rows;

    const addColumn = () => {
        const newCol: IDataListColumn = {
            name: "",
            label: "",
            dataType: "text",
        };
        updateProp("columns")([...cols, newCol]);
    };

    const updateColumn = (index: number, updatedFields: Partial<IDataListColumn>) => {
        const updatedColumns = cols.map((col, i) => {
            if (i === index) {
                return { ...col, ...updatedFields };
            }
            return col;
        });
        updateProp("columns")(updatedColumns);
    };

    const removeColumn = (index: number) => {
        const updatedColumns = cols.filter((_, i) => i !== index);
        updateProp("columns")(updatedColumns);
    };

    const addRow = () => {
        updateProp("data")([...rowsRef.current, {}]);
    };

    const updateCell = (rowIndex: number, colName: string, value: any) => {
        const updatedData = rowsRef.current.map((row, i) => {
            if (i === rowIndex) {
                return { ...row, [colName]: value };
            }
            return row;
        });
        updateProp("data")(updatedData);
    };

    const removeRow = (rowIndex: number) => {
        const updatedData = rowsRef.current.filter((_, i) => i !== rowIndex);
        updateProp("data")(updatedData);
    };

    const activeCols = cols.filter(col => !!col.name);

    const safeDayjs = (val: string, format?: string) => {
        if (!val) return null;
        const d = format ? dayjs(val, format) : dayjs(val);
        return d.isValid() ? d : null;
    };

    const renderEditor = (column: IDataListColumn, record: any, rowIndex: number) => {
        const colName = column.name;
        const value = record[colName];

        switch (column.dataType) {
            case "markdown":
                return <>
                    <style>
                        .dataListMarkdownEditor .mdxeditor {"{"}
                            max-width: 512px;
                        {"}"}
                    </style>
                    <div className="dataListMarkdownEditor">
                        <MarkdownEditor
                            value={value || ""}
                            onChange={(val) => updateCell(rowIndex, colName, val)}
                        />
                    </div>
                </>;
            case "number":
                return (
                    <InputNumber
                        value={value !== undefined && value !== null ? value : undefined}
                        onChange={(val) => updateCell(rowIndex, colName, val)}
                        style={{ width: '100%' }}
                    />
                );
            case "boolean":
                return (
                    <Checkbox
                        checked={!!value}
                        onChange={(e) => updateCell(rowIndex, colName, e.target.checked)}
                    />
                );
            case "date":
                return (
                    <DatePicker
                        value={safeDayjs(value)}
                        onChange={(date, dateString) => updateCell(rowIndex, colName, typeof dateString === 'string' ? dateString : date?.format("YYYY-MM-DD") || "")}
                        style={{ width: '100%' }}
                    />
                );
            case "datetime":
                return (
                    <DatePicker
                        showTime
                        value={safeDayjs(value)}
                        onChange={(date) => updateCell(rowIndex, colName, date ? date.toISOString() : "")}
                        style={{ width: '100%' }}
                    />
                );
            case "time":
                return (
                    <TimePicker
                        value={safeDayjs(value, "HH:mm:ss")}
                        onChange={(time, timeString) => updateCell(rowIndex, colName, typeof timeString === 'string' ? timeString : time?.format("HH:mm:ss") || "")}
                        style={{ width: '100%' }}
                    />
                );
            case "image":
                return (
                    <MediaPicker
                        imageId={value || ""}
                        onSelect={(newImageId) => updateCell(rowIndex, colName, newImageId)}
                        small
                    />
                );
            case "text":
            default:
                return (
                    <Input
                        value={value || ""}
                        onChange={onInputChange((val) => updateCell(rowIndex, colName, val))}
                    />
                );
        }
    };

    const tableColumns = useMemo(() => {
        return [
            ...activeCols.map(col => ({
                title: col.label || col.name,
                dataIndex: col.name,
                key: col.name,
                render: (_value: any, record: any, index: number) => {
                    return renderEditor(col, record, index);
                }
            })),
            {
                title: "Actions",
                key: "action",
                width: 80,
                align: 'center' as const,
                render: (_value: any, _record: any, index: number) => (
                    <Button
                        onClick={() => removeRow(index)}
                        danger
                        icon={<FontAwesomeIcon icon={faTrash} />}
                    />
                )
            }
        ];
    }, [activeCols]);

    return <>
        <Card size="small" title="Columns">
            <div style={{ marginBottom: 12 }}>
                {cols.map((column, index) => (
                    <div key={index} style={{ marginBottom: 8 }}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="Column Name"
                                value={column.name || ""}
                                onChange={onInputChange((val) => updateColumn(index, { name: val }))}
                                style={{ width: '30%' }}
                            />
                            <Input
                                placeholder="Label"
                                value={column.label || ""}
                                onChange={onInputChange((val) => updateColumn(index, { label: val }))}
                                style={{ width: '35%' }}
                            />
                            <Select
                                placeholder="Type"
                                value={column.dataType || "text"}
                                onChange={(val: IDataListColumn['dataType']) => updateColumn(index, { dataType: val })}
                                style={{ width: '25%' }}
                            >
                                <Select.Option value="text">Text</Select.Option>
                                <Select.Option value="markdown">Markdown</Select.Option>
                                <Select.Option value="number">Number</Select.Option>
                                <Select.Option value="boolean">Boolean</Select.Option>
                                <Select.Option value="date">Date</Select.Option>
                                <Select.Option value="datetime">Datetime</Select.Option>
                                <Select.Option value="time">Time</Select.Option>
                                <Select.Option value="image">Image</Select.Option>
                            </Select>
                            <Button
                                onClick={() => removeColumn(index)}
                                danger
                                style={{ width: '10%' }}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </Space.Compact>
                    </div>
                ))}
            </div>
            <Button onClick={addColumn} type="dashed" block>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
                Add Column
            </Button>
        </Card>

        <Button
            onClick={() => setIsModalOpen(true)}
            type="primary"
            block
            style={{ marginTop: 12 }}
            icon={<FontAwesomeIcon icon={faEdit} />}
        >
            Edit Data
        </Button>

        <Modal
            title="Edit Data List"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={[
                <Button key="close" onClick={() => setIsModalOpen(false)}>
                    Close
                </Button>
            ]}
            width="90vw"
            style={{ top: 20 }}
        >
            <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 }}>
                <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={addRow} type="primary" icon={<FontAwesomeIcon icon={faPlus} />}>
                        Add Row
                    </Button>
                </div>

                {activeCols.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 24, color: '#999' }}>
                        No active columns defined. Please define columns (with Name) first.
                    </div>
                ) : (
                    <Table
                        dataSource={rows}
                        columns={tableColumns}
                        pagination={false}
                        rowKey={(_, index) => String(index)}
                        size="small"
                    />
                )}
            </div>
        </Modal>
    </>;
}

