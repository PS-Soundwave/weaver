import React from "react";
import { EndNode as EndNodeClass } from "../../lib/nodes/EndNode";
import { BaseNode, Connector, getNodeColors } from "./BaseNode";

interface EndNodeProps {
    id: string;
    screenX: number;
    screenY: number;
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
}

export const EndNode: React.FC<EndNodeProps> = ({
    id,
    screenX,
    screenY,
    selected,
    onMouseDown,
    onStartConnection,
    onEndConnection
}) => {
    const colors = getNodeColors(selected);
    const nodeInstance = new EndNodeClass(id, 0, 0);
    const connectors = nodeInstance.getConnectors();
    const connectorPositions = nodeInstance.getConnectorPositions(
        screenX,
        screenY
    );

    return (
        <BaseNode id={id} onMouseDown={onMouseDown}>
            <rect
                x={screenX - EndNodeClass.WIDTH / 2}
                y={screenY - EndNodeClass.HEIGHT / 2}
                width={EndNodeClass.WIDTH}
                height={EndNodeClass.HEIGHT}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={2}
                rx={5}
                ry={5}
            />
            {connectors.map((connector, i) => (
                <Connector
                    key={connector.id}
                    cx={connectorPositions[i].x}
                    cy={connectorPositions[i].y}
                    type={connector.type}
                    id={connector.id}
                    nodeId={id}
                    onStartConnection={onStartConnection}
                    onEndConnection={onEndConnection}
                />
            ))}
        </BaseNode>
    );
};
