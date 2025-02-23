import { VectorDBRetrieveNode as VectorDBRetrieveNodeModel } from "../../lib/nodes";
import { BaseNode } from "./BaseNode";

interface VectorDBRetrieveNodeProps {
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
    node: VectorDBRetrieveNodeModel;
}

const WIDTH = 150;
const HEIGHT = 80;

export const VectorDBRetrieveNode = ({
    id,
    screenX,
    screenY,
    selected,
    onMouseDown,
    onStartConnection,
    onEndConnection,
    node
}: VectorDBRetrieveNodeProps) => {
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
            Vector DB Retrieve
        </BaseNode>
    );
};
