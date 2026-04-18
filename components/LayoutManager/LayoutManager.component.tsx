import { Editable } from "@core/components/Editable";
import { Label } from "@core/components/Label";
import { overridable } from "@core/lib/overridable";
import { faPaintRoller } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LayoutRegistry } from "@theming/lib/layout/componentRegistry";
import { Button, Col, Modal, Row } from "antd";
import { useState } from "react";
import { LayoutEditor, LayoutEditorProvider } from "./LayoutEditor";
import { LayoutManagerProps } from "./LayoutManager.d";
import styles from './LayoutManager.module.scss';

export const LayoutManagerComponent = overridable(({
    theme, updater, element, setElement, layout, onChange, UpdateButtons,
    classes = styles,
}:LayoutManagerProps) => {
    const [isElementModalOpen, setIsElementModalOpen] = useState(false);

    const options = LayoutRegistry.getOptions();
    const currentOption = options.find(o => o.value === element);

    return <div className={classes.layoutManager}>
        <Row gutter={[16,16]}>
            <Col span={4}>
                <h1>
                    <FontAwesomeIcon icon={faPaintRoller} /> Theme Designer
                </h1>
            </Col>
            <Col span={6}>
                <Button 
                    className={classes.layoutElementSelect} 
                    onClick={() => setIsElementModalOpen(true)}
                >
                    <div style={{ textAlign: "left", width: "100%" }}>
                        {currentOption ? currentOption.label : "Select Layout Element"}
                    </div>
                </Button>
                <Modal
                    title="Select Layout Element"
                    open={isElementModalOpen}
                    onCancel={() => setIsElementModalOpen(false)}
                    footer={null}
                    width={1000}
                >
                    <Row
                        gutter={[16,16]}
                        className={classes.optionList}
                    >
                        {options.map(item => (
                            <Col
                                span={8}
                                key={item.value}
                            >
                                <div
                                    className={`${classes.optionItem} ${item.value === element ? classes.selectedOption : ''}`}
                                    onClick={() => { setElement(item.value); setIsElementModalOpen(false); }}
                                >
                                    {item.label}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Modal>
            </Col>
            <Col span={8}>
                {theme && updater && <Label label="Theme Name"><Editable value={theme.name || ""} onChange={updater.updateString("name")} /></Label>}
            </Col>
            <Col span={6}>
                <div className={classes.header}>
                    <UpdateButtons />
                </div>
            </Col>
        </Row>
        <hr />
        <LayoutEditorProvider
            key={element}
            layout={layout}
            onChange={onChange}
        >
            <LayoutEditor theme={theme} />
        </LayoutEditorProvider>
    </div>;
});
