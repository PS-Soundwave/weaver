import { useCallback, useEffect, useRef, useState } from "react";
import { ConsoleNode, LLMNode, Node } from "../lib/nodes";
import { ConsoleNode as ConsoleNodeComponent } from "./nodes/ConsoleNode";
import { LLMNode as LLMNodeComponent } from "./nodes/LLMNode";

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
    onAddNode: (_x: number, _y: number, _type: "console" | "llm") => void;
    onClose: () => void;
}

interface GridProps {
    onNodeSelect: (_nodeId: string | null) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
    x,
    y,
    onAddNode,
    onClose
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
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
                    onAddNode(x, y, "console");
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
                    onAddNode(x, y, "llm");
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

export const Grid: React.FC<GridProps> = ({ onNodeSelect }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [viewportDimensions, setViewportDimensions] = useState({
        width: 0,
        height: 0
    });
    const [nodes, setNodes] = useState<Node[]>([]);
    const [wires, setWires] = useState<Wire[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
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

    useEffect(() => {
        const updateDimensions = () => {
            setViewportDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    useEffect(() => {
        onNodeSelect(selectedNodeId);
    }, [selectedNodeId, onNodeSelect]);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (e.button === 0) {
                // Left click
                setIsDragging(true);
                setDragStart({
                    x: position.x + e.clientX,
                    y: position.y + e.clientY
                });
                setSelectedNodeId(null);
            }
        },
        [position]
    );

    console.log(mousePosition);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            if (isDragging) {
                setPosition({
                    x: dragStart.x - e.clientX,
                    y: dragStart.y - e.clientY
                });
            } else if (draggingNode) {
                setNodes((prevNodes) =>
                    prevNodes.map((node) => {
                        if (node.id !== draggingNode.id) {
                            return node;
                        }

                        const newX = draggingNode.startX + e.clientX;
                        const newY = draggingNode.startY + e.clientY;

                        // Create new instance of the same node type with updated position
                        if (node.type === "llm") {
                            return new LLMNode(node.id, newX, newY);
                        }

                        return new ConsoleNode(node.id, newX, newY);
                    })
                );
            }
        },
        [isDragging, dragStart, draggingNode]
    );

    const handleStartConnection = useCallback(
        (connectorId: string, type: "input" | "output", nodeId: string) => {
            const node = nodes.find((n) => n.id === nodeId);
            if (!node) {
                return;
            }

            const centerX = viewportDimensions.width / 2;
            const centerY = viewportDimensions.height / 2;
            const positions = node.getConnectorPositions(
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
        [nodes, position, viewportDimensions]
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

            if (wires.some((w) => w.fromConnector === fromConnector)) {
                return;
            }

            // Add new wire
            setWires((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    fromNode,
                    fromConnector,
                    toNode,
                    toConnector
                }
            ]);

            setDraggingWire(null);
        },
        [draggingWire, wires]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDraggingNode(null);
        setDraggingWire(null);
    }, []);

    console.log(draggingWire);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    }, []);

    const handleAddNode = useCallback(
        (clientX: number, clientY: number, type: "console" | "llm") => {
            const centerX = viewportDimensions.width / 2;
            const centerY = viewportDimensions.height / 2;
            const gridX = clientX - centerX + position.x;
            const gridY = clientY - centerY + position.y;
            const id = crypto.randomUUID();

            const newNode =
                type === "console"
                    ? new ConsoleNode(id, gridX, gridY)
                    : new LLMNode(id, gridX, gridY);

            setNodes((prev) => [...prev, newNode]);
        },
        [position, viewportDimensions]
    );

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const getGridLines = () => {
        const lines = [];
        const centerX = viewportDimensions.width / 2;
        const centerY = viewportDimensions.height / 2;
        const startX =
            Math.ceil((position.x - centerX) / GRID_SIZE) * GRID_SIZE;
        const startY =
            Math.ceil((position.y - centerY) / GRID_SIZE) * GRID_SIZE;
        const endX = viewportDimensions.width + startX;
        const endY = viewportDimensions.height + startY;

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
                    y2={viewportDimensions.height}
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
                    x2={viewportDimensions.width}
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
        const centerX = viewportDimensions.width / 2;
        const centerY = viewportDimensions.height / 2;

        const wiredElements = wires.map((wire) => {
            const fromNode = nodes.find((n) => n.id === wire.fromNode);
            const toNode = nodes.find((n) => n.id === wire.toNode);
            if (!fromNode || !toNode) {
                return null;
            }

            const fromPositions = fromNode.getConnectorPositions(
                fromNode.x - position.x + centerX,
                fromNode.y - position.y + centerY
            );
            const toPositions = toNode.getConnectorPositions(
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
                        selectedNodeId === wire.fromNode ||
                        selectedNodeId === wire.toNode
                    }
                />
            );
        });

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
    }, [
        wires,
        nodes,
        position,
        viewportDimensions,
        selectedNodeId,
        draggingWire,
        mousePosition
    ]);

    const renderNodes = useCallback(() => {
        const centerX = viewportDimensions.width / 2;
        const centerY = viewportDimensions.height / 2;

        return nodes.map((node) => {
            const screenX = node.x - position.x + centerX;
            const screenY = node.y - position.y + centerY;

            const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
                if (e.button === 0) {
                    e.stopPropagation();
                    setDraggingNode({
                        id,
                        startX: node.x - e.clientX,
                        startY: node.y - e.clientY
                    });
                    setSelectedNodeId(id);
                }
            };

            if (node.type === "llm") {
                return (
                    <LLMNodeComponent
                        key={node.id}
                        id={node.id}
                        screenX={screenX}
                        screenY={screenY}
                        selected={selectedNodeId === node.id}
                        onMouseDown={handleNodeMouseDown}
                        onStartConnection={handleStartConnection}
                        onEndConnection={handleEndConnection}
                    />
                );
            }

            return (
                <ConsoleNodeComponent
                    key={node.id}
                    id={node.id}
                    screenX={screenX}
                    screenY={screenY}
                    selected={selectedNodeId === node.id}
                    onMouseDown={handleNodeMouseDown}
                    onStartConnection={handleStartConnection}
                    onEndConnection={handleEndConnection}
                />
            );
        });
    }, [
        nodes,
        position,
        viewportDimensions,
        selectedNodeId,
        handleStartConnection,
        handleEndConnection
    ]);

    return (
        <div
            className="h-full w-full overflow-hidden"
            style={{
                backgroundColor: BG_COLOR,
                cursor: isDragging ? "grabbing" : "default"
            }}
            onMouseDown={handleMouseDown}
            onContextMenu={handleContextMenu}
        >
            <svg className="h-full w-full">
                {getGridLines()}
                {renderWires()}
                {renderNodes()}
            </svg>
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onAddNode={handleAddNode}
                    onClose={() => setContextMenu(null)}
                />
            )}
        </div>
    );
};
