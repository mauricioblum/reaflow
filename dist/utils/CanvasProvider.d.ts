import { ElkRoot } from '../layout/useLayout';
import React, { RefObject } from 'react';
import { NodeData, PortData } from '../types';
import { EdgeDragResult } from './useEdgeDrag';
export interface CanvasProviderValue extends EdgeDragResult {
    selections?: string[];
    readonly?: boolean;
    layout?: ElkRoot;
    xy: [number, number];
    scrollXY: [number, number];
    containerRef: RefObject<HTMLDivElement>;
    svgRef: RefObject<SVGSVGElement>;
    canvasHeight: number;
    canvasWidth: number;
    containerHeight: number;
    containerWidth: number;
    zoom: number;
    pannable: boolean;
    setZoom: (factor: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    centerCanvas: () => void;
    fitCanvas: () => void;
}
export declare const CanvasContext: React.Context<CanvasProviderValue>;
export interface CanvasProviderProps {
    onNodeLink?: (from: NodeData, to: NodeData, port?: PortData) => void;
    onNodeLinkCheck?: (from: NodeData, to: NodeData, port?: PortData) => undefined | boolean;
}
export declare const CanvasProvider: ({ selections, onNodeLink, readonly, children, nodes, edges, maxHeight, fit, maxWidth, direction, pannable, center, zoomable, zoom, minZoom, maxZoom, onNodeLinkCheck, onLayoutChange, onZoomChange }: {
    selections: any;
    onNodeLink: any;
    readonly: any;
    children: any;
    nodes: any;
    edges: any;
    maxHeight: any;
    fit: any;
    maxWidth: any;
    direction: any;
    pannable: any;
    center: any;
    zoomable: any;
    zoom: any;
    minZoom: any;
    maxZoom: any;
    onNodeLinkCheck: any;
    onLayoutChange: any;
    onZoomChange: any;
}) => JSX.Element;
export declare const useCanvas: () => CanvasProviderValue;
