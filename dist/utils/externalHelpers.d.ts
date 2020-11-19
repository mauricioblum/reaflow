import { EdgeData, NodeData, PortData } from '../types';
/**
 * Helper function for upserting a node in a edge.
 */
export declare function upsertNode(nodes: NodeData[], edges: EdgeData[], edge: EdgeData, newNode: NodeData): {
    nodes: NodeData<any>[];
    edges: EdgeData<any>[];
};
/**
 * Helper function for removing a node between edges and
 * linking the children.
 */
export declare function removeAndUpsertNodes(nodes: NodeData[], edges: EdgeData[], removeNodes: NodeData | NodeData[], onNodeLinkCheck?: (newNodes: NodeData[], newEdges: EdgeData[], from: NodeData, to: NodeData, port?: PortData) => undefined | boolean): {
    edges: EdgeData<any>[];
    nodes: NodeData<any>[];
};
/**
 * Helper function to remove a node and its related edges.
 */
export declare function removeNode(nodes: NodeData[], edges: EdgeData[], removeNodes: string | string[]): {
    nodes: any[];
    edges: any[];
};
/**
 * Add a node and optional edge.
 */
export declare function addNodeAndEdge(nodes: NodeData[], edges: EdgeData[], node: NodeData, toNode?: NodeData): {
    nodes: NodeData<any>[];
    edges: EdgeData<any>[];
};
/**
 * Helper function to determine if edge already has a link.
 */
export declare function hasLink(edges: EdgeData[], from: NodeData, to: NodeData): boolean;
/**
 * Detect if there is a circular reference from the from to the source node.
 */
export declare function detectCircular(nodes: NodeData[], edges: EdgeData[], fromNode: NodeData, toNode: NodeData): boolean;
/**
 * Given a node id, get all the parent nodes recursively.
 */
export declare const getParentsForNodeId: (nodes: NodeData[], edges: EdgeData[], startId: string) => any[];
