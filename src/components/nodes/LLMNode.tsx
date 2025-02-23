import React from "react";
import { LLMNode as LLMNodeModel } from "../../lib/nodes";
import { BaseNode } from "./BaseNode";

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

    return (
        <BaseNode
            id={id}
            onMouseDown={onMouseDown}
            onStartConnection={onStartConnection}
            onEndConnection={onEndConnection}
            node={node}
            screenX={screenX}
            screenY={screenY}
            selected={selected}
            width={WIDTH}
            height={HEIGHT}
        >
            LLM
        </BaseNode>
    );
};
