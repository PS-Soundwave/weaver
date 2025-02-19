import React from "react";
import { ConsoleNode as ConsoleNodeClass } from "../../lib/nodes";
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
}

export const ConsoleNode: React.FC<ConsoleNodeProps> = ({
    id,
    screenX,
    screenY,
    selected,
    onMouseDown,
    onStartConnection,
    onEndConnection
}) => {
    const colors = getNodeColors(selected);
    const nodeInstance = new ConsoleNodeClass(id, 0, 0); // x,y not needed for rendering
    const connectors = nodeInstance.getConnectors();
    const connectorPositions = nodeInstance.getConnectorPositions(
        screenX,
        screenY
    );

    return (
        <BaseNode id={id} onMouseDown={onMouseDown}>
            <rect
                x={screenX - ConsoleNodeClass.SIZE / 2}
                y={screenY - ConsoleNodeClass.SIZE / 2}
                width={ConsoleNodeClass.SIZE}
                height={ConsoleNodeClass.SIZE}
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
