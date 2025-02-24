import React from "react";
import useStore from "@/store/useStore";
import { BaseNode } from "./BaseNode";
import { ConsoleNode as ConsoleNodeModel } from "./NodeFactory";

interface ConsoleNodeProps {
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
    node: ConsoleNodeModel;
}

export const SIZE = 80;

export const ConsoleNode: React.FC<ConsoleNodeProps> = ({
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
            screenX={x}
            screenY={y}
            width={SIZE}
            height={SIZE}
            selected={selected}
            id={node.id}
            onMouseDown={onMouseDown}
            node={node}
            onStartConnection={onStartConnection}
            onEndConnection={onEndConnection}
            onContextMenu={onContextMenu}
        >
            Start
        </BaseNode>
    );
};
