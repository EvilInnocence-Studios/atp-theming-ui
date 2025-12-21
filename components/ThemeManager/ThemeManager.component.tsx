import { ClearCacheButton } from "@common/components/ClearCacheButton";
import { overridable } from "@core/lib/overridable";
import { faPlus, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Spin } from "antd";
import { ThemeListItem } from "../ThemeListItem";
import { ThemeManagerProps } from "./ThemeManager.d";
import styles from './ThemeManager.module.scss';

export const ThemeManagerComponent = overridable(({classes = styles, create, themes, isLoading, refresh, defaultThemeId, setDefaultTheme}:ThemeManagerProps) =>
    <Spin spinning={isLoading}>
        <div className={classes.themeManager}>
            <div style={{float: "right"}}>
                <ClearCacheButton entity="theme" cacheType="theme" />
            </div>
            <h1>
                <FontAwesomeIcon icon={faTableCells} /> Theme Manager
                &nbsp;
                <Button type="primary" onClick={create}><FontAwesomeIcon icon={faPlus} /> Create Theme</Button>
            </h1>
            <div className={classes.themeList}>
                {themes.map(theme => (
                    <ThemeListItem key={theme.id} theme={theme} refresh={refresh} defaultThemeId={defaultThemeId} setDefaultTheme={setDefaultTheme} />
                ))}
            </div>
        </div>
    </Spin>
);
