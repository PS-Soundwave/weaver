import { VectorDBStoreNode as VectorDBStoreNodeModel } from "../../lib/nodes";
import { BaseNode } from "./BaseNode";

interface VectorDBStoreNodeProps {
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
    node: VectorDBStoreNodeModel;
}

export const VectorDBStoreNode = ({
    id,
    screenX,
    screenY,
    selected,
    onMouseDown,
    onStartConnection,
    onEndConnection,
    node
}: VectorDBStoreNodeProps) => {
    const WIDTH = 150;
    const HEIGHT = 80;

    return (
        <BaseNode
            onMouseDown={onMouseDown}
            id={id}
            node={node}
            onStartConnection={onStartConnection}
            onEndConnection={onEndConnection}
            screenX={screenX}
            screenY={screenY}
            selected={selected}
            width={WIDTH}
            height={HEIGHT}
        >
            Vector DB Store
        </BaseNode>
    );
};
