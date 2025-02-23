import React from "react";
import { EndNode as EndNodeModel } from "../../lib/nodes";
import { BaseNode } from "./BaseNode";

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
    return (
        <BaseNode
            id={id}
            onMouseDown={onMouseDown}
            node={node}
            onStartConnection={onStartConnection}
            onEndConnection={onEndConnection}
            screenX={screenX}
            screenY={screenY}
            selected={selected}
            width={WIDTH}
            height={HEIGHT}
        >
            End
        </BaseNode>
    );
};
