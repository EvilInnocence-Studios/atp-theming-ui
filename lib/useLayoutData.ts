import { Index } from "ts-functional/dist/types";
import { useSharedState } from "unstateless";

const useLayoutDataRaw = useSharedState<Index<any>>({});

export const useLayoutData = <T>(index: string): [T, (value: T) => void] => {
    const [data, setDataState] = useLayoutDataRaw();

    const setData = (value: T) => {
        if (data[index] !== value) {
            setDataState(prev => ({ ...prev, [index]: value }));
        }
    };

    return [data[index], setData];
}