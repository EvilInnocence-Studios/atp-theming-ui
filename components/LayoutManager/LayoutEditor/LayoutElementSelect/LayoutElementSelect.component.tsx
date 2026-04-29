import { overridable } from "@core/lib/overridable";
import { Button, Card, Col, Modal, Row, Tabs } from "antd";
import { ILayoutOptionDetails, LayoutElementSelectProps } from "./LayoutElementSelect.d";
import styles from './LayoutElementSelect.module.scss';
import { Index } from "ts-functional/dist/types";

export const LayoutElementSelectComponent = overridable(({
    classes = styles,
    selectedElement, onSelect,
    currentOption, options, modal,
}:LayoutElementSelectProps) => <>
    <Button 
        className={classes.layoutElementSelect} 
        onClick={modal.open}
    >
        <div style={{ textAlign: "left", width: "100%" }}>
            {currentOption ? currentOption.label : "Select Layout Element"}
        </div>
    </Button>
    <Modal
        title="Select Layout Element"
        open={modal.visible}
        onCancel={modal.close}
        footer={null}
        width={1000}
    >
        <Tabs
            tabPosition="top"
            items={Object.keys(options).map(category => {
                const subCategories:Index<ILayoutOptionDetails[]> = options[category];
                const allItems = Object.values<ILayoutOptionDetails[]>(subCategories).flat();
                const total = allItems.length;
                const complete = allItems.filter(i => i.complete).length;
                const color = total === 0 ? "inherit" : complete === total ? "#5cb85c" : complete === 0 ? "#d9534f" : "#f0ad4e";

                return {
                    key: category,
                    label: <span style={{ color }}>{category} ({complete}/{total})</span>,
                    children: (
                        <Tabs
                            tabPosition="left"
                            items={Object.keys(subCategories).map(subCategory => {
                                const items = subCategories[subCategory];
                                const subTotal = items.length;
                                const subComplete = items.filter(i => i.complete).length;
                                const subColor = subTotal === 0 ? "inherit" : subComplete === subTotal ? "#5cb85c" : subComplete === 0 ? "#d9534f" : "#f0ad4e";

                                return {
                                    key: subCategory,
                                    label: <span style={{ color: subColor }}>{subCategory} ({subComplete}/{subTotal})</span>,
                                    children: (
                                        <Row
                                            gutter={[16,16]}
                                            className={classes.optionList}
                                        >
                                            {items.map(item => (
                                                <Col
                                                    span={8}
                                                    key={item.value}
                                                >
                                                    <Card
                                                        className={`${classes.optionItem} ${item.value === selectedElement ? classes.selectedOption : ''}`}
                                                        style={{ color: item.complete ? '#5cb85c' : '#d9534f' }}
                                                        onClick={() => { onSelect(item.value); modal.close(); }}
                                                    >
                                                        {item.label}
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    )
                                };
                            })}
                        />
                    )
                };
            })}
        />
    </Modal>
</>);
