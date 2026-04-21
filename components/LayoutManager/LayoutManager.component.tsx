import { Editable } from "@core/components/Editable";
import { Label } from "@core/components/Label";
import { overridable } from "@core/lib/overridable";
import { faPaintRoller } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ILayoutOption, LayoutRegistry } from "@theming/lib/layout/componentRegistry";
import { Button, Card, Col, Modal, Row, Tabs } from "antd";
import { useState } from "react";
import { LayoutEditor, LayoutEditorProvider } from "./LayoutEditor";
import { LayoutManagerProps } from "./LayoutManager.d";
import styles from './LayoutManager.module.scss';
import { Index } from "ts-functional/dist/types";

interface ILayoutOptionDetails extends ILayoutOption {
    complete: boolean;
}

export const LayoutManagerComponent = overridable(({
    theme, updater, element, setElement, layout, onChange, UpdateButtons,
    classes = styles,
}:LayoutManagerProps) => {
    const [isElementModalOpen, setIsElementModalOpen] = useState(false);

    const rawOptions = LayoutRegistry.getOptions();
    const options: Index<Index<ILayoutOptionDetails[]>> = rawOptions
        .reduce((acc, option) => {
            const category = option.category || "Other";
            const subCategory = option.subCategory || "Other";
            if (!acc[category]) {
                acc[category] = {};
            }
            if (!acc[category][subCategory]) {
                acc[category][subCategory] = [];
            }

            acc[category][subCategory].push({
                ...option,
                complete: theme?.json?.[option.value] !== undefined,
            });
            return acc;
        }, {} as Index<Index<ILayoutOptionDetails[]>>);

    const currentOption = rawOptions.find(o => o.value === element);

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
                    <Tabs
                        tabPosition="top"
                        items={Object.keys(options).map(category => {
                            const subCategories = options[category];
                            const allItems = Object.values(subCategories).flat();
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
                                                                    className={`${classes.optionItem} ${item.value === element ? classes.selectedOption : ''}`}
                                                                    style={{ color: item.complete ? '#5cb85c' : '#d9534f' }}
                                                                    onClick={() => { setElement(item.value); setIsElementModalOpen(false); }}
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
