import { NodeData } from '../types';
export declare function measureText(text: string): {
    height: number;
    width: number;
};
export declare function formatText(node: NodeData): {
    text: any;
    originalText: any;
    width: number;
    height: number;
    labelHeight: number;
    labelWidth: number;
};
