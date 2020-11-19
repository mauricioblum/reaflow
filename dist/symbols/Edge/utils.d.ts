export interface PointCoords {
    x: number;
    y: number;
}
export interface CenterCoords {
    angle: number;
    x: number;
    y: number;
}
/**
 * Path helper utils.
 * Ref: https://github.com/wbkd/react-flow/blob/main/src/components/Edges/BezierEdge.tsx#L19
 */
export declare function getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition }: {
    sourceX: any;
    sourceY: any;
    sourcePosition?: string;
    targetX: any;
    targetY: any;
    targetPosition?: string;
}): string;
/**
 * Get the center for the path element.
 */
export declare function getPathCenter(pathElm: SVGPathElement, firstPoint: PointCoords, lastPoint: PointCoords): CenterCoords;
