import {
    Connector as ConnectorModel,
    getConnectorPositions,
    VectorDBStoreNode as VectorDBStoreNodeModel
} from "../../lib/nodes";
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

    const connectors: ConnectorModel[] = [
        { id: `${id}-input`, type: "input" },
        { id: `${id}-output`, type: "output" }
    ];
    const connectorPositions = getConnectorPositions(node, screenX, screenY);

    return (
        <BaseNode onMouseDown={onMouseDown} id={id}>
            <foreignObject
                x={screenX}
                y={screenY}
                width={WIDTH}
                height={HEIGHT}
            >
                <div
                    className={`h-full w-full rounded border-2 bg-gray-800 p-2 ${
                        selected ? "border-blue-500" : "border-gray-700"
                    }`}
                >
                    <div className="text-center text-sm font-bold text-white">
                        Vector DB Store
                    </div>
                </div>
            </foreignObject>
            {connectors.map((connector) => {
                const position = connectorPositions.find(
                    (pos) => pos.id === connector.id
                );
                if (!position) {
                    return null;
                }
                return (
                    <circle
                        key={connector.id}
                        cx={position.x}
                        cy={position.y}
                        r={5}
                        className={`cursor-pointer ${
                            connector.type === "input"
                                ? "fill-green-500"
                                : "fill-red-500"
                        }`}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            onStartConnection(connector.id, connector.type, id);
                        }}
                        onMouseUp={(e) => {
                            e.stopPropagation();
                            onEndConnection(connector.id, connector.type, id);
                        }}
                    />
                );
            })}
        </BaseNode>
    );
};
