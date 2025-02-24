import useStore from "@/store/useStore";
import { BaseNode } from "./BaseNode";
import { VectorDBStoreNode as VectorDBStoreNodeModel } from "./NodeFactory";

interface VectorDBStoreNodeProps {
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
    node: VectorDBStoreNodeModel;
}

export const WIDTH = 160;
export const HEIGHT = 80;

export const VectorDBStoreNode = ({
    x,
    y,
    onMouseDown,
    onStartConnection,
    onEndConnection,
    onContextMenu,
    node
}: VectorDBStoreNodeProps) => {
    const selected = useStore((state) => state.selectedNode?.id === node.id);

    return (
        <BaseNode
            onMouseDown={onMouseDown}
            id={node.id}
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
            Vector DB Store
        </BaseNode>
    );
};
