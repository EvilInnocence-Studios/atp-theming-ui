import { DeleteBtn } from "@core/components/DeleteBtn";
import { Editable } from "@core/components/Editable";
import { Label } from "@core/components/Label";
import { ResponsiveValue } from "@core/components/ResponsiveValue";
import { faArrowsLeftRight, faArrowsUpDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { uuidv4 } from "@theming/lib/layout/utils";
import { Button, Select, Slider, Switch, Tabs } from "antd";
import { Gutter } from "antd/es/grid/row";
import { objMap } from "ts-functional";
import { Index } from "ts-functional/dist/types";
import { IMultiColumnLayoutInputProps } from "./MultiColumnLayout";

const parseGutter = (value: string | Object) => {
    if (typeof value === "object") {
        return objMap((v) => parseInt(v as string))(value as unknown as Index<string>);
    }
    return parseInt(value) || undefined;
}

const getResponsiveData = (column: any, prop: string) => {
    const main = column[prop];
    const bps = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    
    // Check if any specific breakpoint is defined for this prop
    const isResponsive = bps.some(bp => {
        const bpVal = column[bp];
        if (typeof bpVal === 'object' && bpVal !== undefined && bpVal !== null) {
            return bpVal[prop] !== undefined;
        }
        if (typeof bpVal === 'number' && prop === 'span') return true;
        return false;
    });

    if (!isResponsive) return main;

    // Construct responsive object
    const res: any = {};
    bps.forEach(bp => {
        const bpVal = column[bp];
        if (typeof bpVal === 'object' && bpVal !== undefined && bpVal !== null && bpVal[prop] !== undefined) {
            res[bp] = bpVal[prop];
        } else if (typeof bpVal === 'number' && prop === 'span') {
            res[bp] = bpVal;
        } else if (bp === 'xs' && main !== undefined) {
             res[bp] = main;
        }
    });
    
    return res;
}

const setResponsiveData = (column: any, prop: string, value: any) => {
    const newCol = { ...column };
    const bps = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

    if (typeof value === 'object' && value !== null) {
        // Responsive Mode
        // Clear top-level prop
        delete newCol[prop];

        bps.forEach(bp => {
            const bpVal = value[bp];
            let existingBp = newCol[bp];
            
            if (bpVal !== undefined) {
                // We have a value for this breakpoint
                if (typeof existingBp === 'number') {
                    existingBp = { span: existingBp };
                } else if (typeof existingBp !== 'object' || existingBp === null) {
                    existingBp = {};
                } else {
                    existingBp = { ...existingBp };
                }

                existingBp[prop] = bpVal;
                newCol[bp] = existingBp;
            } else {
                // Undefined value for this breakpoint (removed?)
                 if (typeof existingBp === 'object' && existingBp !== null) {
                      existingBp = { ...existingBp };
                      delete existingBp[prop];
                      // If empty?
                      if (Object.keys(existingBp).length === 0) {
                          delete newCol[bp];
                      } else {
                          newCol[bp] = existingBp;
                      }
                 } else if (typeof existingBp === 'number' && prop === 'span') {
                     // effectively deleting span
                     delete newCol[bp];
                 }
            }
        });
    } else {
        // Single Mode
        newCol[prop] = value;
        // Clear this prop from all breakpoints
        bps.forEach(bp => {
              let existingBp = newCol[bp];
              if (typeof existingBp === 'object' && existingBp !== null) {
                  existingBp = { ...existingBp };
                  delete existingBp[prop];
                   if (Object.keys(existingBp).length === 0) {
                      delete newCol[bp];
                  } else {
                      newCol[bp] = existingBp;
                  }
              } else if (typeof existingBp === 'number' && prop === 'span') {
                  delete newCol[bp];
              }
        });
    }
    return newCol;
}

export const MultiColumnLayoutPropEditor = (props: IMultiColumnLayoutInputProps, updateProps: (props: any) => void) => {
    const addColumn = () => {
        updateProps({...props, columns: [...(props.columns || []), {span: 12, id: uuidv4()}]});
    }

    const removeColumn = (id: string) => {
        updateProps({...props, columns: props.columns?.filter(c => c.id !== id)});
    }

    const updateColumn = (index: number, newColumn: any) => {
         const newColumns = [...(props.columns || [])];
         newColumns[index] = newColumn;
         updateProps({...props, columns: newColumns});
    }

    const gutter:[Gutter, Gutter] = (props.row?.gutter as [Gutter, Gutter]) || [undefined, undefined];

    return <>
        <h4>Row Properties</h4>
        <ResponsiveValue
            label="Alignment"
            value={props.row?.align}
            onChange={(value) => updateProps({...props, row: {...props.row, align: value}})}
            editor={(value, onChange) => <Select
                value={value}
                onChange={onChange}
                allowClear
                options={[
                    {value: 'top', label: 'Top'},
                    {value: 'middle', label: 'Middle'},
                    {value: 'bottom', label: 'Bottom'},
                    {value: 'stretch', label: 'Stretch'},
                ]}
            />}
        />
        <ResponsiveValue
            label={<>Gutter <FontAwesomeIcon icon={faArrowsLeftRight} /></>}
            value={gutter[0]}
            onChange={(value) => updateProps({...props, row: {...props.row, gutter: [parseGutter(value), gutter[1]]}})}
            editor={(value, onChange) => <Editable
                value={value}
                onChange={onChange}
            />}
        />
        <ResponsiveValue
            label={<>Gutter <FontAwesomeIcon icon={faArrowsUpDown} /></>}
            value={gutter[1]}
            onChange={(value) => updateProps({...props, row: {...props.row, gutter: [gutter[0], parseGutter(value)]}})}
            editor={(value, onChange) => <Editable
                value={value}
                onChange={onChange}
            />}
        />
        <ResponsiveValue
            label="Justify"
            value={props.row?.justify}
            onChange={(value) => updateProps({...props, row: {...props.row, justify: value}})}
            editor={(value, onChange) => <Select
                value={value}
                onChange={onChange}
                allowClear
                options={[
                    {value: 'start', label: 'Start'},
                    {value: 'end', label: 'End'},
                    {value: 'center', label: 'Center'},
                    {value: 'space-between', label: 'Space Between'},
                    {value: 'space-around', label: 'Space Around'},
                    {value: 'space-evenly', label: 'Space Evenly'},
                ]}
            />}
        />
        <Switch
            value={props.row?.wrap}
            onChange={(value) => updateProps({...props, row: {...props.row, wrap: value}})}
            checkedChildren="Wrap"
            unCheckedChildren="No Wrap"
        />
        <h4>Columns</h4>
        <Tabs
            tabBarExtraContent={
                <Button onClick={addColumn}>
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
            }
        >
            {props.columns?.map((column, index) => (
                <Tabs.TabPane
                    tab={<>Col {index+1} <DeleteBtn entityType="column" onClick={() => removeColumn(column.id)} /></>}
                    key={index}
                >
                    <div style={{display: 'flex', flexDirection: 'column', gap: 10, padding: 10}}>
                        <div>
                            <Label label="Class">
                                <Editable
                                    value={column.className || ''}
                                    onChange={(value) => updateColumn(index, {...column, className: value})}
                                />
                            </Label>
                        </div>
                        <div>
                            <h4>Additional CSS Styling</h4>
                            <Editable
                                textArea
                                value={column.css || ''}
                                onChange={(value) => updateColumn(index, {...column, css: value})}
                            />
                        </div>
                        <ResponsiveValue
                            label="Span"
                            value={getResponsiveData(column, 'span')}
                            onChange={(value) => updateColumn(index, setResponsiveData(column, 'span', value))}
                            editor={(value, onChange) => <Slider
                                value={value}
                                onChange={onChange}
                                min={0}
                                max={24}
                                marks={{0:0, 6:6, 12:12, 18:18, 24:24}}
                            />}
                        />
                        <ResponsiveValue
                            label="Offset"
                            value={getResponsiveData(column, 'offset')}
                            onChange={(value) => updateColumn(index, setResponsiveData(column, 'offset', value))}
                            editor={(value, onChange) => <Slider
                                value={value}
                                onChange={onChange}
                                min={0}
                                max={24}
                                marks={{0:0, 6:6, 12:12, 18:18, 24:24}}
                            />}
                        />
                        <ResponsiveValue
                            label="Order"
                            value={getResponsiveData(column, 'order')}
                            onChange={(value) => updateColumn(index, setResponsiveData(column, 'order', value))}
                            editor={(value, onChange) => <Select
                                value={value}
                                onChange={onChange}
                                options={Array.from({length: 25}, (_, i) => ({value: i, label: i}))}
                            />}
                        />
                        <ResponsiveValue
                            label="Pull"
                            value={getResponsiveData(column, 'pull')}
                            onChange={(value) => updateColumn(index, setResponsiveData(column, 'pull', value))}
                            editor={(value, onChange) => <Select
                                value={value}
                                onChange={onChange}
                                options={Array.from({length: 25}, (_, i) => ({value: i, label: i}))}
                            />}
                        />
                        <ResponsiveValue
                            label="Push"
                            value={getResponsiveData(column, 'push')}
                            onChange={(value) => updateColumn(index, setResponsiveData(column, 'push', value))}
                            editor={(value, onChange) => <Select
                                value={value}
                                onChange={onChange}
                                options={Array.from({length: 25}, (_, i) => ({value: i, label: i}))}
                            />}
                        />
                    </div>
                </Tabs.TabPane>
            ))  }
        </Tabs>
    </>;
}