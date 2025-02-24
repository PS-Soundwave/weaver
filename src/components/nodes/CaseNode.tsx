import React from "react";
import useStore from "@/store/useStore";
import { BaseNode } from "./BaseNode";
import { CaseNode as CaseNodeModel } from "./NodeFactory";

interface CaseNodeProps {
    x: number;
    y: number;
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
    onContextMenu: (_e: React.MouseEvent, _id: string) => void;
}

export const WIDTH = 80;
export const HEIGHT = 160;

export const CaseNode: React.FC<CaseNodeProps> = ({
    x,
    y,
    node,
    onMouseDown,
    onStartConnection,
    onEndConnection,
    onContextMenu
}) => {
    const selected = useStore((state) => state.selectedNode?.id === node.id);

    return (
        <BaseNode
            screenX={x}
            screenY={y}
            id={node.id}
            onMouseDown={onMouseDown}
            node={node}
            onStartConnection={onStartConnection}
            onEndConnection={onEndConnection}
            onContextMenu={onContextMenu}
            selected={selected}
            width={WIDTH}
            height={HEIGHT}
        >
            Case
        </BaseNode>
    );
};
