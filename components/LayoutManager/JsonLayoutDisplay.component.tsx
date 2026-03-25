import { Switch } from "antd";
import { ILayoutComponent } from "@theming/lib/layout/layout";
import { IToggle } from "@core/lib/useToggle";
import { overridable } from "@core/lib/overridable";

export interface JsonLayoutDisplayProps {
    layout: ILayoutComponent | null;
    showJson?: IToggle | null;
}

export const JsonLayoutDisplayComponent = overridable(({ layout, showJson }: JsonLayoutDisplayProps) => {
    return (
        <>
            <h3>Layout JSON</h3>
            <Switch checked={showJson?.isset} onChange={showJson?.toggle} checkedChildren="Show" unCheckedChildren="Hide"/>
            {showJson?.isset && <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <pre style={{padding: '10px', borderRadius: '4px', overflow: 'hidden' }}>
                    {JSON.stringify(layout, null, 2)}
                </pre>
            </div>}
        </>
    );
});

export const JsonLayoutDisplay = JsonLayoutDisplayComponent;
