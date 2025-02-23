import React from "react";
import { CaseNode as CaseNodeModel } from "../../lib/nodes";
import { BaseNode } from "./BaseNode";

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
    const WIDTH = 80;
    const HEIGHT = 150;

    return (
        <BaseNode
            screenX={screenX}
            screenY={screenY}
            id={id}
            onMouseDown={onMouseDown}
            node={node}
            onStartConnection={onStartConnection}
            onEndConnection={onEndConnection}
            selected={selected}
            width={WIDTH}
            height={HEIGHT}
        >
            Case
        </BaseNode>
    );
};
