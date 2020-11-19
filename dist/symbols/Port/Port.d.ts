import React from 'react';
import { PortData } from '../../types';
import { NodeDragEvents } from '../../utils/useNodeDrag';
export interface ElkPortProperties {
    index: number;
    width: number;
    height: number;
    'port.side': string;
    'port.alignment': string;
}
export interface PortProps extends NodeDragEvents<PortData> {
    id: string;
    x: number;
    y: number;
    rx: number;
    ry: number;
    offsetX: number;
    offsetY: number;
    disabled?: boolean;
    className?: string;
    properties: ElkPortProperties & PortData;
    style?: any;
    active?: boolean;
    onEnter?: (event: React.MouseEvent<SVGGElement, MouseEvent>, port: PortData) => void;
    onLeave?: (event: React.MouseEvent<SVGGElement, MouseEvent>, port: PortData) => void;
    onClick?: (event: React.MouseEvent<SVGGElement, MouseEvent>, port: PortData) => void;
}
export declare const Port: React.ForwardRefExoticComponent<Partial<PortProps> & React.RefAttributes<SVGRectElement>>;
