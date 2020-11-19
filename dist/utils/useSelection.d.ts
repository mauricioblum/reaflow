import React from 'react';
import { EdgeData, NodeData } from 'types';
export interface SelectionProps {
    selections?: string[];
    nodes?: NodeData[];
    edges?: EdgeData[];
    onSelection?: (value: string[]) => void;
    onDataChange?: (nodes: NodeData[], edges: EdgeData[]) => void;
}
export interface SelectionResult {
    selections: string[];
    clearSelections: (value?: string[]) => void;
    addSelection: (value: string) => void;
    removeSelection: (value: string) => void;
    toggleSelection: (value: string) => void;
    setSelections: (value: string[]) => void;
    onClick?: (event: React.MouseEvent<SVGGElement, MouseEvent>, data: any) => void;
    onCanvasClick?: (event?: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    onKeyDown?: (event: React.KeyboardEvent<SVGGElement>) => void;
}
export declare const useSelection: ({ selections, nodes, edges, onSelection, onDataChange }: SelectionProps) => SelectionResult;
