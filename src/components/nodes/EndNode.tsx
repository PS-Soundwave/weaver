import React from "react";
import useStore from "@/store/useStore";
import { BaseNode } from "./BaseNode";
import { EndNode as EndNodeModel } from "./NodeFactory";

interface EndNodeProps {
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
    onContextMenu: (_e: React.MouseEvent, _id: string) => void;
    node: EndNodeModel;
}

const WIDTH = 120;
const HEIGHT = 50;

export const EndNode: React.FC<EndNodeProps> = ({
    x,
    y,
    onMouseDown,
    onStartConnection,
    onEndConnection,
    onContextMenu,
    node
}) => {
    const selected = useStore((state) => state.selectedNode?.id === node.id);

    return (
        <BaseNode
            id={node.id}
            onMouseDown={onMouseDown}
            node={node}
            onStartConnection={onStartConnection}
            onEndConnection={onEndConnection}
            onContextMenu={onContextMenu}
            screenX={x}
            screenY={y}
            selected={selected}
            width={WIDTH}
            height={HEIGHT}
        >
            End
        </BaseNode>
    );
};
