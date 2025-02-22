import React from "react";
import {
    Connector as ConnectorModel,
    getConnectorPositions,
    LLMNode as LLMNodeModel
} from "../../lib/nodes";
import { BaseNode, Connector, getNodeColors } from "./BaseNode";

interface LLMNodeProps {
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
    node: LLMNodeModel;
}

export const LLMNode: React.FC<LLMNodeProps> = ({
    id,
    screenX,
    screenY,
    selected,
    onMouseDown,
    onStartConnection,
    onEndConnection,
    node
}) => {
    const WIDTH = 120;
    const HEIGHT = 80;
    const colors = getNodeColors(selected);
    const connectors: ConnectorModel[] = [
        { id: `${id}-input`, type: "input" },
        { id: `${id}-output`, type: "output" }
    ];
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
