import React from "react";
import { ConsoleNode as ConsoleNodeModel } from "../../lib/nodes";
import { BaseNode } from "./BaseNode";

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

    return (
        <BaseNode
            screenX={screenX}
            screenY={screenY}
            width={SIZE}
            height={SIZE}
            selected={selected}
            id={id}
            onMouseDown={onMouseDown}
            node={node}
            onStartConnection={onStartConnection}
            onEndConnection={onEndConnection}
        >
            Start
        </BaseNode>
    );
};
