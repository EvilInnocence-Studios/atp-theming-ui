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
                </Space>
            </div>
        </Modal>
    );
};
