import { overridable } from "@core/lib/overridable";
import { faArrowLeft, faCheck, faFileImport, faPlus, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LayoutRegistry } from "@theming/lib/layout/componentRegistry";
import { Alert, Button, Checkbox, ConfigProvider, List, Modal, Space, Tag, theme as antdTheme } from "antd";
import { LayoutImportProps } from "./LayoutImport.d";
import styles from "./LayoutImport.module.scss";

export const LayoutImportComponent = overridable(({
    modalStep,
    fileName,
    fileElements,
    selectedKeys,
    overwrittenKeys,
    newKeys,
    theme,
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
    classes = styles,
}: LayoutImportProps) => {
    const allFileKeys = Object.keys(fileElements);

    const darkModalStyles = {
        content: { backgroundColor: '#141414', color: '#e6e6e6' },
        header: { backgroundColor: '#141414' },
    };

    return <>
        <Button
            icon={<FontAwesomeIcon icon={faFileImport} />}
            onClick={onTriggerFilePrompt}
        >
            Import
        </Button>
        <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json,.zip"
            style={{ display: "none" }}
            onChange={onFileSelected}
        />

        <ConfigProvider
            theme={{
                algorithm: antdTheme.darkAlgorithm,
                token: {
                    colorBgElevated: '#141414',
                    colorBgContainer: '#141414',
                    colorBgBase: '#141414',
                    colorText: '#e6e6e6',
                    colorTextHeading: '#ffffff',
                    colorBorder: '#303030',
                },
            }}
        >
            {/* Step 1: Select which layout elements to import */}
            <Modal
                className={classes.modalRoot}
                styles={darkModalStyles}
                title={
                    <Space>
                        <FontAwesomeIcon icon={faFileImport} />
                        <span>Select Layout Elements to Import</span>
                    </Space>
                }
                open={modalStep === 'select'}
                onCancel={onClose}
                width={720}
                footer={[
                    <Button key="cancel" onClick={onClose}>
                        Cancel
                    </Button>,
                    <Button
                        key="proceed"
                        type="primary"
                        disabled={selectedKeys.length === 0}
                        onClick={onProceedToConfirm}
                    >
                        Continue ({selectedKeys.length} selected)
                    </Button>,
                ]}
            >
                <div className={classes.fileInfo}>
                    <div>Theme file: <strong>{fileName}</strong></div>
                    <small style={{ color: '#8c8c8c' }}>
                        Select which layout elements from this file you would like to import into your current theme.
                    </small>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Space>
                        <Button size="small" onClick={onSelectAll}>Select All</Button>
                        <Button size="small" onClick={onDeselectAll}>Deselect All</Button>
                        <Button size="small" onClick={onSelectOnlyNew}>Select Only New</Button>
                    </Space>
                    <span style={{ color: '#8c8c8c' }}>
                        {selectedKeys.length} of {allFileKeys.length} selected
                    </span>
                </div>

                <div className={classes.elementList}>
                    {allFileKeys.map(key => {
                        const isSelected = selectedKeys.includes(key);
                        const willOverwrite = theme?.json && theme.json[key] !== undefined;
                        const reg = LayoutRegistry.get(key);

                        return (
                            <div
                                key={key}
                                className={`${classes.elementItem} ${isSelected ? classes.elementItemActive : ''} ${willOverwrite ? classes.elementItemWarning : ''}`}
                                onClick={() => onToggleKey(key)}
                            >
                                <Space>
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={() => onToggleKey(key)}
                                        onClick={e => e.stopPropagation()}
                                    />
                                    <strong>{reg?.displayName || key}</strong>
                                    <code className={classes.elementCode}>({key})</code>
                                    {reg?.category && (
                                        <Tag style={{ marginLeft: 4 }}>
                                            {reg.category}{reg.subCategory ? ` / ${reg.subCategory}` : ''}
                                        </Tag>
                                    )}
                                </Space>
                                <Space>
                                    {willOverwrite ? (
                                        <Tag color="warning" icon={<FontAwesomeIcon icon={faTriangleExclamation} />}>
                                            Will Overwrite
                                        </Tag>
                                    ) : (
                                        <Tag color="success" icon={<FontAwesomeIcon icon={faPlus} />}>
                                            New
                                        </Tag>
                                    )}
                                </Space>
                            </div>
                        );
                    })}
                </div>

                {overwrittenKeys.length > 0 && (
                    <Alert
                        style={{ marginTop: 14 }}
                        type="warning"
                        showIcon
                        message={`${overwrittenKeys.length} of the selected layout elements already exist in this theme and will be overwritten.`}
                    />
                )}
            </Modal>

            {/* Step 2: Confirmation modal showing overwritten elements */}
            <Modal
                className={classes.modalRoot}
                styles={darkModalStyles}
                title={
                    <Space>
                        <FontAwesomeIcon
                            icon={overwrittenKeys.length > 0 ? faTriangleExclamation : faCheck}
                            style={{ color: overwrittenKeys.length > 0 ? '#faad14' : '#52c41a' }}
                        />
                        <span>Confirm Layout Import</span>
                    </Space>
                }
                open={modalStep === 'confirm'}
                onCancel={onClose}
                width={680}
                footer={[
                    <Button key="back" icon={<FontAwesomeIcon icon={faArrowLeft} />} onClick={onBackToSelect}>
                        Back
                    </Button>,
                    <Button key="cancel" onClick={onClose}>
                        Cancel
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        danger={overwrittenKeys.length > 0}
                        onClick={onConfirmImport}
                    >
                        {overwrittenKeys.length > 0 ? 'Overwrite & Import' : 'Confirm Import'}
                    </Button>,
                ]}
            >
                {overwrittenKeys.length > 0 ? (
                    <>
                        <Alert
                            type="warning"
                            showIcon
                            message={`Warning: ${overwrittenKeys.length} layout element(s) will be overwritten`}
                            description="The following layout elements already exist in your theme. Importing will overwrite their current configuration with the imported layouts:"
                            style={{ marginBottom: 16 }}
                        />
                        <div className={classes.sectionTitle}>
                            Layout elements to be overwritten:
                        </div>
                        <List
                            size="small"
                            bordered
                            dataSource={overwrittenKeys}
                            renderItem={key => {
                                const reg = LayoutRegistry.get(key);
                                return (
                                    <List.Item className={classes.overwriteItem}>
                                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                            <Space>
                                                <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: '#d46b08' }} />
                                                <strong>{reg?.displayName || key}</strong>
                                                <code className={classes.elementCode}>({key})</code>
                                                {reg?.category && (
                                                    <Tag>{reg.category}{reg.subCategory ? ` / ${reg.subCategory}` : ''}</Tag>
                                                )}
                                            </Space>
                                            <Tag color="volcano">Will Overwrite</Tag>
                                        </Space>
                                    </List.Item>
                                );
                            }}
                        />
                    </>
                ) : (
                    <Alert
                        type="info"
                        showIcon
                        message="No existing layout elements will be overwritten"
                        description={`All ${newKeys.length} selected layout element(s) are new and will be safely imported into this theme.`}
                        style={{ marginBottom: 16 }}
                    />
                )}

                {newKeys.length > 0 && (
                    <>
                        <div className={classes.sectionTitle} style={{ marginTop: 16 }}>
                            New layout elements to be added ({newKeys.length}):
                        </div>
                        <List
                            size="small"
                            bordered
                            dataSource={newKeys}
                            renderItem={key => {
                                const reg = LayoutRegistry.get(key);
                                return (
                                    <List.Item>
                                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                            <Space>
                                                <FontAwesomeIcon icon={faPlus} style={{ color: '#52c41a' }} />
                                                <span>{reg?.displayName || key}</span>
                                                <code className={classes.elementCode}>({key})</code>
                                                {reg?.category && (
                                                    <Tag>{reg.category}{reg.subCategory ? ` / ${reg.subCategory}` : ''}</Tag>
                                                )}
                                            </Space>
                                            <Tag color="green">New</Tag>
                                        </Space>
                                    </List.Item>
                                );
                            }}
                        />
                    </>
                )}
            </Modal>
        </ConfigProvider>
    </>;
});
