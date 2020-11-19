/// <reference types="react" />
export interface ZoomProps {
    disabled?: boolean;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    onZoomChange: (zoom: number) => void;
}
export declare const useZoom: ({ disabled, zoom, minZoom, maxZoom, onZoomChange }: ZoomProps) => {
    svgRef: import("react").MutableRefObject<SVGSVGElement>;
    zoom: number;
    setZoom: (f: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
};
