import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import useStore from "@/store/useStore";
import { getConnectorPositions, NewNode } from "../lib/nodes";
import { CaseNode as CaseNodeComponent } from "./nodes/CaseNode";
import { ConsoleNode as ConsoleNodeComponent } from "./nodes/ConsoleNode";
import { EndNode as EndNodeComponent } from "./nodes/EndNode";
import { LLMNode as LLMNodeComponent } from "./nodes/LLMNode";
import { VectorDBRetrieveNode as VectorDBRetrieveNodeComponent } from "./nodes/VectorDBRetrieveNode";
import { VectorDBStoreNode as VectorDBStoreNodeComponent } from "./nodes/VectorDBStoreNode";
import { SettingsMenu } from "./SettingsMenu";

interface Wire {
    id: string;
    fromNode: string;
    fromConnector: string;
    toNode: string;
    toConnector: string;
}

interface ContextMenuProps {
    x: number;
    y: number;
    onAddNode: (_f: (_x: number, _y: number) => NewNode) => void;
    onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
    x,
    y,
    onAddNode,
    onClose
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: globalThis.MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Element)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside, true);
        };
    }, [onClose]);

    const buttonStyle = {
        display: "block",
        width: "100%",
        padding: "8px 16px",
        textAlign: "left" as const,
        backgroundColor: "transparent",
        border: "none",
        color: "white",
        cursor: "pointer"
    };

    return (
        <div
            ref={menuRef}
            style={{
                position: "absolute",
                left: x,
                top: y,
                backgroundColor: "rgb(31, 41, 55)",
                border: "1px solid rgb(75, 85, 99)",
                borderRadius: "4px",
                padding: "4px 0",
                zIndex: 1000
            }}
        >
            <button
                onMouseDown={(e) => {
                    e.stopPropagation();
                    onAddNode((x, y) => ({
                        id: crypto.randomUUID(),
                        x,
                        y,
                        type: "console",
                        state: {
                            prompt: ""
                        }
                    }));
                    onClose();
                }}
                style={buttonStyle}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgb(55, 65, 81)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                }
            >
                Add Console
            </button>
            <button
                onMouseDown={(e) => {
                    e.stopPropagation();
                    onAddNode((x, y) => ({
                        id: crypto.randomUUID(),
                        x,
                        y,
                        type: "llm",
                        state: {
                            loading: false,
                            error: null,
                            prompt: "",
                            structuredOutput: false
                        }
                    }));
                    onClose();
                }}
                style={buttonStyle}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgb(55, 65, 81)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                }
            >
                Add LLM
            </button>
            <button
                onMouseDown={(e) => {
                    e.stopPropagation();
                    onAddNode((x, y) => ({
                        id: crypto.randomUUID(),
                        x,
                        y,
                        type: "end",
                        state: {
                            value: ""
                        }
                    }));
                    onClose();
                }}
                style={buttonStyle}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgb(55, 65, 81)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                }
            >
                Add End
            </button>
            <button
                onMouseDown={(e) => {
                    e.stopPropagation();
                    onAddNode((x, y) => ({
                        id: crypto.randomUUID(),
                        x,
                        y,
                        type: "case",
                        state: {
                            caseKey: "",
                            valueKey: "",
                            cases: []
                        }
                    }));
                    onClose();
                }}
                style={buttonStyle}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgb(55, 65, 81)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                }
            >
                Add Case
            </button>
            <button
                onMouseDown={(e) => {
                    e.stopPropagation();
                    onAddNode((x, y) => ({
                        id: crypto.randomUUID(),
                        x,
                        y,
                        type: "vectordb-store",
                        state: {}
                    }));
                    onClose();
                }}
                style={buttonStyle}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgb(55, 65, 81)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                }
            >
                Vector DB Store
            </button>
            <button
                onMouseDown={(e) => {
                    e.stopPropagation();
                    onAddNode((x, y) => ({
                        id: crypto.randomUUID(),
                        x,
                        y,
                        type: "vectordb-retrieve",
                        state: {}
                    }));
                    onClose();
                }}
                style={buttonStyle}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgb(55, 65, 81)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                }
            >
                Vector DB Retrieve
            </button>
        </div>
    );
};

const Wire: React.FC<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    selected?: boolean;
}> = ({ startX, startY, endX, endY, selected }) => {
    const path = `M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`;
    return (
        <path
            d={path}
            stroke={selected ? "rgb(167, 139, 250)" : "rgb(75, 85, 99)"}
            strokeWidth={2}
            fill="none"
        />
    );
};

// Subtle theme colors
const ORIGIN_COLOR = "rgba(167, 139, 250, 0.6)"; // Purple accent for origin
const MAJOR_COLOR = "rgba(209, 213, 219, 0.2)"; // Light grey for major
const MINOR_COLOR = "rgba(209, 213, 219, 0.1)"; // Lighter grey for minor
const BG_COLOR = "rgba(17, 24, 39, 0.3)"; // Dark grey background

const GRID_SIZE = 50;
const MAJOR_GRID_SIZE = 250;

export const Grid: React.FC = () => {
    const {
        nodes,
        wires,
        selectedNode,
        addNode,
        /*removeNode,*/ addWire,
        /*removeWire,*/
        setSelectedNode,
        updateNode
    } = useStore();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
        null
    );
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [draggingNode, setDraggingNode] = useState<{
        id: string;
        startX: number;
        startY: number;
    } | null>(null);
    const [draggingWire, setDraggingWire] = useState<{
        fromNode: string;
        fromConnector: string;
        type: "input" | "output";
        startX: number;
        startY: number;
    } | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const addNodeCallback = useCallback(
        (f: (_x: number, _y: number) => NewNode) => {
            if (!contextMenu) {
                return;
            }

            const rect = containerRef.current?.getBoundingClientRect();

            if (!rect) {
                return;
            }
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const gridX = contextMenu.x - centerX + position.x;
            const gridY = contextMenu.y - centerY + position.y;

            addNode(f(gridX, gridY));
        },
        [addNode, contextMenu, position]
    );

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (e.button === 0) {
                // Left click
                setDragStart({
                    x: position.x + e.clientX,
                    y: position.y + e.clientY
                });
                setSelectedNode(null);
            }
        },
        [position, setSelectedNode]
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            if (dragStart !== null) {
                setPosition({
                    x: dragStart.x - e.clientX,
                    y: dragStart.y - e.clientY
                });
            } else if (draggingNode) {
                const node = nodes.get(draggingNode.id);

                if (!node) {
                    return;
                }

                node.x = draggingNode.startX + e.clientX;
                node.y = draggingNode.startY + e.clientY;

                updateNode(node);
            }
        },
        [dragStart, draggingNode, nodes, updateNode]
    );

    const handleStartConnection = useCallback(
        (connectorId: string, type: "input" | "output", nodeId: string) => {
            const node = nodes.get(nodeId);
            if (!node) {
                return;
            }

            if (containerRef.current === null) {
                return;
            }

            const rect = containerRef.current.getBoundingClientRect();

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const positions = getConnectorPositions(
                node,
                node.x - position.x + centerX,
                node.y - position.y + centerY
            );
            const connectorPos = positions.find((p) => p.id === connectorId);

            if (!connectorPos) {
                return;
            }

            setDraggingWire({
                fromNode: nodeId,
                fromConnector: connectorId,
                type,
                startX: connectorPos.x,
                startY: connectorPos.y
            });
        },
        [nodes, position]
    );

    const handleEndConnection = useCallback(
        (connectorId: string, type: "input" | "output", nodeId: string) => {
            if (!draggingWire) {
                return;
            }

            // Only allow connecting output to input
            if (draggingWire.type === type) {
                return;
            }

            // Determine which connector is input and which is output
            let fromNode;
            let fromConnector;
            let toNode;
            let toConnector;

            if (draggingWire.type === "output") {
                fromNode = draggingWire.fromNode;
                fromConnector = draggingWire.fromConnector;
                toNode = nodeId;
                toConnector = connectorId;
            } else {
                fromNode = nodeId;
                fromConnector = connectorId;
                toNode = draggingWire.fromNode;
                toConnector = draggingWire.fromConnector;
            }

            if (wires.values().some((w) => w.fromConnector === fromConnector)) {
                return;
            }

            addWire({
                id: crypto.randomUUID(),
                fromNode,
                fromConnector,
                toNode,
                toConnector
            });

            setDraggingWire(null);
        },
        [draggingWire, wires, addWire]
    );

    const handleMouseUp = useCallback(() => {
        setDragStart(null);
        setDraggingNode(null);
        setDraggingWire(null);
    }, []);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    }, []);

    const getGridLines = () => {
        if (!containerRef.current) {
            return [];
        }

        const lines = [];
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const startX =
            Math.ceil((position.x - centerX) / GRID_SIZE) * GRID_SIZE;
        const startY =
            Math.ceil((position.y - centerY) / GRID_SIZE) * GRID_SIZE;
        const endX = rect.width + startX;
        const endY = rect.height + startY;

        // Draw minor grid lines
        for (let x = startX; x <= endX; x += GRID_SIZE) {
            const isOrigin = x === 0;
            const isMajor = x % MAJOR_GRID_SIZE === 0;
            lines.push(
                <line
                    key={`v${x}`}
                    x1={x - position.x + centerX}
                    y1={0}
                    x2={x - position.x + centerX}
                    y2={rect.height}
                    stroke={
                        isOrigin
                            ? ORIGIN_COLOR
                            : isMajor
                              ? MAJOR_COLOR
                              : MINOR_COLOR
                    }
                    strokeWidth={isOrigin ? 2 : isMajor ? 1 : 0.5}
                />
            );
        }

        for (let y = startY; y <= endY; y += GRID_SIZE) {
            const isOrigin = y === 0;
            const isMajor = y % MAJOR_GRID_SIZE === 0;
            lines.push(
                <line
                    key={`h${y}`}
                    x1={0}
                    y1={y - position.y + centerY}
                    x2={rect.width}
                    y2={y - position.y + centerY}
                    stroke={
                        isOrigin
                            ? ORIGIN_COLOR
                            : isMajor
                              ? MAJOR_COLOR
                              : MINOR_COLOR
                    }
                    strokeWidth={isOrigin ? 2 : isMajor ? 1 : 0.5}
                />
            );
        }

        return lines;
    };

    const renderWires = useCallback(() => {
        if (!containerRef.current) {
            return [];
        }

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const wiredElements = Array.from(
            wires.values().map((wire) => {
                const fromNode = nodes.get(wire.fromNode);
                const toNode = nodes.get(wire.toNode);
                if (!fromNode || !toNode) {
                    return null;
                }

                const fromPositions = getConnectorPositions(
                    fromNode,
                    fromNode.x - position.x + centerX,
                    fromNode.y - position.y + centerY
                );
                const toPositions = getConnectorPositions(
                    toNode,
                    toNode.x - position.x + centerX,
                    toNode.y - position.y + centerY
                );

                const fromConnector = fromPositions.find(
                    (p) => p.id === wire.fromConnector
                );
                const toConnector = toPositions.find(
                    (p) => p.id === wire.toConnector
                );
                if (!fromConnector || !toConnector) {
                    return null;
                }

                return (
                    <Wire
                        key={wire.id}
                        startX={fromConnector.x}
                        startY={fromConnector.y}
                        endX={toConnector.x}
                        endY={toConnector.y}
                        selected={
                            selectedNode?.id === wire.fromNode ||
                            selectedNode?.id === wire.toNode
                        }
                    />
                );
            })
        );

        if (draggingWire) {
            wiredElements.push(
                <Wire
                    key="dragging"
                    startX={draggingWire.startX}
                    startY={draggingWire.startY}
                    endX={mousePosition.x}
                    endY={mousePosition.y}
                />
            );
        }

        return wiredElements;
    }, [wires, nodes, position, selectedNode?.id, draggingWire, mousePosition]);

    const renderNodes = useCallback(() => {
        if (!containerRef.current) {
            return null;
        }

        const rect = containerRef.current?.getBoundingClientRect();

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        return Array.from(
            nodes.values().map((node) => {
                const screenX = node.x - position.x + centerX;
                const screenY = node.y - position.y + centerY;

                const handleNodeMouseDown = (
                    e: React.MouseEvent,
                    id: string
                ) => {
                    if (e.button === 0) {
                        e.stopPropagation();
                        setDraggingNode({
                            id,
                            startX: node.x - e.clientX,
                            startY: node.y - e.clientY
                        });
                        setSelectedNode(node);
                    }
                };

                switch (node.type) {
                    case "console":
                        return (
                            <ConsoleNodeComponent
                                key={node.id}
                                id={node.id}
                                screenX={screenX}
                                screenY={screenY}
                                selected={selectedNode?.id === node.id}
                                onMouseDown={handleNodeMouseDown}
                                onStartConnection={handleStartConnection}
                                onEndConnection={handleEndConnection}
                                node={node}
                            />
                        );
                    case "llm":
                        return (
                            <LLMNodeComponent
                                key={node.id}
                                id={node.id}
                                screenX={screenX}
                                screenY={screenY}
                                selected={selectedNode?.id === node.id}
                                onMouseDown={handleNodeMouseDown}
                                onStartConnection={handleStartConnection}
                                onEndConnection={handleEndConnection}
                                node={node}
                            />
                        );
                    case "end":
                        return (
                            <EndNodeComponent
                                key={node.id}
                                id={node.id}
                                screenX={screenX}
                                screenY={screenY}
                                selected={selectedNode?.id === node.id}
                                onMouseDown={handleNodeMouseDown}
                                onStartConnection={handleStartConnection}
                                onEndConnection={handleEndConnection}
                                node={node}
                            />
                        );
                    case "case":
                        return (
                            <CaseNodeComponent
                                key={node.id}
                                id={node.id}
                                screenX={screenX}
                                screenY={screenY}
                                node={node}
                                selected={selectedNode?.id === node.id}
                                onMouseDown={handleNodeMouseDown}
                                onStartConnection={handleStartConnection}
                                onEndConnection={handleEndConnection}
                            />
                        );
                    case "vectordb-store":
                        return (
                            <VectorDBStoreNodeComponent
                                key={node.id}
                                id={node.id}
                                screenX={screenX}
                                screenY={screenY}
                                selected={selectedNode?.id === node.id}
                                onMouseDown={handleNodeMouseDown}
                                onStartConnection={handleStartConnection}
                                onEndConnection={handleEndConnection}
                                node={node}
                            />
                        );
                    case "vectordb-retrieve":
                        return (
                            <VectorDBRetrieveNodeComponent
                                key={node.id}
                                id={node.id}
                                screenX={screenX}
                                screenY={screenY}
                                selected={selectedNode?.id === node.id}
                                onMouseDown={handleNodeMouseDown}
                                onStartConnection={handleStartConnection}
                                onEndConnection={handleEndConnection}
                                node={node}
                            />
                        );
                    default:
                        return null;
                }
            })
        );
    }, [
        nodes,
        position,
        selectedNode?.id,
        handleStartConnection,
        handleEndConnection,
        setSelectedNode
    ]);

    return (
        <div
            ref={containerRef}
            className="h-full w-full overflow-hidden"
            style={{
                backgroundColor: BG_COLOR,
                cursor: dragStart !== null ? "grabbing" : "default"
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={handleContextMenu}
        >
            <SettingsMenu />
            <svg className="h-full w-full">
                {getGridLines()}
                {renderWires()}
                {renderNodes()}
            </svg>
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onAddNode={addNodeCallback}
                    onClose={() => setContextMenu(null)}
                />
            )}
        </div>
    );
};
