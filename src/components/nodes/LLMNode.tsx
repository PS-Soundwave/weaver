import React from "react";
import { LLMNode as LLMNodeClass } from "../../lib/nodes";
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
}

export const LLMNode: React.FC<LLMNodeProps> = ({
    id,
    screenX,
    screenY,
    selected,
    onMouseDown,
    onStartConnection,
    onEndConnection
}) => {
    const colors = getNodeColors(selected);
    const nodeInstance = new LLMNodeClass(id, 0, 0); // x,y not needed for rendering
    const connectors = nodeInstance.getConnectors();
    const connectorPositions = nodeInstance.getConnectorPositions(
        screenX,
        screenY
    );

    return (
        <BaseNode id={id} onMouseDown={onMouseDown}>
            <rect
                x={screenX - LLMNodeClass.WIDTH / 2}
                y={screenY - LLMNodeClass.HEIGHT / 2}
                width={LLMNodeClass.WIDTH}
                height={LLMNodeClass.HEIGHT}
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
