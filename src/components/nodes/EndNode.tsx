import React from "react";
import {
    Connector as ConnectorModel,
    EndNode as EndNodeModel,
    getConnectorPositions
} from "../../lib/nodes";
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
    node: EndNodeModel;
}

const WIDTH = 120;
const HEIGHT = 50;

export const EndNode: React.FC<EndNodeProps> = ({
    id,
    screenX,
    screenY,
    selected,
    onMouseDown,
    onStartConnection,
    onEndConnection,
    node
}) => {
    const colors = getNodeColors(selected);
    const connectors: ConnectorModel[] = [{ id: `${id}-input`, type: "input" }];
    const connectorPositions = getConnectorPositions(node, screenX, screenY);

    return (
        <BaseNode id={id} onMouseDown={onMouseDown}>
            <rect
                x={screenX - WIDTH / 2}
                y={screenY - HEIGHT / 2}
                width={WIDTH}
                height={HEIGHT}
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
