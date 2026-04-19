import { overridable } from "@core/lib/overridable";
import clsx from "clsx";
import { SlotRenderer } from "../SlotRenderer";
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher.container";
import { ThemeSwitcherBarProps } from "./ThemeSwitcherBar.d";
import styles from './ThemeSwitcherBar.module.scss';

export const ThemeSwitcherBarComponent = overridable(({classes = styles, slots, __layoutId, className, css}:ThemeSwitcherBarProps) => <>
    {css && <style>{css}</style>}
    <div className={clsx(className, "themeSwitcherBar", classes.themeSwitcherBar)}>
        <div className="extra">
            <SlotRenderer slots={slots?.extra} slotName="extra" parentId={__layoutId} />
        </div>
        <div className="switcher">
            <span>Choose a theme: </span>
            <ThemeSwitcher />
        </div>
    </div>
</>);

