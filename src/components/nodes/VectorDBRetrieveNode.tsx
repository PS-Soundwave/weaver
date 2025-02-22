import { VectorDBRetrieveNode as VectorDBRetrieveNodeClass } from "../../lib/nodes/VectorDBRetrieveNode";
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
}

export const VectorDBRetrieveNode = ({
    id,
    screenX,
    screenY,
    selected,
    onMouseDown,
    onStartConnection,
    onEndConnection
}: VectorDBRetrieveNodeProps) => {
    const nodeInstance = new VectorDBRetrieveNodeClass(id, 0, 0);
    const connectorPositions = nodeInstance.getConnectorPositions(
        screenX,
        screenY
    );

    return (
        <BaseNode onMouseDown={onMouseDown} id={id}>
            <foreignObject
                x={screenX}
                y={screenY}
                width={VectorDBRetrieveNodeClass.WIDTH}
                height={VectorDBRetrieveNodeClass.HEIGHT}
            >
                <div
                    className={`h-full w-full rounded border-2 bg-gray-800 p-2 ${
                        selected ? "border-blue-500" : "border-gray-700"
                    }`}
                >
                    <div className="text-center text-sm font-bold text-white">
                        Vector DB Retrieve
                    </div>
                </div>
            </foreignObject>
            {nodeInstance.getConnectors().map((connector) => {
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
