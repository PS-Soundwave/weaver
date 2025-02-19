import { useCallback, useEffect, useState, useRef } from "react";

interface GraphNode {
    id: string;
    x: number;
    y: number;
    type: "console";
}

interface ContextMenuProps {
    x: number;
    y: number;
    onAddNode: (x: number, y: number) => void;
    onClose: () => void;
}

interface GridProps {
    onNodeSelect: (nodeId: string | null) => void;
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
            if (menuRef.current && !menuRef.current.contains(e.target as Element)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside, true);
        };
    }, [onClose]);

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
                    onAddNode(x, y);
                    onClose();
                }}
                style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 16px",
                    textAlign: "left",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "white",
                    cursor: "pointer"
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgb(55, 65, 81)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                }
            >
                Add Console
            </button>
        </div>
    );
};

const GRID_SIZE = 50;
const MAJOR_GRID_SIZE = 250;

// Subtle theme colors
const ORIGIN_COLOR = "rgba(167, 139, 250, 0.6)"; // Purple accent for origin
const MAJOR_COLOR = "rgba(209, 213, 219, 0.2)"; // Light grey for major
const MINOR_COLOR = "rgba(209, 213, 219, 0.1)"; // Lighter grey for minor
const BG_COLOR = "rgba(17, 24, 39, 0.3)"; // Dark grey background

const NODE_WIDTH = 150;
const NODE_HEIGHT = 80;
const CONSOLE_NODE_SIZE = 20;

export const Grid: React.FC<GridProps> = ({ onNodeSelect }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [viewportDimensions, setViewportDimensions] = useState({
        width: 0,
        height: 0
    });
    const [nodes, setNodes] = useState<GraphNode[]>([]);
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

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: dragStart.x - e.clientX,
                    y: dragStart.y - e.clientY
                });
            } else if (draggingNode) {
                setNodes((prevNodes) =>
                    prevNodes.map((node) =>
                        node.id === draggingNode.id
                            ? {
                                  ...node,
                                  x: draggingNode.startX + e.clientX,
                                  y: draggingNode.startY + e.clientY
                              }
                            : node
                    )
                );
            }
        },
        [isDragging, dragStart, draggingNode, position, viewportDimensions]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDraggingNode(null);
    }, []);

    const handleContextMenu = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY });
        }, []);

    const handleAddNode = useCallback(
        (clientX: number, clientY: number) => {
            const centerX = viewportDimensions.width / 2;
            const centerY = viewportDimensions.height / 2;
            const gridX = clientX - centerX + position.x;
            const gridY = clientY - centerY + position.y;

            const newNode: GraphNode = {
                id: crypto.randomUUID(),
                x: gridX,
                y: gridY,
                type: "console"
            };
            setNodes((prev) => [...prev, newNode]);
        },
        [position, viewportDimensions]
    );

    useEffect(() => {
        if (isDragging || draggingNode) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, draggingNode, handleMouseMove, handleMouseUp]);

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
            const isOrigin = x == 0;
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
            const isOrigin = y == 0;
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

    const renderNodes = useCallback(() => {
        const centerX = viewportDimensions.width / 2;
        const centerY = viewportDimensions.height / 2;

        return nodes.map((node) => {
            const screenX = node.x - position.x + centerX;
            const screenY = node.y - position.y + centerY;

            return (
                <g key={node.id}>
                    <rect
                        x={screenX - NODE_WIDTH / 2}
                        y={screenY - NODE_HEIGHT / 2}
                        width={NODE_WIDTH}
                        height={NODE_HEIGHT}
                        fill={
                            selectedNodeId === node.id
                                ? "rgba(167, 139, 250, 0.3)"
                                : "rgba(75, 85, 99, 0.3)"
                        }
                        stroke={
                            selectedNodeId === node.id
                                ? "rgb(167, 139, 250, 0.8)"
                                : "rgb(75, 85, 99, 0.8)"
                        }
                        strokeWidth={2}
                        rx={4}
                        style={{ cursor: "pointer" }}
                        onMouseDown={(e) => {
                            if (e.button === 0) {
                                e.stopPropagation();
                                setDraggingNode({
                                    id: node.id,
                                    startX: node.x - e.clientX,
                                    startY: node.y - e.clientY
                                });
                                setSelectedNodeId(node.id);
                            }
                        }}
                    />
                    {/* Console node circle */}
                    <circle
                        cx={screenX + NODE_WIDTH / 2}
                        cy={screenY}
                        r={CONSOLE_NODE_SIZE / 2}
                        fill="rgb(75, 85, 99, 1)"
                        stroke="rgb(75, 85, 99, 0.8)"
                        strokeWidth="2"
                        style={{
                            cursor: "pointer",
                            transition: "stroke 0.2s"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.stroke =
                                "rgb(167, 139, 250, 1)";
                            e.currentTarget.style.fill =
                                "rgb(167, 139, 250, 1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.fill = "rgb(75, 85, 99, 1)";
                            e.currentTarget.style.stroke =
                                "rgb(75, 85, 99, 0.8)";
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                        }}
                    />
                </g>
            );
        });
    }, [nodes, viewportDimensions, position, selectedNodeId]);

    return (
        <div
            className="h-full w-full overflow-hidden"
            onMouseDown={handleMouseDown}
            onContextMenu={handleContextMenu}
            style={{ cursor: isDragging ? "grabbing" : "default" }}
        >
            <svg
                className="h-full w-full"
                style={{ backgroundColor: BG_COLOR }}
            >
                {getGridLines()}
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
