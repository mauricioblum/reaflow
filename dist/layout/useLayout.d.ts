/// <reference types="react" />
import { CanvasDirection } from './elkLayout';
import { EdgeData, NodeData } from '../types';
export interface ElkRoot {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    children?: any[];
    edges?: any[];
    direction?: CanvasDirection;
}
export interface LayoutProps {
    maxHeight: number;
    maxWidth: number;
    nodes: NodeData[];
    edges: EdgeData[];
    pannable: boolean;
    center: boolean;
    fit: boolean;
    zoom: number;
    direction: CanvasDirection;
    setZoom: (factor: number) => void;
    onLayoutChange: (layout: ElkRoot) => void;
}
export declare const useLayout: ({ maxWidth, maxHeight, nodes, edges, fit, pannable, center, direction, zoom, setZoom, onLayoutChange }: LayoutProps) => {
    xy: [number, number];
    containerRef: import("react").RefObject<HTMLDivElement>;
    canvasHeight: number;
    canvasWidth: number;
    containerWidth: number;
    containerHeight: number;
    layout: ElkRoot;
    scrollXY: [number, number];
    centerCanvas: () => void;
    fitCanvas: () => void;
};
