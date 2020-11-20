import React, { FC, ReactElement, ReactNode } from 'react';
import { Port, PortProps } from '../Port';
import { Label, LabelProps } from '../Label';
import { EdgeData, NodeData, PortData } from '../../types';
import { Icon, IconProps } from '../Icon';
import { Remove, RemoveProps } from '../Remove';
import { NodeDragEvents } from '../../utils/useNodeDrag';
import { Edge, EdgeProps } from '../Edge';
export interface NodeChildProps {
    height: number;
    width: number;
    x: number;
    y: number;
    node: NodeData;
}
export interface NodeProps extends NodeDragEvents<NodeData, PortData> {
    id: string;
    height: number;
    width: number;
    x: number;
    y: number;
    rx: number;
    ry: number;
    offsetX?: number;
    offsetY?: number;
    disabled?: boolean;
    isDraggable?: boolean;
    ports?: PortProps[];
    labels?: LabelProps[];
    properties: any;
    className?: string;
    style?: any;
    children?: ReactNode | ((node: NodeChildProps) => ReactNode);
    parent?: string;
    nodes?: NodeData[];
    edges?: EdgeData[];
    onRemove?: (event: React.MouseEvent<SVGGElement, MouseEvent>, node: NodeData) => void;
    onClick?: (event: React.MouseEvent<SVGGElement, MouseEvent>, data: NodeData) => void;
    onKeyDown?: (event: React.KeyboardEvent<SVGGElement>, data: NodeData) => void;
    onEnter?: (event: React.MouseEvent<SVGGElement, MouseEvent>, node: NodeData) => void;
    onLeave?: (event: React.MouseEvent<SVGGElement, MouseEvent>, node: NodeData) => void;
    childNode?: ReactElement<NodeProps, typeof Node> | ((node: NodeProps) => ReactElement<NodeProps, typeof Node>);
    childEdge?: ReactElement<EdgeProps, typeof Edge> | ((edge: EdgeProps) => ReactElement<NodeProps, typeof Edge>);
    remove: ReactElement<RemoveProps, typeof Remove>;
    icon: ReactElement<IconProps, typeof Icon>;
    label: ReactElement<LabelProps, typeof Label>;
    port: ReactElement<PortProps, typeof Port>;
}
export declare const Node: FC<Partial<NodeProps>>;
