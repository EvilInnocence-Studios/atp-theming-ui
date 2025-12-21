import { faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { Index } from "ts-functional/dist/types";

export const themingMenus:Index<ItemType<MenuItemType>[]> = {
    admin: [{
        key: "theme",
        label: "Themes",
        icon: <FontAwesomeIcon icon={faTableCells} />,
    }],
};
