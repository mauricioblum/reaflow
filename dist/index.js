(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('rdk'), require('framer-motion'), require('react-use-gesture'), require('elkjs/lib/elk.bundled'), require('p-cancelable'), require('calculate-size'), require('ellipsize'), require('react-cool-dimensions'), require('react-fast-compare'), require('transformation-matrix'), require('classnames'), require('d3-shape'), require('reakeys')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', 'rdk', 'framer-motion', 'react-use-gesture', 'elkjs/lib/elk.bundled', 'p-cancelable', 'calculate-size', 'ellipsize', 'react-cool-dimensions', 'react-fast-compare', 'transformation-matrix', 'classnames', 'd3-shape', 'reakeys'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.reaflow = {}, global.React, global.rdk, global.framerMotion, global.reactUseGesture, global.ELK, global.PCancelable, global.calculateSize, global.ellipsize, global.useDimensions, global.isEqual, global.transformationMatrix, global.classNames, global.d3Shape, global.reakeys));
}(this, (function (exports, React, rdk, framerMotion, reactUseGesture, ELK, PCancelable, calculateSize, ellipsize, useDimensions, isEqual, transformationMatrix, classNames, d3Shape, reakeys) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
    var ELK__default = /*#__PURE__*/_interopDefaultLegacy(ELK);
    var PCancelable__default = /*#__PURE__*/_interopDefaultLegacy(PCancelable);
    var calculateSize__default = /*#__PURE__*/_interopDefaultLegacy(calculateSize);
    var ellipsize__default = /*#__PURE__*/_interopDefaultLegacy(ellipsize);
    var useDimensions__default = /*#__PURE__*/_interopDefaultLegacy(useDimensions);
    var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);
    var classNames__default = /*#__PURE__*/_interopDefaultLegacy(classNames);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    const MAX_CHAR_COUNT = 35;
    const MIN_NODE_WIDTH = 50;
    const DEFAULT_NODE_HEIGHT = 50;
    const NODE_PADDING = 30;
    const ICON_PADDING = 10;
    function measureText(text) {
        let result = { height: 0, width: 0 };
        if (text) {
            result = calculateSize__default['default'](text, {
                font: 'Arial, sans-serif',
                fontSize: '14px'
            });
        }
        return result;
    }
    function formatText(node) {
        const text = node.text
            ? ellipsize__default['default'](node.text, MAX_CHAR_COUNT)
            : node.text;
        const labelDim = measureText(text);
        let width = node.width;
        if (width === undefined) {
            if (text && node.icon) {
                width = labelDim.width + node.icon.width + NODE_PADDING + ICON_PADDING;
            }
            else {
                if (text) {
                    width = labelDim.width + NODE_PADDING;
                }
                else if (node.icon) {
                    width = node.icon.width + NODE_PADDING;
                }
                width = Math.max(width, MIN_NODE_WIDTH);
            }
        }
        let height = node.height;
        if (height === undefined) {
            if (text && node.icon) {
                height = labelDim.height + node.icon.height;
            }
            else if (text) {
                height = labelDim.height + NODE_PADDING;
            }
            else if (node.icon) {
                height = node.icon.height + NODE_PADDING;
            }
            height = Math.max(height, DEFAULT_NODE_HEIGHT);
        }
        return {
            text,
            originalText: node.text,
            width,
            height,
            labelHeight: labelDim.height,
            labelWidth: labelDim.width
        };
    }

    const defaultLayoutOptions = {
        'elk.nodeLabels.placement': 'INSIDE V_CENTER H_RIGHT',
        'elk.algorithm': 'org.eclipse.elk.layered',
        'elk.direction': 'DOWN',
        nodeLayering: 'INTERACTIVE',
        'org.eclipse.elk.edgeRouting': 'ORTHOGONAL',
        'elk.layered.unnecessaryBendpoints': 'true',
        'elk.layered.spacing.edgeNodeBetweenLayers': '50',
        'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
        'org.eclipse.elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST',
        'org.eclipse.elk.insideSelfLoops.activate': 'true',
        separateConnectedComponents: 'false',
        'spacing.componentComponent': '70',
        spacing: '75',
        'spacing.nodeNodeBetweenLayers': '70'
    };
    function mapNode(nodes, edges, node) {
        const { text, width, height, labelHeight, labelWidth, originalText } = formatText(node);
        const children = nodes
            .filter((n) => n.parent === node.id)
            .map((n) => mapNode(nodes, edges, n));
        const childEdges = edges
            .filter((e) => e.parent === node.id)
            .map((e) => mapEdge(e));
        return {
            id: node.id,
            height,
            width,
            children,
            edges: childEdges,
            ports: node.ports
                ? node.ports.map((port) => ({
                    id: port.id,
                    properties: Object.assign(Object.assign({}, port), { 'port.side': port.side, 'port.alignment': port.alignment || 'CENTER' })
                }))
                : [],
            layoutOptions: {
                'elk.padding': '[left=50, top=50, right=50, bottom=50]',
                portConstraints: 'FIXED_ORDER'
            },
            properties: Object.assign({}, node),
            labels: text
                ? [
                    {
                        width: labelWidth,
                        height: -(labelHeight / 2),
                        text,
                        originalText
                        // layoutOptions: { 'elk.nodeLabels.placement': 'INSIDE V_CENTER H_CENTER' }
                    }
                ]
                : []
        };
    }
    function mapEdge(edge) {
        const labelDim = measureText(edge.text);
        return {
            id: edge.id,
            source: edge.from,
            target: edge.to,
            properties: Object.assign({}, edge),
            sourcePort: edge.fromPort,
            targetPort: edge.toPort,
            labels: edge.text
                ? [
                    {
                        width: labelDim.width / 2,
                        height: -(labelDim.height / 2),
                        text: edge.text,
                        layoutOptions: {
                            'elk.edgeLabels.placement': 'INSIDE V_CENTER H_CENTER'
                        }
                    }
                ]
                : []
        };
    }
    function mapInput(nodes, edges) {
        const children = [];
        const mappedEdges = [];
        for (const node of nodes) {
            if (!node.parent) {
                const mappedNode = mapNode(nodes, edges, node);
                if (mappedNode !== null) {
                    children.push(mappedNode);
                }
            }
        }
        for (const edge of edges) {
            if (!edge.parent) {
                const mappedEdge = mapEdge(edge);
                if (mappedEdge !== null) {
                    mappedEdges.push(mappedEdge);
                }
            }
        }
        return {
            children,
            edges: mappedEdges
        };
    }
    function postProcessNode(nodes) {
        var _a;
        for (const node of nodes) {
            const hasLabels = ((_a = node.labels) === null || _a === void 0 ? void 0 : _a.length) > 0;
            if (hasLabels && node.properties.icon) {
                const [label] = node.labels;
                label.x = node.properties.icon.width + 25;
                node.properties.icon.x = 25;
                node.properties.icon.y = node.height / 2;
            }
            else if (hasLabels) {
                const [label] = node.labels;
                label.x = (node.width - label.width) / 2;
            }
            else if (node.properties.icon) {
                node.properties.icon.x = node.width / 2;
                node.properties.icon.y = node.height / 2;
            }
            if (node.children) {
                postProcessNode(node.children);
            }
        }
        return nodes;
    }
    const elkLayout = (nodes, edges, options) => {
        const graph = new ELK__default['default']();
        return new PCancelable__default['default']((resolve, reject) => {
            graph
                .layout(Object.assign({ id: 'root' }, mapInput(nodes, edges)), {
                layoutOptions: Object.assign(Object.assign({}, defaultLayoutOptions), { 'elk.direction': options.direction })
            })
                .then((data) => {
                resolve(Object.assign(Object.assign({}, data), { children: postProcessNode(data.children) }));
            })
                .catch(reject);
        });
    };

    const useLayout = ({ maxWidth, maxHeight, nodes = [], edges = [], fit, pannable, center, direction, zoom, setZoom, onLayoutChange }) => {
        const scrolled = React.useRef(false);
        const { ref, width, height } = useDimensions__default['default']();
        const [layout, setLayout] = React.useState(null);
        const [xy, setXY] = React.useState([0, 0]);
        const [scrollXY, setScrollXY] = React.useState([0, 0]);
        const canvasHeight = pannable ? maxHeight : height;
        const canvasWidth = pannable ? maxWidth : width;
        React.useEffect(() => {
            const promise = elkLayout(nodes, edges, { direction });
            promise
                .then((result) => {
                if (!isEqual__default['default'](layout, result)) {
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
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [nodes, edges]);
        const centerVector = React.useCallback(() => {
            if (center) {
                // @ts-ignore
                const x = (canvasWidth - layout.width * zoom) / 2;
                // @ts-ignore
                const y = (canvasHeight - layout.height * zoom) / 2;
                setXY([x, y]);
            }
        }, [canvasWidth, canvasHeight, layout, zoom, center]);
        const centerScroll = React.useCallback(() => {
            const scrollX = (canvasWidth - width) / 2;
            const scrollY = (canvasHeight - height) / 2;
            if (pannable) {
                setScrollXY([scrollX, scrollY]);
            }
        }, [canvasWidth, canvasHeight, width, height, pannable]);
        const centerCanvas = React.useCallback(() => {
            centerVector();
            centerScroll();
        }, [centerScroll, centerVector]);
        React.useEffect(() => {
            var _a;
            (_a = ref === null || ref === void 0 ? void 0 : ref.current) === null || _a === void 0 ? void 0 : _a.scrollTo(scrollXY[0], scrollXY[1]);
        }, [scrollXY, ref]);
        React.useEffect(() => {
            if (scrolled.current) {
                centerVector();
            }
        }, [centerVector, zoom]);
        const fitCanvas = React.useCallback(() => {
            const heightZoom = height / layout.height;
            const widthZoom = width / layout.width;
            const scale = Math.min(heightZoom, widthZoom, 1) - 0.1;
            setZoom(scale);
            centerCanvas();
        }, [height, layout, width, setZoom, centerCanvas]);
        React.useLayoutEffect(() => {
            const scroller = ref.current;
            if (scroller && !scrolled.current && layout && height && width) {
                if (fit) {
                    fitCanvas();
                }
                else {
                    centerCanvas();
                }
                scrolled.current = true;
            }
        }, [
            canvasWidth,
            pannable,
            canvasHeight,
            layout,
            height,
            fit,
            width,
            center,
            centerCanvas,
            fitCanvas,
            ref
        ]);
        React.useLayoutEffect(() => {
            function onResize() {
                if (fit) {
                    fitCanvas();
                }
                else {
                    centerCanvas();
                }
            }
            window.addEventListener('resize', onResize);
            return () => window.removeEventListener('resize', onResize);
        }, [fit, centerCanvas, fitCanvas]);
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

    const useEdgeDrag = ({ onNodeLink, onNodeLinkCheck }) => {
        const [dragNode, setDragNode] = React.useState(null);
        const [dragPort, setDragPort] = React.useState(null);
        const [enteredNode, setEnteredNode] = React.useState(null);
        const [dragCoords, setDragCoords] = React.useState(null);
        const [canLinkNode, setCanLinkNode] = React.useState(null);
        const onDragStart = (_state, _initial, node, port) => {
            setDragNode(node);
            setDragPort(port);
        };
        const onDrag = ({ memo: [matrix], xy: [x, y] }, [ix, iy]) => {
            const endPoint = transformationMatrix.applyToPoint(transformationMatrix.inverse(matrix), { x, y });
            setDragCoords([
                {
                    startPoint: {
                        x: ix,
                        y: iy
                    },
                    endPoint
                }
            ]);
        };
        const onDragEnd = () => {
            if (dragNode && enteredNode && canLinkNode && dragNode.parent !== enteredNode.id) {
                onNodeLink(dragNode, enteredNode, dragPort);
            }
            setDragNode(null);
            setDragPort(null);
            setEnteredNode(null);
            setDragCoords(null);
        };
        const onEnter = (_event, node) => {
            setEnteredNode(node);
            if (dragNode && node && dragNode.parent !== node.id) {
                const canLink = onNodeLinkCheck(dragNode, node, dragPort);
                const result = (canLink === undefined || canLink) && dragNode.parent === node.parent;
                setCanLinkNode(result);
            }
        };
        const onLeave = () => {
            setEnteredNode(null);
            setCanLinkNode(null);
        };
        return {
            dragCoords,
            canLinkNode,
            dragNode,
            dragPort,
            enteredNode,
            onDragStart,
            onDrag,
            onDragEnd,
            onEnter,
            onLeave
        };
    };

    const limit = (scale, min, max) => scale < max ? (scale > min ? scale : min) : max;
    const useZoom = ({ disabled = false, zoom = 1, minZoom = -0.5, maxZoom = 1, onZoomChange }) => {
        const [factor, setFactor] = React.useState(zoom - 1);
        const svgRef = React.useRef(null);
        reactUseGesture.useGesture({
            onPinch: ({ offset: [d], event }) => {
                event.preventDefault();
                // TODO: Set X/Y on center of zoom
                const next = limit(d / 100, minZoom, maxZoom);
                setFactor(next);
                onZoomChange(next + 1);
            }
        }, {
            enabled: !disabled,
            domTarget: svgRef,
            eventOptions: { passive: false }
        });
        const setZoom = (f) => {
            const next = limit(f, minZoom, maxZoom);
            setFactor(next);
            onZoomChange(next + 1);
        };
        const zoomIn = () => {
            setZoom(factor + 0.1);
        };
        const zoomOut = () => {
            setZoom(factor - 0.1);
        };
        return {
            svgRef,
            zoom: factor + 1,
            setZoom,
            zoomIn,
            zoomOut
        };
    };

    const CanvasContext = React.createContext({});
    const CanvasProvider = ({ selections, onNodeLink, readonly, children, nodes, edges, maxHeight, fit, maxWidth, direction, pannable, center, zoomable, zoom, minZoom, maxZoom, onNodeLinkCheck, onLayoutChange, onZoomChange }) => {
        const zoomProps = useZoom({
            zoom,
            minZoom,
            maxZoom,
            disabled: !zoomable,
            onZoomChange
        });
        const layoutProps = useLayout({
            nodes,
            edges,
            maxHeight,
            maxWidth,
            direction,
            pannable,
            center,
            fit,
            zoom: zoomProps.zoom,
            setZoom: zoomProps.setZoom,
            onLayoutChange
        });
        const dragProps = useEdgeDrag({
            onNodeLink,
            onNodeLinkCheck
        });
        return (React__default['default'].createElement(CanvasContext.Provider, { value: Object.assign(Object.assign(Object.assign({ selections,
                readonly,
                pannable }, layoutProps), zoomProps), dragProps) }, children));
    };
    const useCanvas = () => {
        const context = React.useContext(CanvasContext);
        if (context === undefined) {
            throw new Error('`useCanvas` hook must be used within a `CanvasContext` component');
        }
        return context;
    };

    const useNodeDrag = ({ x, y, height, width, onDrag, onDragEnd, onDragStart, node, disabled }) => {
        const initial = [width / 2 + x, height + y];
        const targetRef = React.useRef(null);
        const { zoom, scrollXY, layout, containerWidth, containerRef, containerHeight } = useCanvas();
        const bind = reactUseGesture.useDrag((state) => {
            if (state.event.type === 'pointerdown') {
                targetRef.current = state.event.currentTarget;
            }
            if (!state.intentional || !targetRef.current) {
                return;
            }
            if (state.first) {
                const { top, left } = containerRef.current.getBoundingClientRect();
                const offsetX = scrollXY[0] - containerRef.current.scrollLeft;
                const offsetY = scrollXY[1] - containerRef.current.scrollTop;
                const tx = (containerWidth - layout.width * zoom) / 2 + offsetX + left;
                const ty = (containerHeight - layout.height * zoom) / 2 + offsetY + top;
                const matrix = transformationMatrix.transform(transformationMatrix.fromDefinition([
                    { type: 'translate', tx, ty },
                    { type: 'scale', sx: zoom, sy: zoom }
                ]));
                // memo will hold the difference between the
                // first point of impact and the origin
                const memo = [matrix];
                onDragStart(Object.assign(Object.assign({}, state), { memo }), initial, node);
                document.body.classList.add('dragging');
                return memo;
            }
            onDrag(state, initial, node);
            if (state.last) {
                targetRef.current = null;
                onDragEnd(state, initial, node);
                document.body.classList.remove('dragging');
            }
        }, {
            enabled: !disabled,
            triggerAllEvents: true,
            threshold: 5
        });
        return bind;
    };

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z = ".Port-module_port__R5Ksl {\n  stroke: #0d0e17;\n  fill: #3E405A;\n  stroke-width: 2px;\n  shape-rendering: geometricPrecision; }\n  .Port-module_port__R5Ksl:hover {\n    cursor: pointer; }\n";
    var css = {"port":"Port-module_port__R5Ksl"};
    styleInject(css_248z);

    const Port = React.forwardRef(({ x, y, rx, ry, disabled, style, properties, offsetX, offsetY, className, active, onDrag = () => undefined, onDragStart = () => undefined, onDragEnd = () => undefined, onEnter = () => undefined, onLeave = () => undefined, onClick = () => undefined }, ref) => {
        const { readonly } = useCanvas();
        const [dragging, setDragging] = React.useState(false);
        const newX = x - properties.width / 2;
        const newY = y - properties.height / 2;
        const onDragStartInternal = (event, initial) => {
            onDragStart(event, initial, properties);
            setDragging(true);
        };
        const onDragEndInternal = (event, initial) => {
            onDragEnd(event, initial, properties);
            setDragging(false);
        };
        const bind = useNodeDrag({
            x: newX + offsetX,
            y: newY + offsetY,
            height: properties.height,
            width: properties.width,
            disabled: disabled || readonly,
            node: properties,
            onDrag,
            onDragStart: onDragStartInternal,
            onDragEnd: onDragEndInternal
        });
        if (properties.hidden) {
            return null;
        }
        return (React__default['default'].createElement("g", null,
            React__default['default'].createElement(framerMotion.motion.rect, Object.assign({}, bind(), { ref: ref, key: `${x}-${y}`, style: style, className: classNames__default['default'](css.port, className, properties === null || properties === void 0 ? void 0 : properties.className), height: properties.height, width: properties.width, rx: rx, ry: ry, initial: {
                    scale: 0,
                    opacity: 0,
                    x: newX,
                    y: newY
                }, animate: {
                    x: newX,
                    y: newY,
                    scale: dragging || active ? 1.5 : 1,
                    opacity: 1
                }, whileHover: { scale: disabled ? 1 : 1.5 }, onMouseEnter: (event) => {
                    event.stopPropagation();
                    onEnter(event, properties);
                }, onMouseLeave: (event) => {
                    event.stopPropagation();
                    onLeave(event, properties);
                }, onClick: (event) => {
                    event.stopPropagation();
                    onClick(event, properties);
                } }))));
    });

    var css_248z$1 = ".Label-module_text__3S-Cr {\n  fill: #d6e7ff;\n  pointer-events: none;\n  font-size: 14px;\n  text-rendering: geometricPrecision;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n";
    var css$1 = {"text":"Label-module_text__3S-Cr"};
    styleInject(css_248z$1);

    const Label = ({ text, x, y, style, className, originalText }) => (React__default['default'].createElement("g", { transform: `translate(${x}, ${y})` },
        React__default['default'].createElement("title", null, originalText),
        React__default['default'].createElement("text", { className: classNames__default['default'](css$1.text, className), style: style }, text)));

    var css_248z$2 = ".Remove-module_deleteX__1iSRM {\n  stroke: black;\n  pointer-events: none; }\n\n.Remove-module_container__3kDdr {\n  will-change: transform, opacity; }\n\n.Remove-module_drop__1VaCm {\n  cursor: pointer;\n  opacity: 0; }\n\n.Remove-module_rect__31FMc {\n  shape-rendering: geometricPrecision;\n  fill: #ff005d;\n  border-radius: 2px;\n  pointer-events: none; }\n";
    var css$2 = {"deleteX":"Remove-module_deleteX__1iSRM","container":"Remove-module_container__3kDdr","drop":"Remove-module_drop__1VaCm","rect":"Remove-module_rect__31FMc"};
    styleInject(css_248z$2);

    const Remove = ({ size = 15, className, hidden, x, y, onClick = () => undefined, onEnter = () => undefined, onLeave = () => undefined }) => {
        if (hidden) {
            return null;
        }
        const half = size / 2;
        const translateX = x - half;
        const translateY = y - half;
        return (React__default['default'].createElement(framerMotion.motion.g, { className: classNames__default['default'](className, css$2.container), initial: { scale: 0, opacity: 0, translateX, translateY }, animate: { scale: 1, opacity: 1, translateX, translateY }, whileHover: { scale: 1.2 }, whileTap: { scale: 0.8 } },
            React__default['default'].createElement("rect", { height: size * 1.5, width: size * 1.5, className: css$2.drop, onMouseEnter: onEnter, onMouseLeave: onLeave, onClick: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onClick(event);
                } }),
            React__default['default'].createElement("rect", { height: size, width: size, className: css$2.rect }),
            React__default['default'].createElement("line", { x1: "2", y1: size - 2, x2: size - 2, y2: "2", className: css$2.deleteX, strokeWidth: "1" }),
            React__default['default'].createElement("line", { x1: "2", y1: "2", x2: size - 2, y2: size - 2, className: css$2.deleteX, strokeWidth: "1" })));
    };

    /**
     * Center helper.
     * Ref: https://github.com/wbkd/react-flow/blob/main/src/components/Edges/utils.ts#L18
     */
    function getBezierCenter({ sourceX, sourceY, targetX, targetY }) {
        const xOffset = Math.abs(targetX - sourceX) / 2;
        const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
        const yOffset = Math.abs(targetY - sourceY) / 2;
        const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
        return [centerX, centerY, xOffset, yOffset];
    }
    /**
     * Path helper utils.
     * Ref: https://github.com/wbkd/react-flow/blob/main/src/components/Edges/BezierEdge.tsx#L19
     */
    function getBezierPath({ sourceX, sourceY, sourcePosition = 'bottom', targetX, targetY, targetPosition = 'top' }) {
        const leftAndRight = ['left', 'right'];
        const [centerX, centerY] = getBezierCenter({
            sourceX,
            sourceY,
            targetX,
            targetY
        });
        let path = `M${sourceX},${sourceY} C${sourceX},${centerY} ${targetX},${centerY} ${targetX},${targetY}`;
        if (leftAndRight.includes(sourcePosition) &&
            leftAndRight.includes(targetPosition)) {
            path = `M${sourceX},${sourceY} C${centerX},${sourceY} ${centerX},${targetY} ${targetX},${targetY}`;
        }
        else if (leftAndRight.includes(targetPosition)) {
            path = `M${sourceX},${sourceY} C${sourceX},${targetY} ${sourceX},${targetY} ${targetX},${targetY}`;
        }
        else if (leftAndRight.includes(sourcePosition)) {
            path = `M${sourceX},${sourceY} C${targetX},${sourceY} ${targetX},${sourceY} ${targetX},${targetY}`;
        }
        return path;
    }
    /**
     * Calculate actual center for a path element.
     */
    function getCenter(pathElm) {
        const pLength = pathElm.getTotalLength();
        const pieceSize = pLength / 2;
        const { x, y } = pathElm.getPointAtLength(pieceSize);
        const angle = (Math.atan2(x, y) * 180) / Math.PI;
        return { x, y, angle };
    }
    /**
     * Get the angle for the path.
     */
    function getAngle(source, target) {
        const dx = source.x - target.x;
        const dy = source.y - target.y;
        let theta = Math.atan2(-dy, -dx);
        theta *= 180 / Math.PI;
        if (theta < 0) {
            theta += 360;
        }
        return theta;
    }
    /**
     * Get the center for the path element.
     */
    function getPathCenter(pathElm, firstPoint, lastPoint) {
        if (!pathElm) {
            return null;
        }
        const angle = getAngle(firstPoint, lastPoint);
        const point = getCenter(pathElm);
        return Object.assign(Object.assign({}, point), { angle });
    }

    var css_248z$3 = ".Add-module_plus__17BIZ {\n  stroke: black;\n  pointer-events: none; }\n\n.Add-module_container__BELBh {\n  will-change: transform, opacity; }\n\n.Add-module_drop__2XI3R {\n  cursor: pointer;\n  opacity: 0; }\n\n.Add-module_rect__1fgJ5 {\n  shape-rendering: geometricPrecision;\n  fill: #46fecb;\n  border-radius: 2px;\n  pointer-events: none; }\n";
    var css$3 = {"plus":"Add-module_plus__17BIZ","container":"Add-module_container__BELBh","drop":"Add-module_drop__2XI3R","rect":"Add-module_rect__1fgJ5"};
    styleInject(css_248z$3);

    const Add = ({ x, y, offsetX = 10, offsetY = 10, className, size = 15, hidden = true, onEnter = () => undefined, onLeave = () => undefined, onClick = () => undefined, custom }) => {
        if (hidden) {
            return null;
        }
        const half = size / 2;
        const translateX = x - half;
        const translateY = y - half;
        if (custom) {
            return (React__default['default'].createElement("foreignObject", { style: { overflow: 'visible' }, x: translateX - offsetX, y: translateY - offsetY, width: 1, height: 1, onClick: onClick }, custom));
        }
        return (React__default['default'].createElement(framerMotion.motion.g, { className: classNames__default['default'](className, css$3.container), initial: { scale: 0, opacity: 0, translateX, translateY }, animate: { scale: 1, opacity: 1, translateX, translateY }, whileHover: { scale: 1.2 }, whileTap: { scale: 0.8 } },
            React__default['default'].createElement("rect", { height: size * 2, width: size * 2, className: css$3.drop, onClick: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onClick(event);
                }, onMouseEnter: onEnter, onMouseLeave: onLeave }),
            React__default['default'].createElement("rect", { height: size, width: size, className: css$3.rect }),
            React__default['default'].createElement("line", { x1: "2", x2: size - 2, y1: half, y2: half, className: css$3.plus, strokeWidth: "1" }),
            React__default['default'].createElement("line", { x1: half, x2: half, y1: "2", y2: size - 2, className: css$3.plus, strokeWidth: "1" })));
    };

    var css_248z$4 = ".Edge-module_edge__3rRn8.Edge-module_disabled__3hRqS {\n  pointer-events: none; }\n\n.Edge-module_edge__3rRn8:not(.Edge-module_disabled__3hRqS):hover .Edge-module_path__sMACX {\n  stroke: #a5a9e2; }\n\n.Edge-module_edge__3rRn8 .Edge-module_path__sMACX {\n  fill: none;\n  stroke: #485a74;\n  pointer-events: none;\n  shape-rendering: geometricPrecision;\n  stroke-width: 1pt; }\n  .Edge-module_edge__3rRn8 .Edge-module_path__sMACX.Edge-module_active__1-P8M {\n    stroke: #46FECB !important; }\n  .Edge-module_edge__3rRn8 .Edge-module_path__sMACX.Edge-module_deleteHovered__3K004 {\n    stroke: #ff005d !important;\n    stroke-dasharray: 4 2; }\n\n.Edge-module_edge__3rRn8 .Edge-module_clicker__2dQ69 {\n  fill: none;\n  stroke: transparent;\n  cursor: pointer;\n  stroke-width: 15px; }\n  .Edge-module_edge__3rRn8 .Edge-module_clicker__2dQ69:focus {\n    outline: none; }\n";
    var css$4 = {"edge":"Edge-module_edge__3rRn8","disabled":"Edge-module_disabled__3hRqS","path":"Edge-module_path__sMACX","active":"Edge-module_active__1-P8M","deleteHovered":"Edge-module_deleteHovered__3K004","clicker":"Edge-module_clicker__2dQ69"};
    styleInject(css_248z$4);

    const Edge = ({ sections, properties, labels, className, disabled, style, add = React__default['default'].createElement(Add, null), remove = React__default['default'].createElement(Remove, null), label = React__default['default'].createElement(Label, null), onClick = () => undefined, onKeyDown = () => undefined, onEnter = () => undefined, onLeave = () => undefined, onRemove = () => undefined, onAdd = () => undefined }) => {
        const pathRef = React.useRef(null);
        const [deleteHovered, setDeleteHovered] = React.useState(false);
        const [center, setCenter] = React.useState(null);
        const { selections, readonly } = useCanvas();
        const isActive = (selections === null || selections === void 0 ? void 0 : selections.length) ? selections.includes(properties === null || properties === void 0 ? void 0 : properties.id)
            : null;
        const d = React.useMemo(() => {
            if (!(sections === null || sections === void 0 ? void 0 : sections.length)) {
                return null;
            }
            // Handle bend points that elk gives
            // us seperately from drag points
            if (sections[0].bendPoints) {
                const points = sections
                    ? [
                        sections[0].startPoint,
                        ...(sections[0].bendPoints || []),
                        sections[0].endPoint
                    ]
                    : [];
                const pathFn = d3Shape.line()
                    .x((d) => d.x)
                    .y((d) => d.y)
                    .curve(d3Shape.curveBundle.beta(1));
                return pathFn(points);
            }
            else {
                return getBezierPath({
                    sourceX: sections[0].startPoint.x,
                    sourceY: sections[0].startPoint.y,
                    targetX: sections[0].endPoint.x,
                    targetY: sections[0].endPoint.y
                });
            }
        }, [sections]);
        React.useEffect(() => {
            if ((sections === null || sections === void 0 ? void 0 : sections.length) > 0) {
                setCenter(getPathCenter(pathRef.current, sections[0].startPoint, sections[0].endPoint));
            }
        }, [sections]);
        return (React__default['default'].createElement("g", { className: classNames__default['default'](css$4.edge, { [css$4.disabled]: disabled }) },
            React__default['default'].createElement("path", { ref: pathRef, style: style, className: classNames__default['default'](className, properties === null || properties === void 0 ? void 0 : properties.className, css$4.path, {
                    [css$4.active]: isActive,
                    [css$4.deleteHovered]: deleteHovered
                }), d: d, markerEnd: "url(#end-arrow)" }),
            React__default['default'].createElement("path", { className: css$4.clicker, d: d, tabIndex: -1, onClick: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onClick(event, properties);
                }, onKeyDown: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onKeyDown(event, properties);
                }, onMouseEnter: (event) => {
                    event.stopPropagation();
                    onEnter(event, properties);
                }, onMouseLeave: (event) => {
                    event.stopPropagation();
                    onLeave(event, properties);
                } }),
            (labels === null || labels === void 0 ? void 0 : labels.length) > 0 &&
                labels.map((l, index) => (React__default['default'].createElement(rdk.CloneElement, Object.assign({ element: label, key: index }, l)))),
            !disabled && center && !readonly && remove && (React__default['default'].createElement(rdk.CloneElement, Object.assign({ element: remove }, center, { hidden: remove.props.hidden !== undefined ? remove.props.hidden : !isActive, onClick: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onRemove(event, properties);
                    setDeleteHovered(false);
                }, onEnter: () => setDeleteHovered(true), onLeave: () => setDeleteHovered(false) }))),
            !disabled && center && !readonly && add && (React__default['default'].createElement(rdk.CloneElement, Object.assign({ element: add }, center, { onClick: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onAdd(event, properties);
                } })))));
    };

    /**
     * Checks if the node can be linked or not.
     */
    function checkNodeLinkable(curNode, enteredNode, canLinkNode) {
        if (canLinkNode === null || !enteredNode) {
            return null;
        }
        if (canLinkNode === false && enteredNode.id === curNode.id) {
            return false;
        }
        return true;
    }

    var css_248z$5 = ".Node-module_rect__1dlsl {\n  fill: #2b2c3e;\n  stroke: transparent;\n  transition: stroke 100ms ease-in-out;\n  stroke: #475872;\n  shape-rendering: geometricPrecision;\n  stroke-width: 1pt; }\n  .Node-module_rect__1dlsl:focus {\n    outline: none; }\n  .Node-module_rect__1dlsl.Node-module_children__21ooj {\n    fill: transparent;\n    stroke: #475872; }\n  .Node-module_rect__1dlsl:not(.Node-module_disabled__1DfSa) {\n    cursor: pointer; }\n    .Node-module_rect__1dlsl:not(.Node-module_disabled__1DfSa).Node-module_dragging__36JI3, .Node-module_rect__1dlsl:not(.Node-module_disabled__1DfSa):hover {\n      stroke: #a5a9e2; }\n    .Node-module_rect__1dlsl:not(.Node-module_disabled__1DfSa).Node-module_active__3bPi_ {\n      stroke: #46fecb; }\n    .Node-module_rect__1dlsl:not(.Node-module_disabled__1DfSa).Node-module_unlinkable__1MEKJ {\n      stroke: #ff005d; }\n    .Node-module_rect__1dlsl:not(.Node-module_disabled__1DfSa).Node-module_deleteHovered__1_CqM {\n      stroke: #ff005d;\n      stroke-dasharray: 4 2; }\n";
    var css$5 = {"rect":"Node-module_rect__1dlsl","children":"Node-module_children__21ooj","disabled":"Node-module_disabled__1DfSa","dragging":"Node-module_dragging__36JI3","active":"Node-module_active__3bPi_","unlinkable":"Node-module_unlinkable__1MEKJ","deleteHovered":"Node-module_deleteHovered__1_CqM"};
    styleInject(css_248z$5);

    const Node = ({ id, x, y, ports, labels, height, width, properties, className, rx = 2, ry = 2, offsetX = 0, offsetY = 0, icon, disabled, style, children, nodes, edges, childEdge = React__default['default'].createElement(Edge, null), childNode = React__default['default'].createElement(Node, null), remove = React__default['default'].createElement(Remove, null), port = React__default['default'].createElement(Port, null), label = React__default['default'].createElement(Label, null), isDraggable = false, onRemove = () => undefined, onDrag = () => undefined, onDragStart = () => undefined, onDragEnd = () => undefined, onClick = () => undefined, onKeyDown = () => undefined, onEnter = () => undefined, onLeave = () => undefined }) => {
        const controls = framerMotion.useAnimation();
        const _a = useCanvas(), { canLinkNode, enteredNode, selections, readonly } = _a, canvas = __rest(_a, ["canLinkNode", "enteredNode", "selections", "readonly"]);
        const [deleteHovered, setDeleteHovered] = React.useState(false);
        const [dragging, setDragging] = React.useState(false);
        const isActive = (selections === null || selections === void 0 ? void 0 : selections.length) ? selections.includes(properties.id)
            : null;
        const newX = x + offsetX;
        const newY = y + offsetY;
        const isLinkable = checkNodeLinkable(properties, enteredNode, canLinkNode);
        const isMultiPort = (ports === null || ports === void 0 ? void 0 : ports.filter((p) => { var _a; return !((_a = p.properties) === null || _a === void 0 ? void 0 : _a.hidden); }).length) > 1;
        const [dragY, setDragY] = React.useState(0);
        const bind = useNodeDrag({
            x: newX,
            y: newY,
            height,
            width,
            disabled: disabled || isMultiPort || readonly,
            node: properties,
            onDrag: (...props) => {
                canvas.onDrag(...props);
                onDrag(...props);
                setDragY(props[0].movement[1]);
            },
            onDragStart: (...props) => {
                canvas.onDragStart(...props);
                onDragStart(...props);
                setDragging(true);
            },
            onDragEnd: (...props) => {
                canvas.onDragEnd(...props);
                onDragEnd(...props);
                console.log('props', props[0]);
                setDragY(y);
                setDragging(false);
            }
        });
        React.useEffect(() => {
            controls.set({
                opacity: 1,
                translateX: x,
                translateY: y
            });
        }, [controls, x, y]);
        const renderNode = React.useCallback((_a) => {
            var { children } = _a, n = __rest(_a, ["children"]);
            const element = typeof childNode === 'function' ? childNode(n) : childNode;
            return (React__default['default'].createElement(rdk.CloneElement, Object.assign({ key: n.id, element: element, id: `${id}-node-${n.id}`, disabled: disabled, nodes: children, offsetX: newX, offsetY: newY, children: element.props.children, childNode: childNode, childEdge: childEdge, onDragStart: onDragStart, onDrag: onDrag, onDragEnd: onDragEnd, onClick: onClick, onEnter: onEnter, onLeave: onLeave, onKeyDown: onKeyDown, onRemove: onRemove }, n)));
        }, [
            childNode,
            id,
            disabled,
            newX,
            newY,
            childEdge,
            onDragStart,
            onDrag,
            onDragEnd,
            onClick,
            onEnter,
            onLeave,
            onKeyDown,
            onRemove
        ]);
        const renderEdge = React.useCallback((e) => {
            const element = typeof childEdge === 'function' ? childEdge(e) : childEdge;
            return (React__default['default'].createElement(rdk.CloneElement, Object.assign({ key: e.id, element: element, id: `${id}-edge-${e.id}`, disabled: disabled }, e)));
        }, [childEdge, disabled, id]);
        return isDraggable ? (React__default['default'].createElement(framerMotion.motion.g, { initial: {
                cursor: 'initial',
                opacity: 0,
                translateX: x,
                translateY: y
            }, y: dragY, animate: controls },
            React__default['default'].createElement(framerMotion.motion.rect, Object.assign({}, bind(), { tabIndex: -1, onKeyDown: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onKeyDown(event, properties);
                }, onClick: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onClick(event, properties);
                }, onTouchStart: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                }, onMouseEnter: (event) => {
                    event.stopPropagation();
                    canvas.onEnter(event, properties);
                    onEnter(event, properties);
                }, onMouseLeave: (event) => {
                    event.stopPropagation();
                    canvas.onLeave(event, properties);
                    onLeave(event, properties);
                }, className: classNames__default['default'](css$5.rect, className, properties === null || properties === void 0 ? void 0 : properties.className, {
                    [css$5.active]: isActive,
                    [css$5.disabled]: disabled,
                    [css$5.unlinkable]: isLinkable === false,
                    [css$5.dragging]: dragging,
                    [css$5.children]: (nodes === null || nodes === void 0 ? void 0 : nodes.length) > 0,
                    [css$5.deleteHovered]: deleteHovered
                }), style: style, height: height, width: width, rx: rx, ry: ry, initial: {
                    opacity: 0
                }, animate: {
                    opacity: 1
                } })),
            children && (React__default['default'].createElement("foreignObject", { height: height, width: width, x: 0, y: 0 }, typeof children === 'function'
                ? children({ height, width, x, y, node: properties })
                : children)),
            icon && properties.icon && (React__default['default'].createElement(rdk.CloneElement, Object.assign({ element: icon }, properties.icon))),
            (labels === null || labels === void 0 ? void 0 : labels.length) > 0 &&
                labels.map((l, index) => (React__default['default'].createElement(rdk.CloneElement, Object.assign({ element: label, key: index }, l)))),
            (ports === null || ports === void 0 ? void 0 : ports.length) > 0 &&
                ports.map((p) => (React__default['default'].createElement(rdk.CloneElement, Object.assign({ element: port, key: p.id, active: !isMultiPort && dragging, disabled: disabled, offsetX: newX, offsetY: newY, onDragStart: (event, initial, data) => {
                        canvas.onDragStart(event, initial, properties, data);
                        onDragStart(event, initial, properties, data);
                        setDragging(true);
                    }, onDrag: (event, initial, data) => {
                        canvas.onDrag(event, initial, properties, data);
                        onDrag(event, initial, properties, data);
                    }, onDragEnd: (event, initial, data) => {
                        canvas.onDragEnd(event, initial, properties, data);
                        onDragEnd(event, initial, properties, data);
                        setDragging(false);
                    } }, p)))),
            !disabled && isActive && !readonly && remove && (React__default['default'].createElement(rdk.CloneElement, { element: remove, y: height / 2, x: width, onClick: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onRemove(event, properties);
                    setDeleteHovered(false);
                }, onEnter: () => setDeleteHovered(true), onLeave: () => setDeleteHovered(false) })),
            React__default['default'].createElement("g", null,
                (edges === null || edges === void 0 ? void 0 : edges.length) > 0 && edges.map(renderEdge),
                (nodes === null || nodes === void 0 ? void 0 : nodes.length) > 0 && nodes.map(renderNode)))) : (React__default['default'].createElement(framerMotion.motion.g, { initial: {
                cursor: 'initial',
                opacity: 0,
                translateX: x,
                translateY: y
            }, animate: controls },
            React__default['default'].createElement(framerMotion.motion.rect, Object.assign({}, bind(), { tabIndex: -1, onKeyDown: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onKeyDown(event, properties);
                }, onClick: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onClick(event, properties);
                }, onTouchStart: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                }, onMouseEnter: (event) => {
                    event.stopPropagation();
                    canvas.onEnter(event, properties);
                    onEnter(event, properties);
                }, onMouseLeave: (event) => {
                    event.stopPropagation();
                    canvas.onLeave(event, properties);
                    onLeave(event, properties);
                }, className: classNames__default['default'](css$5.rect, className, properties === null || properties === void 0 ? void 0 : properties.className, {
                    [css$5.active]: isActive,
                    [css$5.disabled]: disabled,
                    [css$5.unlinkable]: isLinkable === false,
                    [css$5.dragging]: dragging,
                    [css$5.children]: (nodes === null || nodes === void 0 ? void 0 : nodes.length) > 0,
                    [css$5.deleteHovered]: deleteHovered
                }), style: style, height: height, width: width, rx: rx, ry: ry, initial: {
                    opacity: 0
                }, animate: {
                    opacity: 1
                } })),
            children && (React__default['default'].createElement("foreignObject", { height: height, width: width, x: 0, y: 0 }, typeof children === 'function'
                ? children({ height, width, x, y, node: properties })
                : children)),
            icon && properties.icon && (React__default['default'].createElement(rdk.CloneElement, Object.assign({ element: icon }, properties.icon))),
            (labels === null || labels === void 0 ? void 0 : labels.length) > 0 &&
                labels.map((l, index) => (React__default['default'].createElement(rdk.CloneElement, Object.assign({ element: label, key: index }, l)))),
            (ports === null || ports === void 0 ? void 0 : ports.length) > 0 &&
                ports.map((p) => (React__default['default'].createElement(rdk.CloneElement, Object.assign({ element: port, key: p.id, active: !isMultiPort && dragging, disabled: disabled, offsetX: newX, offsetY: newY, onDragStart: (event, initial, data) => {
                        canvas.onDragStart(event, initial, properties, data);
                        onDragStart(event, initial, properties, data);
                        setDragging(true);
                    }, onDrag: (event, initial, data) => {
                        canvas.onDrag(event, initial, properties, data);
                        onDrag(event, initial, properties, data);
                    }, onDragEnd: (event, initial, data) => {
                        canvas.onDragEnd(event, initial, properties, data);
                        onDragEnd(event, initial, properties, data);
                        setDragging(false);
                    } }, p)))),
            !disabled && isActive && !readonly && remove && (React__default['default'].createElement(rdk.CloneElement, { element: remove, y: height / 2, x: width, onClick: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onRemove(event, properties);
                    setDeleteHovered(false);
                }, onEnter: () => setDeleteHovered(true), onLeave: () => setDeleteHovered(false) })),
            React__default['default'].createElement("g", null,
                (edges === null || edges === void 0 ? void 0 : edges.length) > 0 && edges.map(renderEdge),
                (nodes === null || nodes === void 0 ? void 0 : nodes.length) > 0 && nodes.map(renderNode))));
    };

    var css_248z$6 = ".Arrow-module_arrow__-MIdh {\n  pointer-events: none;\n  shape-rendering: geometricPrecision;\n  fill: #485a74; }\n";
    var css$6 = {"arrow":"Arrow-module_arrow__-MIdh"};
    styleInject(css_248z$6);

    const Arrow = ({ size = 8, y = 0, x = 0, angle = 0, className, style }) => (React__default['default'].createElement("path", { style: style, transform: `translate(${x}, ${y}) rotate(${angle})`, className: classNames__default['default'](css$6.arrow, className), d: `M0,-${size / 2}L${size},0L0,${size / 2}` }));

    const MarkerArrow = ({ size = 8, className, style }) => (React__default['default'].createElement("marker", { id: "end-arrow", key: "end-arrow", viewBox: `0 -${size / 2} ${size} ${size}`, refX: `${size}`, markerWidth: `${size}`, markerHeight: `${size}`, orient: "auto" },
        React__default['default'].createElement(Arrow, { size: size, style: style, className: className })));

    var css_248z$7 = ".Canvas-module_container__19YzY.Canvas-module_pannable__3bd7f {\n  overflow: auto; }\n\n.Canvas-module_container__19YzY:focus {\n  outline: none; }\n\n.dragging {\n  cursor: crosshair;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n";
    var css$7 = {"container":"Canvas-module_container__19YzY","pannable":"Canvas-module_pannable__3bd7f"};
    styleInject(css_248z$7);

    const InternalCanvas = React.forwardRef(({ className, height = '100%', width = '100%', readonly, disabled = false, arrow = React__default['default'].createElement(MarkerArrow, null), node = React__default['default'].createElement(Node, null), edge = React__default['default'].createElement(Edge, null), dragEdge = React__default['default'].createElement(Edge, { add: null }), onMouseEnter = () => undefined, onMouseLeave = () => undefined, onCanvasClick = () => undefined }, ref) => {
        var _a, _b;
        const id = rdk.useId();
        const { pannable, dragCoords, layout, containerRef, svgRef, canvasHeight, canvasWidth, xy, zoom: scale, setZoom, zoomIn, zoomOut, centerCanvas, fitCanvas } = useCanvas();
        React.useImperativeHandle(ref, () => ({
            centerCanvas,
            setZoom,
            zoomIn,
            zoomOut,
            fitCanvas
        }));
        const renderNode = React.useCallback((_a) => {
            var { children } = _a, n = __rest(_a, ["children"]);
            const element = typeof node === 'function' ? node(n) : node;
            return (React__default['default'].createElement(rdk.CloneElement, Object.assign({ key: n.id, element: element, id: `${id}-node-${n.id}`, disabled: disabled, children: element.props.children, nodes: children, childEdge: edge, childNode: node }, n)));
        }, [node, edge, disabled, id]);
        const renderEdge = React.useCallback((e) => {
            const element = typeof edge === 'function' ? edge(e) : edge;
            return (React__default['default'].createElement(rdk.CloneElement, Object.assign({ key: e.id, element: element, id: `${id}-edge-${e.id}`, disabled: disabled }, e)));
        }, [edge, disabled, id]);
        const mount = React.useRef(false);
        React.useLayoutEffect(() => {
            if (!mount.current && layout !== null && xy[0] > 0 && xy[1] > 0) {
                mount.current = true;
            }
        }, [layout, xy]);
        return (React__default['default'].createElement("div", { style: { height, width }, className: classNames__default['default'](css$7.container, className, {
                [css$7.pannable]: pannable
            }), ref: containerRef, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave },
            React__default['default'].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", id: id, ref: svgRef, height: canvasHeight, width: canvasWidth, onClick: onCanvasClick },
                arrow !== null && (React__default['default'].createElement("defs", null,
                    React__default['default'].createElement(rdk.CloneElement, Object.assign({ element: arrow }, arrow)))),
                React__default['default'].createElement(framerMotion.motion.g, { initial: {
                        opacity: 0,
                        scale: 0,
                        transition: {
                            translateX: false,
                            translateY: false
                        }
                    }, animate: {
                        opacity: 1,
                        translateX: xy[0],
                        translateY: xy[1],
                        scale,
                        transition: {
                            velocity: 100,
                            translateX: { duration: mount.current ? 0.3 : 0 },
                            translateY: { duration: mount.current ? 0.3 : 0 },
                            opacity: { duration: 0.8 },
                            when: 'beforeChildren'
                        }
                    } }, (_a = layout === null || layout === void 0 ? void 0 : layout.edges) === null || _a === void 0 ? void 0 :
                    _a.map(renderEdge), (_b = layout === null || layout === void 0 ? void 0 : layout.children) === null || _b === void 0 ? void 0 :
                    _b.map(renderNode),
                    dragCoords !== null && !readonly && (React__default['default'].createElement(rdk.CloneElement, { element: dragEdge, id: `${id}-drag`, disabled: true, sections: dragCoords }))))));
    });
    const Canvas = React.forwardRef((_a, ref) => {
        var { selections = [], readonly = false, fit = false, nodes = [], edges = [], maxHeight = 2000, maxWidth = 2000, direction = 'DOWN', pannable = true, zoom = 1, center = true, zoomable = true, minZoom = -0.5, maxZoom = 1, onNodeLink = () => undefined, onNodeLinkCheck = () => undefined, onLayoutChange = () => undefined, onZoomChange = () => undefined } = _a, rest = __rest(_a, ["selections", "readonly", "fit", "nodes", "edges", "maxHeight", "maxWidth", "direction", "pannable", "zoom", "center", "zoomable", "minZoom", "maxZoom", "onNodeLink", "onNodeLinkCheck", "onLayoutChange", "onZoomChange"]);
        return (React__default['default'].createElement(CanvasProvider, { nodes: nodes, edges: edges, zoom: zoom, center: center, minZoom: minZoom, maxZoom: maxZoom, fit: fit, maxHeight: maxHeight, maxWidth: maxWidth, direction: direction, pannable: pannable, zoomable: zoomable, readonly: readonly, onLayoutChange: onLayoutChange, selections: selections, onZoomChange: onZoomChange, onNodeLink: onNodeLink, onNodeLinkCheck: onNodeLinkCheck },
            React__default['default'].createElement(InternalCanvas, Object.assign({ ref: ref }, rest))));
    });

    var css_248z$8 = ".Icon-module_icon__1vw_b {\n  pointer-events: none; }\n";
    var css$8 = {"icon":"Icon-module_icon__1vw_b"};
    styleInject(css_248z$8);

    const Icon = ({ x, y, url, style, className, height = 40, width = 40 }) => (React__default['default'].createElement("g", { className: classNames__default['default'](css$8.icon, className), transform: `translate(${x - width / 2}, ${y - height / 2})` },
        React__default['default'].createElement("image", { style: style, xlinkHref: url, width: width, height: height })));

    /**
     * Helper function for upserting a node in a edge.
     */
    function upsertNode(nodes, edges, edge, newNode) {
        return {
            nodes: [...nodes, newNode],
            edges: [
                ...edges.filter((e) => e.id !== edge.id),
                {
                    id: `${edge.from}-${newNode.id}`,
                    from: edge.from,
                    to: newNode.id
                },
                {
                    id: `${newNode.id}-${edge.to}`,
                    from: newNode.id,
                    to: edge.to
                }
            ]
        };
    }
    /**
     * Helper function for removing a node between edges and
     * linking the children.
     */
    function removeAndUpsertNodes(nodes, edges, removeNodes, onNodeLinkCheck) {
        if (!Array.isArray(removeNodes)) {
            removeNodes = [removeNodes];
        }
        const nodeIds = removeNodes.map((n) => n.id);
        const newNodes = nodes.filter((n) => !nodeIds.includes(n.id));
        const newEdges = edges.filter((e) => !nodeIds.includes(e.from) && !nodeIds.includes(e.to));
        for (const nodeId of nodeIds) {
            const sourceEdges = edges.filter((e) => e.to === nodeId);
            const targetEdges = edges.filter((e) => e.from === nodeId);
            for (const sourceEdge of sourceEdges) {
                for (const targetEdge of targetEdges) {
                    const sourceNode = nodes.find((n) => n.id === sourceEdge.from);
                    const targetNode = nodes.find((n) => n.id === targetEdge.to);
                    if (sourceNode && targetNode) {
                        const canLink = onNodeLinkCheck === null || onNodeLinkCheck === void 0 ? void 0 : onNodeLinkCheck(newNodes, newEdges, sourceNode, targetNode);
                        if (canLink === undefined || canLink) {
                            newEdges.push({
                                id: `${sourceNode.id}-${targetNode.id}`,
                                from: sourceNode.id,
                                to: targetNode.id,
                                parent: sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.parent
                            });
                        }
                    }
                }
            }
        }
        return {
            edges: newEdges,
            nodes: newNodes
        };
    }
    /**
     * Helper function to remove a node and its related edges.
     */
    function removeNode(nodes, edges, removeNodes) {
        if (!Array.isArray(removeNodes)) {
            removeNodes = [removeNodes];
        }
        const newNodes = [];
        const newEdges = [];
        for (const node of nodes) {
            const has = removeNodes.some((n) => n === node.id);
            if (!has) {
                newNodes.push(node);
            }
        }
        for (const edge of edges) {
            const has = removeNodes.some((n) => n === edge.from || n === edge.to);
            if (!has) {
                newEdges.push(edge);
            }
        }
        return {
            nodes: newNodes,
            edges: newEdges
        };
    }
    /**
     * Add a node and optional edge.
     */
    function addNodeAndEdge(nodes, edges, node, toNode) {
        return {
            nodes: [...nodes, node],
            edges: [
                ...edges,
                ...(toNode
                    ? [
                        {
                            id: `${toNode.id}-${node.id}`,
                            from: toNode.id,
                            to: node.id
                        }
                    ]
                    : [])
            ]
        };
    }
    /**
     * Helper function to determine if edge already has a link.
     */
    function hasLink(edges, from, to) {
        return edges.some((e) => e.from === from.id && e.to === to.id);
    }
    /**
     * Get sources pointing to a node.
     */
    function getSourceNodesForTargetId(nodes, edges, nodeId) {
        const sourceNodeIds = edges.reduce((acc, edge) => {
            if (edge.to === nodeId) {
                acc.push(edge.from);
            }
            return acc;
        }, []);
        const node = nodes.find((n) => n.id === nodeId);
        if (node === null || node === void 0 ? void 0 : node.parent) {
            sourceNodeIds.push(node.parent);
        }
        return nodes.filter((n) => sourceNodeIds.includes(n.id));
    }
    /**
     * Detect if there is a circular reference from the from to the source node.
     */
    function detectCircular(nodes, edges, fromNode, toNode) {
        let found = false;
        const traverse = (nodeId) => {
            const sourceNodes = getSourceNodesForTargetId(nodes, edges, nodeId);
            for (const node of sourceNodes) {
                if (node.id !== toNode.id) {
                    traverse(node.id);
                }
                else {
                    found = true;
                    break;
                }
            }
        };
        traverse(fromNode.id);
        return found;
    }
    /**
     * Given a node id, get all the parent nodes recursively.
     */
    const getParentsForNodeId = (nodes, edges, startId) => {
        const result = [];
        const traverse = (nodeId) => {
            const sourceNodes = getSourceNodesForTargetId(nodes, edges, nodeId);
            for (const node of sourceNodes) {
                const has = result.find((n) => n.id === node.id);
                if (!has) {
                    result.push(node);
                    traverse(node.id);
                }
            }
        };
        traverse(startId);
        return result;
    };

    const useSelection = ({ selections = [], nodes = [], edges = [], onSelection = () => undefined, onDataChange = () => undefined }) => {
        const [internalSelections, setInternalSelections] = React.useState(selections);
        const [metaKeyDown, setMetaKeyDown] = React.useState(false);
        // TODO: Fix this reference issue in reakeys
        const selectionRef = React.useRef(internalSelections);
        selectionRef.current = internalSelections;
        const nodesRef = React.useRef(nodes);
        nodesRef.current = nodes;
        const edgeRef = React.useRef(edges);
        edgeRef.current = edges;
        const addSelection = (item) => {
            const has = internalSelections.includes(item);
            if (!has) {
                const next = [...internalSelections, item];
                onSelection(next);
                setInternalSelections(next);
            }
        };
        const removeSelection = (item) => {
            const has = internalSelections.includes(item);
            if (has) {
                const next = internalSelections.filter((i) => i !== item);
                onSelection(next);
                setInternalSelections(next);
            }
        };
        const toggleSelection = (item) => {
            const has = internalSelections.includes(item);
            if (has) {
                removeSelection(item);
            }
            else {
                addSelection(item);
            }
        };
        const clearSelections = (next = []) => {
            setInternalSelections(next);
            onSelection(next);
        };
        const onClick = (event, data) => {
            event.preventDefault();
            event.stopPropagation();
            if (!metaKeyDown) {
                clearSelections([data.id]);
            }
            else {
                toggleSelection(data.id);
            }
            setMetaKeyDown(false);
        };
        const onKeyDown = (event) => {
            event.preventDefault();
            setMetaKeyDown(event.metaKey || event.ctrlKey);
        };
        const onCanvasClick = () => {
            clearSelections();
            setMetaKeyDown(false);
        };
        reakeys.useHotkeys([
            {
                name: 'Select All',
                keys: 'mod+a',
                callback: (event) => {
                    event.preventDefault();
                    const next = nodesRef.current.map((n) => n.id);
                    onDataChange(nodesRef.current, edgeRef.current);
                    onSelection(next);
                    setInternalSelections(next);
                }
            },
            {
                name: 'Delete Selections',
                keys: 'backspace',
                callback: (event) => {
                    event.preventDefault();
                    const result = removeNode(nodesRef.current, edgeRef.current, selectionRef.current);
                    onDataChange(result.nodes, result.edges);
                    onSelection([]);
                    setInternalSelections([]);
                }
            },
            {
                name: 'Deselect Selections',
                keys: 'escape',
                callback: (event) => {
                    event.preventDefault();
                    onSelection([]);
                    setInternalSelections([]);
                }
            }
        ]);
        return {
            onClick,
            onKeyDown,
            onCanvasClick,
            selections: internalSelections,
            clearSelections,
            addSelection,
            removeSelection,
            toggleSelection,
            setSelections: setInternalSelections
        };
    };

    exports.Add = Add;
    exports.Arrow = Arrow;
    exports.Canvas = Canvas;
    exports.CanvasContext = CanvasContext;
    exports.CanvasProvider = CanvasProvider;
    exports.Edge = Edge;
    exports.Icon = Icon;
    exports.Label = Label;
    exports.MarkerArrow = MarkerArrow;
    exports.Node = Node;
    exports.Port = Port;
    exports.Remove = Remove;
    exports.addNodeAndEdge = addNodeAndEdge;
    exports.checkNodeLinkable = checkNodeLinkable;
    exports.detectCircular = detectCircular;
    exports.elkLayout = elkLayout;
    exports.formatText = formatText;
    exports.getParentsForNodeId = getParentsForNodeId;
    exports.hasLink = hasLink;
    exports.measureText = measureText;
    exports.removeAndUpsertNodes = removeAndUpsertNodes;
    exports.removeNode = removeNode;
    exports.upsertNode = upsertNode;
    exports.useCanvas = useCanvas;
    exports.useEdgeDrag = useEdgeDrag;
    exports.useLayout = useLayout;
    exports.useNodeDrag = useNodeDrag;
    exports.useSelection = useSelection;
    exports.useZoom = useZoom;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
