import { Editable } from "@core/components/Editable";
import { Label } from "@core/components/Label";
import { overridable } from "@core/lib/overridable";
import { faPaintRoller } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LayoutRegistry } from "@theming/lib/layout/componentRegistry";
import { Col, Row, Select } from "antd";
import { LayoutEditor, LayoutEditorProvider } from "./LayoutEditor";
import { LayoutManagerProps } from "./LayoutManager.d";
import styles from './LayoutManager.module.scss';

export const LayoutManagerComponent = overridable(({
    theme, updater, element, setElement, layout, onChange, UpdateButtons,
    classes = styles,
}:LayoutManagerProps) => {

    return <div className={classes.layoutManager}>
        <Row gutter={[16,16]}>
            <Col span={4}>
                <h1>
                    <FontAwesomeIcon icon={faPaintRoller} /> Theme Designer
                </h1>
            </Col>
            <Col span={6}>
                <Select className={classes.layoutElementSelect} options={LayoutRegistry.getOptions()} value={element} onChange={setElement} />
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
            layout={layout}
            onChange={onChange}
        >
            <LayoutEditor theme={theme} />
        </LayoutEditorProvider>
    </div>;
});
