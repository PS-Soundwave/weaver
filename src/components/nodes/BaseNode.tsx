import React from "react";

interface BaseNodeProps {
    id: string;
    onMouseDown: (_e: React.MouseEvent, _id: string) => void;
}

export const BaseNode: React.FC<BaseNodeProps & React.PropsWithChildren> = ({
    onMouseDown,
    id,
    children
}) => {
    return (
        <g
            onMouseDown={(e) => onMouseDown(e, id)}
            style={{ cursor: "pointer" }}
        >
            {children}
        </g>
    );
};

export const getNodeColors = (selected: boolean) => ({
    fill: selected ? "rgba(167, 139, 250, 0.3)" : "rgba(75, 85, 99, 0.3)",
    stroke: selected ? "rgb(167, 139, 250, 0.8)" : "rgb(75, 85, 99, 0.8)"
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
