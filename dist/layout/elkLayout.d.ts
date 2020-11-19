import { EdgeData, NodeData } from '../types';
import { ElkNode } from 'elkjs/lib/elk.bundled';
import PCancelable from 'p-cancelable';
export declare type CanvasDirection = 'LEFT' | 'RIGHT' | 'DOWN' | 'UP';
export interface ElkOptions {
    direction: CanvasDirection;
}
export declare const elkLayout: (nodes: NodeData[], edges: EdgeData[], options: ElkOptions) => PCancelable<ElkNode>;
