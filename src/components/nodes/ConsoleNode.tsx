import React from "react";
import {
    Connector as ConnectorModel,
    ConsoleNode as ConsoleNodeModel,
    getConnectorPositions
} from "../../lib/nodes";
import { BaseNode, Connector, getNodeColors } from "./BaseNode";

interface ConsoleNodeProps {
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
    node: ConsoleNodeModel;
}

export const ConsoleNode: React.FC<ConsoleNodeProps> = ({
    id,
    screenX,
    screenY,
    selected,
    onMouseDown,
    onStartConnection,
    onEndConnection,
    node
}) => {
    const SIZE = 150;

    const colors = getNodeColors(selected);
    const connectors: ConnectorModel[] = [
        { id: `${id}-output`, type: "output" }
    ];
    const connectorPositions = getConnectorPositions(node, screenX, screenY);

    return (
        <BaseNode id={id} onMouseDown={onMouseDown}>
            <rect
                x={screenX - SIZE / 2}
                y={screenY - SIZE / 2}
                width={SIZE}
                height={SIZE}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={2}
                rx={4}
            />
            {connectors.map((connector, index) => {
                const position = connectorPositions[index];
                return (
                    <Connector
                        key={connector.id}
                        cx={position.x}
                        cy={position.y}
                        type={connector.type}
                        id={connector.id}
                        nodeId={id}
                        onStartConnection={onStartConnection}
                        onEndConnection={onEndConnection}
                    />
                );
            })}
        </BaseNode>
    );
};
