import React from "react";
import {
    CaseNode as CaseNodeModel,
    Connector as ConnectorModel,
    getConnectorPositions
} from "../../lib/nodes";
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

export const getConnectors = (node: CaseNodeModel): ConnectorModel[] => {
    const connectors: ConnectorModel[] = [
        { id: `${node.id}-input`, type: "input" }
    ];

    // Add an output connector for each case
    node.state.cases.forEach((caseValue) => {
        connectors.push({
            id: `${node.id}-output-${caseValue}`,
            type: "output"
        });
    });

    return connectors;
};

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
    const WIDTH = 80;
    const HEIGHT = 150;
    const colors = getNodeColors(selected);
    const connectors = getConnectors(node);
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
