import React from "react";
import useStore from "@/store/useStore";
import { getNodeFactory, NewNode } from "./NodeFactory";

interface BaseNodeProps {
    id: string;
    node: NewNode;
    screenX: number;
    screenY: number;
    width: number;
    height: number;
    selected: boolean;
    onMouseDown: (_e: React.MouseEvent, _id: string) => void;
    onStartConnection: (
        _connectorId: string,
        _type: "input" | "output",
        _nodeId: string
    ) => void;
    onEndConnection: (
        _connectorId: string,
        _type: "input" | "output",
        _nodeId: string
    ) => void;
    onContextMenu: (_e: React.MouseEvent, _id: string) => void;
}

export const BaseNode: React.FC<BaseNodeProps & React.PropsWithChildren> = ({
    onMouseDown,
    onStartConnection,
    onEndConnection,
    onContextMenu,
    id,
    node,
    children,
    screenX,
    screenY,
    width,
    height,
    selected
}) => {
    const active = useStore((state) => state.activeNode?.id === node.id);
    const connectors = getNodeFactory(node).getConnectors(screenX, screenY);
    const colors = getNodeColors(selected, active);

    return (
        <g
            onMouseDown={(e) => onMouseDown(e, id)}
            onContextMenu={(e) => onContextMenu(e, id)}
            style={{ cursor: "pointer" }}
        >
            <rect
                x={screenX - width / 2}
                y={screenY - height / 2}
                width={width}
                height={height}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={2}
                rx={4}
            />
            <text
                x={screenX}
                y={screenY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={14}
            >
                {children}
            </text>
            {connectors.map((connector) => {
                return (
                    <Connector
                        key={connector.id}
                        cx={connector.x}
                        cy={connector.y}
                        type={connector.type}
                        id={connector.id}
                        nodeId={id}
                        onStartConnection={onStartConnection}
                        onEndConnection={onEndConnection}
                    />
                );
            })}
        </g>
    );
};

export const getNodeColors = (selected: boolean, active: boolean) => ({
    fill: active
        ? "rgba(255, 215, 0, 0.3)"
        : selected
          ? "rgba(167, 139, 250, 0.3)"
          : "rgba(75, 85, 99, 0.3)",
    stroke: active
        ? "rgb(255, 215, 0, 0.8)"
        : selected
          ? "rgb(167, 139, 250, 0.8)"
          : "rgb(75, 85, 99, 0.8)"
});

const CONNECTOR_RADIUS = 6;

export interface ConnectorProps {
    cx: number;
    cy: number;
    type: "input" | "output";
    id: string;
    nodeId: string;
    onStartConnection: (
        _connectorId: string,
        _type: "input" | "output",
        _nodeId: string
    ) => void;
    onEndConnection: (
        _connectorId: string,
        _type: "input" | "output",
        _nodeId: string
    ) => void;
}

export const Connector: React.FC<ConnectorProps> = ({
    cx,
    cy,
    type,
    id,
    nodeId,
    onStartConnection,
    onEndConnection
}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <circle
            cx={cx}
            cy={cy}
            r={CONNECTOR_RADIUS}
            fill={isHovered ? "rgb(167, 139, 250, 1)" : "rgb(75, 85, 99)"}
            stroke={isHovered ? "rgb(167, 139, 250, 1)" : "rgb(55, 65, 81)"}
            strokeWidth={1}
            style={{
                cursor: "pointer"
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                onStartConnection(id, type, nodeId);
            }}
            onMouseUp={() => {
                onEndConnection(id, type, nodeId);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        />
    );
};
