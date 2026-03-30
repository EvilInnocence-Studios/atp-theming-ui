import { Select } from "antd";
import { IContainerInputProps } from "./Container.d";

export const ContainerPropEditor = (
    { element }: IContainerInputProps,
    _updateProps: (props: any) => void,
    updateProp: (prop: string) => (value: any) => void
) => {
    const options = [
        { value: 'div', label: 'Div' },
        { value: 'section', label: 'Section' },
        { value: 'article', label: 'Article' },
        { value: 'main', label: 'Main' },
        { value: 'aside', label: 'Aside' },
        { value: 'header', label: 'Header' },
        { value: 'footer', label: 'Footer' },
        { value: 'nav', label: 'Nav' },
        { value: 'p', label: 'Paragraph' },
        { value: 'h1', label: 'Header 1' },
        { value: 'h2', label: 'Header 2' },
        { value: 'h3', label: 'Header 3' },
        { value: 'h4', label: 'Header 4' },
        { value: 'h5', label: 'Header 5' },
        { value: 'h6', label: 'Header 6' },
    ];

    return <>
        <Select
            style={{ width: '100%' }}
            placeholder="Select HTML block element"
            value={element || 'div'}
            onChange={updateProp("element")}
            options={options}
        />
    </>;
}
