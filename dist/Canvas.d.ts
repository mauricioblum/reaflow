import React, { FC, ReactElement, Ref } from 'react';
import { Node, NodeProps } from './symbols/Node';
import { Edge, EdgeProps } from './symbols/Edge';
import { ElkRoot, CanvasDirection } from './layout';
import { MarkerArrow, MarkerArrowProps } from './symbols/Arrow';
import { EdgeData, NodeData, PortData } from './types';
export interface CanvasContainerProps extends CanvasProps {
    nodes?: NodeData[];
    edges?: EdgeData[];
    selections?: string[];
    direction?: CanvasDirection;
    pannable?: boolean;
    zoomable?: boolean;
    center?: boolean;
    fit?: boolean;
    maxHeight?: number;
    maxWidth?: number;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    onNodeLink?: (from: NodeData, to: NodeData, port?: PortData) => void;
    onNodeLinkCheck?: (from: NodeData, to: NodeData, port?: PortData) => undefined | boolean;
    onZoomChange?: (zoom: number) => void;
    onLayoutChange?: (layout: ElkRoot) => void;
}
export interface CanvasProps {
    className?: string;
    disabled?: boolean;
    height?: number;
    width?: number;
    readonly?: boolean;
    dragEdge?: ReactElement<EdgeProps, typeof Edge>;
    arrow?: ReactElement<MarkerArrowProps, typeof MarkerArrow>;
    node?: ReactElement<NodeProps, typeof Node> | ((node: NodeProps) => ReactElement<NodeProps, typeof Node>);
    edge?: ReactElement<EdgeProps, typeof Edge> | ((edge: EdgeProps) => ReactElement<NodeProps, typeof Edge>);
    onMouseEnter?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onCanvasClick?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
}
export interface CanvasRef {
    centerCanvas?: () => void;
    fitCanvas?: () => void;
    setZoom?: (factor: number) => void;
    zoomIn?: () => void;
    zoomOut?: () => void;
}
export declare const Canvas: FC<CanvasContainerProps & {
    ref?: Ref<CanvasRef>;
}>;
