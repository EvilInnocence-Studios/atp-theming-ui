import { ClearCacheButton } from "@common/components/ClearCacheButton";
import { overridable } from "@core/lib/overridable";
import { faFileImport, faPlus, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Row, Spin, Upload } from "antd";
import { ThemeListItem } from "../ThemeListItem";
import { ThemeManagerProps } from "./ThemeManager.d";
import styles from './ThemeManager.module.scss';

export const ThemeManagerComponent = overridable(({classes = styles, create, themes, isLoading, importTheme, refresh, defaultThemeId, setDefaultTheme}:ThemeManagerProps) =>
    <Spin spinning={isLoading}>
        <div className={classes.themeManager}>
            <Row>
                <Col xs={6}>
                    <h1>
                        <FontAwesomeIcon icon={faTableCells} /> Theme Manager
                        &nbsp;
                        <Button type="primary" onClick={create}><FontAwesomeIcon icon={faPlus} /> Create Theme</Button>
                    </h1>
                </Col>
                <Col xs={12}>
                    <Upload.Dragger customRequest={({file}) => importTheme(file as File)} showUploadList={false}>
                        <FontAwesomeIcon icon={faFileImport} />  Import theme
                    </Upload.Dragger>
                </Col>
                <Col xs={6} className={classes.clearCacheButton}>
                    <ClearCacheButton entity="theme" cacheType="theme" />
                </Col>
            </Row>
            <div className={classes.themeList}>
                {themes.map(theme => (
                    <ThemeListItem key={theme.id} theme={theme} refresh={refresh} defaultThemeId={defaultThemeId} setDefaultTheme={setDefaultTheme} />
                ))}
            </div>
        </div>
    </Spin>
);
