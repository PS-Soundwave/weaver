import React from "react";
import useStore from "@/store/useStore";
import { BaseNode } from "./BaseNode";
import { LLMNode as LLMNodeModel } from "./NodeFactory";

interface LLMNodeProps {
    x: number;
    y: number;
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
    node,
    x,
    y,
    onMouseDown,
    onStartConnection,
    onEndConnection
}) => {
    const selected = useStore((state) => state.selectedNode?.id === node.id);

    const WIDTH = 120;
    const HEIGHT = 80;

    return (
        <BaseNode
            id={node.id}
            onMouseDown={onMouseDown}
            onStartConnection={onStartConnection}
            onEndConnection={onEndConnection}
            node={node}
            screenX={x}
            screenY={y}
            selected={selected}
            width={WIDTH}
            height={HEIGHT}
        >
            LLM
        </BaseNode>
    );
};
