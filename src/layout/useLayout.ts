import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { elkLayout, CanvasDirection } from './elkLayout';
import useDimensions from 'react-cool-dimensions';
import isEqual from 'react-fast-compare';
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
  direction: CanvasDirection;
  setZoom: (factor: number) => void;
  onLayoutChange: (layout: ElkRoot) => void;
}

export const useLayout = ({
  maxWidth,
  maxHeight,
  nodes = [],
  edges = [],
  pannable,
  center,
  direction,
  setZoom,
  onLayoutChange
}: LayoutProps) => {
  const scrolled = useRef<boolean>(false);
  const { ref, width, height } = useDimensions<HTMLDivElement>();
  const [layout, setLayout] = useState<ElkRoot | null>(null);
  const [xy, setXY] = useState<[number, number]>([0, 0]);
  const [scrollXY, setScrollXY] = useState<[number, number]>([0, 0]);
  const canvasHeight = pannable ? maxHeight : height;
  const canvasWidth = pannable ? maxWidth : width;

  useEffect(() => {
    const promise = elkLayout(nodes, edges, { direction });

    promise
      .then((result) => {
        if (!isEqual(layout, result)) {
          setLayout(result);
          onLayoutChange(result);
        }
      })
      .catch((err) => {
        if (err.name !== 'CancelError') {
          console.error('Layout Error:', err);
        }
      });

    return () => promise.cancel();
  }, [nodes, edges]);

  useEffect(() => {
    ref?.current?.scrollTo(scrollXY[0], scrollXY[1]);
  }, [scrollXY]);

  const centerCanvas = useCallback(() => {
    const scrollX = (canvasWidth - width) / 2;
    const scrollY = (canvasHeight - height) / 2;

    const x = (canvasWidth - layout.width) / 2;
    const y = (canvasHeight - layout.height) / 2;

    if (center) {
      setXY([x, y]);
    }

    if (pannable) {
      setScrollXY([scrollX, scrollY]);
    }
  }, [canvasWidth, canvasHeight, height, width, layout]);

  const fitCanvas = useCallback(() => {
    const heightZoom = height / layout.height;
    const widthZoom = width / layout.width;
    const scale = Math.min(heightZoom, widthZoom, 1) - 0.1;
    setZoom(scale);
    centerCanvas();
  }, [layout, height, width, centerCanvas, canvasWidth, canvasHeight]);

  useLayoutEffect(() => {
    const scroller = ref.current;
    if (scroller && !scrolled.current && layout && height && width) {
      centerCanvas();
      scrolled.current = true;
    }
  }, [
    canvasWidth,
    pannable,
    canvasHeight,
    layout,
    height,
    width,
    center,
    centerCanvas
  ]);

  return {
    xy,
    containerRef: ref,
    canvasHeight,
    canvasWidth,
    containerWidth: width,
    containerHeight: height,
    layout,
    scrollXY,
    centerCanvas,
    fitCanvas
  };
};
