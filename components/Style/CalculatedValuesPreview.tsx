import { Col, Modal, Row, Space, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { objMap } from 'ts-functional';
import { IStyleVar } from './Style.d';

const { Text } = Typography;

const scales = [
    { name: 'Base', prefix: 'base' },
    { name: 'Secondary', prefix: 'secondary' },
    { name: 'Neutral', prefix: 'neutral' },
    { name: 'Success', prefix: 'success' },
    { name: 'Warning', prefix: 'warning' },
    { name: 'Error', prefix: 'error' },
    { name: 'Info', prefix: 'info' }
];

const stops = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

const miscVarsGroups = [
    {
        title: 'Border Radius',
        prefix: 'radius',
        items: [
            { name: 'sm', varName: '--radius-sm', prop: 'borderRadius' },
            { name: 'md', varName: '--radius-md', prop: 'borderRadius' },
            { name: 'lg', varName: '--radius-lg', prop: 'borderRadius' },
            { name: 'full', varName: '--radius-full', prop: 'borderRadius' }
        ]
    },
    {
        title: 'Spacing',
        prefix: 'space',
        items: [
            { name: '1', varName: '--space-1', prop: 'width' },
            { name: '2', varName: '--space-2', prop: 'width' },
            { name: '3', varName: '--space-3', prop: 'width' },
            { name: '4', varName: '--space-4', prop: 'width' },
            { name: '6', varName: '--space-6', prop: 'width' },
            { name: '8', varName: '--space-8', prop: 'width' },
            { name: '12', varName: '--space-12', prop: 'width' },
            { name: '16', varName: '--space-16', prop: 'width' }
        ]
    },
    {
        title: 'Typography Size',
        prefix: 'text',
        items: [
            { name: 'xs', varName: '--text-xs', prop: 'fontSize' },
            { name: 'sm', varName: '--text-sm', prop: 'fontSize' },
            { name: 'base', varName: '--text-base', prop: 'fontSize' },
            { name: 'lg', varName: '--text-lg', prop: 'fontSize' },
            { name: 'xl', varName: '--text-xl', prop: 'fontSize' },
            { name: '2xl', varName: '--text-2xl', prop: 'fontSize' },
            { name: '3xl', varName: '--text-3xl', prop: 'fontSize' },
            { name: '4xl', varName: '--text-4xl', prop: 'fontSize' }
        ]
    },
    {
        title: 'Typography Weight',
        prefix: 'font',
        items: [
            { name: 'normal', varName: '--font-normal', prop: 'fontWeight' },
            { name: 'medium', varName: '--font-medium', prop: 'fontWeight' },
            { name: 'semibold', varName: '--font-semibold', prop: 'fontWeight' },
            { name: 'bold', varName: '--font-bold', prop: 'fontWeight' }
        ]
    },
    {
        title: 'Line Height',
        prefix: 'leading',
        items: [
            { name: 'none', varName: '--leading-none', prop: 'lineHeight' },
            { name: 'tight', varName: '--leading-tight', prop: 'lineHeight' },
            { name: 'normal', varName: '--leading-normal', prop: 'lineHeight' },
            { name: 'loose', varName: '--leading-loose', prop: 'lineHeight' }
        ]
    },
    {
        title: 'Shadow',
        prefix: 'shadow',
        items: [
            { name: 'sm', varName: '--shadow-sm', prop: 'boxShadow' },
            { name: 'md', varName: '--shadow-md', prop: 'boxShadow' },
            { name: 'lg', varName: '--shadow-lg', prop: 'boxShadow' },
            { name: 'xl', varName: '--shadow-xl', prop: 'boxShadow' },
            { name: 'inner', varName: '--shadow-inner', prop: 'boxShadow' }
        ]
    },
    {
        title: 'Transition',
        prefix: 'transition',
        items: [
            { name: 'fast', varName: '--duration-fast', prop: 'transitionDuration' },
            { name: 'normal', varName: '--duration-normal', prop: 'transitionDuration' },
            { name: 'standard ease', varName: '--ease-standard', prop: 'transitionTimingFunction' }
        ]
    }
];

const anyColorToHex = (str: string) => {
    if (str.startsWith('#')) return str.toUpperCase();

    let match = str.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        const a = match[4] ? Math.round(parseFloat(match[4]) * 255).toString(16).padStart(2, '0') : '';
        return `#${r}${g}${b}${a}`.toUpperCase();
    }

    match = str.match(/^color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s+\/\s+([\d.]+))?\s*\)$/);
    if (match) {
        const r = Math.round(parseFloat(match[1]) * 255).toString(16).padStart(2, '0');
        const g = Math.round(parseFloat(match[2]) * 255).toString(16).padStart(2, '0');
        const b = Math.round(parseFloat(match[3]) * 255).toString(16).padStart(2, '0');
        const a = match[4] ? Math.round(parseFloat(match[4]) * 255).toString(16).padStart(2, '0') : '';
        return `#${r}${g}${b}${a}`.toUpperCase();
    }

    return str;
};

export const CalculatedValuesPreview = ({ 
    vars, 
    open, 
    onClose 
}: { 
    vars: Record<string, IStyleVar>, 
    open: boolean, 
    onClose: () => void 
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [computedColors, setComputedColors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (open && containerRef.current) {
            // Give it a tiny delay to ensure CSS has been applied to the DOM
            const timer = setTimeout(() => {
                if (!containerRef.current) return;
                const newColors: Record<string, string> = {};
                
                scales.forEach(scale => {
                    stops.forEach(stop => {
                        const varName = `--${scale.prefix}-${stop}`;
                        const el = containerRef.current?.querySelector(`[data-var="${varName}"]`) as HTMLElement;
                        if (el) {
                            const computedStyle = getComputedStyle(el);
                            newColors[varName] = anyColorToHex(computedStyle.backgroundColor);
                        }
                    });
                });

                miscVarsGroups.forEach(group => {
                    group.items.forEach(item => {
                        const el = containerRef.current?.querySelector(`[data-var="${item.varName}"]`) as HTMLElement;
                        if (el) {
                            const computedStyle = getComputedStyle(el);
                            newColors[item.varName] = computedStyle[item.prop as keyof CSSStyleDeclaration] as string;
                        }
                    });
                });
                
                setComputedColors(newColors);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [open, vars]);

    const cssText = `
        .calculated-preview-container {
            ${Object.values(objMap<IStyleVar, string>(v => `--${v.name}: ${v.value};`)(vars || {})).join("\n")}
            
            --base-50:  color-mix(in srgb, var(--color-base), var(--white) calc(90% * var(--tint-strength)));
            --base-100: color-mix(in srgb, var(--color-base), var(--white) calc(80% * var(--tint-strength)));
            --base-200: color-mix(in srgb, var(--color-base), var(--white) calc(65% * var(--tint-strength)));
            --base-300: color-mix(in srgb, var(--color-base), var(--white) calc(50% * var(--tint-strength)));
            --base-400: color-mix(in srgb, var(--color-base), var(--white) calc(30% * var(--tint-strength)));
            --base-500: var(--color-base);
            --base-600: color-mix(in srgb, var(--color-base), var(--black) calc(15% * var(--shade-strength)));
            --base-700: color-mix(in srgb, var(--color-base), var(--black) calc(30% * var(--shade-strength)));
            --base-800: color-mix(in srgb, var(--color-base), var(--black) calc(50% * var(--shade-strength)));
            --base-900: color-mix(in srgb, var(--color-base), var(--black) calc(70% * var(--shade-strength)));

            --secondary-50:  color-mix(in srgb, var(--color-secondary), var(--white) calc(90% * var(--tint-strength)));
            --secondary-100: color-mix(in srgb, var(--color-secondary), var(--white) calc(80% * var(--tint-strength)));
            --secondary-200: color-mix(in srgb, var(--color-secondary), var(--white) calc(65% * var(--tint-strength)));
            --secondary-300: color-mix(in srgb, var(--color-secondary), var(--white) calc(50% * var(--tint-strength)));
            --secondary-400: color-mix(in srgb, var(--color-secondary), var(--white) calc(30% * var(--tint-strength)));
            --secondary-500: var(--color-secondary);
            --secondary-600: color-mix(in srgb, var(--color-secondary), var(--black) calc(15% * var(--shade-strength)));
            --secondary-700: color-mix(in srgb, var(--color-secondary), var(--black) calc(30% * var(--shade-strength)));
            --secondary-800: color-mix(in srgb, var(--color-secondary), var(--black) calc(50% * var(--shade-strength)));
            --secondary-900: color-mix(in srgb, var(--color-secondary), var(--black) calc(70% * var(--shade-strength)));

            --neutral-50:  color-mix(in srgb, var(--color-neutral), var(--white) calc(95% * var(--tint-strength)));
            --neutral-100: color-mix(in srgb, var(--color-neutral), var(--white) calc(90% * var(--tint-strength)));
            --neutral-200: color-mix(in srgb, var(--color-neutral), var(--white) calc(75% * var(--tint-strength)));
            --neutral-300: color-mix(in srgb, var(--color-neutral), var(--white) calc(60% * var(--tint-strength)));
            --neutral-400: color-mix(in srgb, var(--color-neutral), var(--white) calc(40% * var(--tint-strength)));
            --neutral-500: var(--color-neutral);
            --neutral-600: color-mix(in srgb, var(--color-neutral), var(--black) calc(15% * var(--shade-strength)));
            --neutral-700: color-mix(in srgb, var(--color-neutral), var(--black) calc(30% * var(--shade-strength)));
            --neutral-800: color-mix(in srgb, var(--color-neutral), var(--black) calc(50% * var(--shade-strength)));
            --neutral-900: color-mix(in srgb, var(--color-neutral), var(--black) calc(75% * var(--shade-strength)));

            --success-50:  color-mix(in srgb, var(--color-success), var(--white) calc(90% * var(--tint-strength)));
            --success-100: color-mix(in srgb, var(--color-success), var(--white) calc(80% * var(--tint-strength)));
            --success-200: color-mix(in srgb, var(--color-success), var(--white) calc(65% * var(--tint-strength)));
            --success-300: color-mix(in srgb, var(--color-success), var(--white) calc(50% * var(--tint-strength)));
            --success-400: color-mix(in srgb, var(--color-success), var(--white) calc(30% * var(--tint-strength)));
            --success-500: var(--color-success);
            --success-600: color-mix(in srgb, var(--color-success), var(--black) calc(15% * var(--shade-strength)));
            --success-700: color-mix(in srgb, var(--color-success), var(--black) calc(30% * var(--shade-strength)));
            --success-800: color-mix(in srgb, var(--color-success), var(--black) calc(50% * var(--shade-strength)));
            --success-900: color-mix(in srgb, var(--color-success), var(--black) calc(70% * var(--shade-strength)));

            --warning-50:  color-mix(in srgb, var(--color-warning), var(--white) calc(90% * var(--tint-strength)));
            --warning-100: color-mix(in srgb, var(--color-warning), var(--white) calc(80% * var(--tint-strength)));
            --warning-200: color-mix(in srgb, var(--color-warning), var(--white) calc(65% * var(--tint-strength)));
            --warning-300: color-mix(in srgb, var(--color-warning), var(--white) calc(50% * var(--tint-strength)));
            --warning-400: color-mix(in srgb, var(--color-warning), var(--white) calc(30% * var(--tint-strength)));
            --warning-500: var(--color-warning);
            --warning-600: color-mix(in srgb, var(--color-warning), var(--black) calc(15% * var(--shade-strength)));
            --warning-700: color-mix(in srgb, var(--color-warning), var(--black) calc(30% * var(--shade-strength)));
            --warning-800: color-mix(in srgb, var(--color-warning), var(--black) calc(50% * var(--shade-strength)));
            --warning-900: color-mix(in srgb, var(--color-warning), var(--black) calc(70% * var(--shade-strength)));

            --error-50:  color-mix(in srgb, var(--color-error), var(--white) calc(90% * var(--tint-strength)));
            --error-100: color-mix(in srgb, var(--color-error), var(--white) calc(80% * var(--tint-strength)));
            --error-200: color-mix(in srgb, var(--color-error), var(--white) calc(65% * var(--tint-strength)));
            --error-300: color-mix(in srgb, var(--color-error), var(--white) calc(50% * var(--tint-strength)));
            --error-400: color-mix(in srgb, var(--color-error), var(--white) calc(30% * var(--tint-strength)));
            --error-500: var(--color-error);
            --error-600: color-mix(in srgb, var(--color-error), var(--black) calc(15% * var(--shade-strength)));
            --error-700: color-mix(in srgb, var(--color-error), var(--black) calc(30% * var(--shade-strength)));
            --error-800: color-mix(in srgb, var(--color-error), var(--black) calc(50% * var(--shade-strength)));
            --error-900: color-mix(in srgb, var(--color-error), var(--black) calc(70% * var(--shade-strength)));

            --info-50:  color-mix(in srgb, var(--color-info), var(--white) calc(90% * var(--tint-strength)));
            --info-100: color-mix(in srgb, var(--color-info), var(--white) calc(80% * var(--tint-strength)));
            --info-200: color-mix(in srgb, var(--color-info), var(--white) calc(65% * var(--tint-strength)));
            --info-300: color-mix(in srgb, var(--color-info), var(--white) calc(50% * var(--tint-strength)));
            --info-400: color-mix(in srgb, var(--color-info), var(--white) calc(30% * var(--tint-strength)));
            --info-500: var(--color-info);
            --info-600: color-mix(in srgb, var(--color-info), var(--black) calc(15% * var(--shade-strength)));
            --info-700: color-mix(in srgb, var(--color-info), var(--black) calc(30% * var(--shade-strength)));
            --info-800: color-mix(in srgb, var(--color-info), var(--black) calc(50% * var(--shade-strength)));
            --info-900: color-mix(in srgb, var(--color-info), var(--black) calc(70% * var(--shade-strength)));

            /* === BORDER RADIUS SCALE === */
            --radius-sm: calc(4px * var(--radius-base));
            --radius-md: calc(6px * var(--radius-base));
            --radius-lg: calc(12px * var(--radius-base));
            --radius-full: 9999px;

            /* === SPACING SCALE === */
            --space-1: 0.25rem;
            --space-2: 0.5rem;
            --space-3: 0.75rem;
            --space-4: 1rem;
            --space-6: 1.5rem;
            --space-8: 2rem;
            --space-12: 3rem;
            --space-16: 4rem;

            /* === TYPOGRAPHY SCALE === */
            --text-xs: 0.75rem;
            --text-sm: 0.875rem;
            --text-base: 1rem;
            --text-lg: 1.125rem;
            --text-xl: 1.25rem;
            --text-2xl: 1.5rem;
            --text-3xl: 2rem;
            --text-4xl: 2.5rem;

            --font-normal: 400;
            --font-medium: 500;
            --font-semibold: 600;
            --font-bold: 700;

            --leading-none: 1;
            --leading-tight: 1.25;
            --leading-normal: 1.5;
            --leading-loose: 2;

            /* === SHADOW SCALE === */
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);

            /* === TRANSITIONS === */
            --duration-fast: 150ms;
            --duration-normal: 250ms;
            --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;

    return (
        <Modal
            title="Calculated Style Variables"
            open={open}
            onCancel={onClose}
            footer={null}
            width={850}
        >
            <style>{cssText}</style>
            <div ref={containerRef} className="calculated-preview-container">
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {scales.map(scale => (
                        <div key={scale.prefix}>
                            <Typography.Title level={5} style={{ marginTop: 0 }}>{scale.name} Scale</Typography.Title>
                            <Row gutter={[8, 8]}>
                                {stops.map(stop => {
                                    const varName = `--${scale.prefix}-${stop}`;
                                    return (
                                        <Col key={stop} span={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div 
                                                data-var={varName}
                                                style={{
                                                    width: '100%',
                                                    height: 24,
                                                    borderRadius: 4,
                                                    backgroundColor: `var(${varName})`,
                                                    border: '1px solid rgba(0,0,0,0.1)'
                                                }}
                                            />
                                            <Text type="secondary" style={{ fontSize: 12, marginTop: 4 }}>
                                                {stop}
                                            </Text>
                                            <Text style={{ fontSize: 10, wordBreak: 'break-all', textAlign: 'center' }} copyable={{ text: varName }}>
                                                {computedColors[varName] ? computedColors[varName] : '...'}
                                            </Text>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </div>
                    ))}
                    
                    {miscVarsGroups.map(group => (
                        <div key={group.title}>
                            <Typography.Title level={5} style={{ marginTop: 0 }}>{group.title}</Typography.Title>
                            <Row gutter={[8, 8]}>
                                {group.items.map(item => {
                                    return (
                                        <Col key={item.name} span={3} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div 
                                                data-var={item.varName}
                                                style={{
                                                    visibility: 'hidden',
                                                    position: 'absolute',
                                                    pointerEvents: 'none',
                                                    [item.prop]: `var(${item.varName})`
                                                }}
                                            />
                                            <div style={{
                                                width: '100%',
                                                height: 48,
                                                borderRadius: 4,
                                                backgroundColor: '#fafafa',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {group.prefix === 'radius' && <div style={{width: 24, height: 24, backgroundColor: 'var(--base-500)', borderRadius: `var(${item.varName})`}} />}
                                                {group.prefix === 'space' && <div style={{width: `var(${item.varName})`, height: 12, backgroundColor: 'var(--base-500)'}} />}
                                                {group.prefix === 'text' && <span style={{fontSize: `var(${item.varName})`, color: '#000'}}>Ag</span>}
                                                {group.prefix === 'font' && <span style={{fontWeight: `var(${item.varName})`, color: '#000'}}>Ag</span>}
                                                {group.prefix === 'shadow' && <div style={{width: 24, height: 24, backgroundColor: '#fff', boxShadow: `var(${item.varName})`, borderRadius: 4}} />}
                                                {group.prefix === 'transition' && <span style={{fontSize: 12, color: '#000'}}>{item.name}</span>}
                                                {group.prefix === 'leading' && <span style={{lineHeight: `var(${item.varName})`, backgroundColor: '#e6f7ff', padding: '0 4px', fontSize: 14, color: '#000'}}>A<br/>g</span>}
                                            </div>
                                            <Text type="secondary" style={{ fontSize: 12, marginTop: 4 }}>
                                                {item.name}
                                            </Text>
                                            <Text style={{ fontSize: 10, wordBreak: 'break-all', textAlign: 'center' }} copyable={{ text: item.varName }}>
                                                {computedColors[item.varName] || '...'}
                                            </Text>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </div>
                    ))}
                </Space>
            </div>
        </Modal>
    );
};
