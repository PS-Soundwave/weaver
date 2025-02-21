import React from "react";
import { CaseNode as CaseNodeModel } from "../../lib/nodes/CaseNode";
import { BaseNode, Connector, getNodeColors } from "./BaseNode";

interface CaseNodeProps {
    id: string;
    screenX: number;
    screenY: number;
    selected: boolean;
    node: CaseNodeModel;
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

export const CaseNode: React.FC<CaseNodeProps> = ({
    id,
    screenX,
    screenY,
    selected,
    node,
    onMouseDown,
    onStartConnection,
    onEndConnection
}) => {
    const colors = getNodeColors(selected);
    const connectors = node.getConnectors();
    const connectorPositions = node.getConnectorPositions(screenX, screenY);

    return (
        <BaseNode id={id} onMouseDown={onMouseDown}>
            <rect
                x={screenX - CaseNodeModel.WIDTH / 2}
                y={screenY - CaseNodeModel.HEIGHT / 2}
                width={CaseNodeModel.WIDTH}
                height={CaseNodeModel.HEIGHT}
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
                Case
            </text>
            {connectors.map((connector, index) => {
                return (
                    <Connector
                        key={connector.id}
                        cx={connectorPositions[index].x}
                        cy={connectorPositions[index].y}
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
