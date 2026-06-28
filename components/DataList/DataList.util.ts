import { createContext } from "react";
import { IDataListColumn } from "./DataList";

export declare interface IDataListContext {
    columns: IDataListColumn[];
    row: {};
}

export const DataListContext = createContext<IDataListContext>({columns: [], row: {}});

