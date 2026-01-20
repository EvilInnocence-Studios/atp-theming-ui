import { SlotRenderer } from "@theming/components/SlotRenderer";
import { ILayoutComponent } from "@theming/lib/layout/layout";
import { Layout } from "antd";
import { Index } from "ts-functional/dist/types";
import styles from './StandardLayout.module.scss';
import { useLocation } from "react-router";
import { findMatchingRoute } from "@core/lib/routeUtils";

export const StandardLayout = (
    { slots, __layoutId, css, className }: { slots?: Index<ILayoutComponent[]>, __layoutId?: string, css?: string, className?: string }
) => <>
    {css && <style>{css}</style>}
    <Layout style={{ height: '100%' }} className={className}>
        <SlotRenderer slots={slots?.header} parentId={__layoutId} slotName="header" />
        <Layout.Content className={styles.content}>
            <SlotRenderer slots={slots?.content} parentId={__layoutId} slotName="content" />
        </Layout.Content>
        <Layout.Footer style={{ position: "relative" }}>
            <SlotRenderer slots={slots?.footer} parentId={__layoutId} slotName="footer" />
        </Layout.Footer>
    </Layout>
</>;

export const RouteTable = ({slots, __layoutId, path}: {slots?: Index<ILayoutComponent[]>, __layoutId?: string, path?: string}) => {
    const locationPath = useLocation().pathname;
    const finalPath = path || locationPath;
    const matchingRoute = findMatchingRoute(finalPath, slots);
    
    return <>
        <SlotRenderer slots={matchingRoute} parentId={__layoutId} slotName="routeTable" />
    </>
}