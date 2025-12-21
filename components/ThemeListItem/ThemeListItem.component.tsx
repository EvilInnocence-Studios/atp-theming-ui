import { Editable } from "@core/components/Editable";
import { S3Image } from "@core/components/S3Image";
import { overridable } from "@core/lib/overridable";
import { faPaintRoller, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Space, Switch, Upload } from "antd";
import { ThemeListItemProps } from "./ThemeListItem.d";
import styles from './ThemeListItem.module.scss';
import { Link } from "react-router";
import { DeleteBtn } from "@core/components/DeleteBtn";

export const ThemeListItemComponent = overridable(({classes = styles, theme, updateString, updateToggle, upload, remove, defaultThemeId, setDefaultTheme}:ThemeListItemProps) =>
    <div className={classes.themeListItem}>
        <Space align="baseline">
            <h2>
                <Editable value={theme.name} onChange={updateString("name")} />
            </h2>
            <Button size="small" type={theme.id === defaultThemeId ? "primary" : "default"} onClick={setDefaultTheme(theme.id)}>
                Default
            </Button>
            <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" checked={theme.enabled} onChange={updateToggle("enabled")} />
            <DeleteBtn entityType="theme" onClick={remove} />
        </Space>
        {theme.imageUrl && <S3Image folderSetting="themeThumbnailFolder" fileName={theme.imageUrl} />}
        <Upload.Dragger className={classes.upload} customRequest={({ file }) => upload(file as File)} showUploadList={false}>
            <FontAwesomeIcon icon={faUpload} /> Upload Thumbnail
        </Upload.Dragger>
        <Button type="primary" size="large">
            <Link to={`/theme/${theme.id}`}>
                <FontAwesomeIcon icon={faPaintRoller} /> Design
            </Link>
        </Button>
        <Editable textArea value={theme.description} onChange={updateString("description")} />
    </div>
);
