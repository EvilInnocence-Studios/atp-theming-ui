import { overridable } from "@core/lib/overridable";
import { Select } from "antd";
import { ThemeSwitcherProps } from "./ThemeSwitcher.d";

export const ThemeSwitcherComponent = overridable(({className, css, themes, currentThemeId, onChange}:ThemeSwitcherProps) => <>
    {css && <style>{css}</style>}
    <Select className={className} value={currentThemeId} onChange={onChange}>
        {themes.map(t => <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>)}
    </Select>
</>);

