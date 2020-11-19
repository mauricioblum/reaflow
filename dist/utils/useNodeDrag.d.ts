import { State } from 'react-use-gesture/dist/types';
import { NodeData } from '../types';
export declare type DragEvent = State['drag'];
export declare type Position = [number, number];
export interface NodeDragEvents<T = any, TT = any | undefined> {
    onDrag?: (event: DragEvent, initial: Position, data: T, extra?: TT) => void;
    onDragEnd?: (event: DragEvent, initial: Position, data: T, extra?: TT) => void;
    onDragStart?: (event: DragEvent, initial: Position, data: T, extra?: TT) => void;
}
export interface NodeDragProps extends NodeDragEvents {
    node: NodeData;
    height: number;
    width: number;
    x: number;
    y: number;
    disabled: boolean;
}
export declare const useNodeDrag: ({ x, y, height, width, onDrag, onDragEnd, onDragStart, node, disabled }: NodeDragProps) => (...args: any[]) => import("react-use-gesture/dist/types").ReactEventHandlers;
