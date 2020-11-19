import React from 'react';
import { EdgeSections } from '../symbols/Edge';
import { NodeData, PortData } from '../types';
import { NodeDragEvents } from './useNodeDrag';
export interface EdgeDragResult extends NodeDragEvents {
    dragCoords: EdgeSections[] | null;
    canLinkNode: boolean | null;
    dragNode: NodeData | null;
    dragPort: PortData | null;
    enteredNode: NodeData | null;
    onEnter?: (event: React.MouseEvent<SVGGElement, MouseEvent>, data: NodeData | PortData) => void;
    onLeave?: (event: React.MouseEvent<SVGGElement, MouseEvent>, data: NodeData | PortData) => void;
}
export declare const useEdgeDrag: ({ onNodeLink, onNodeLinkCheck }: {
    onNodeLink: any;
    onNodeLinkCheck: any;
}) => EdgeDragResult;
