import { GraphNode } from "@/components/nodes/NodeFactory";
import { Store, Wire } from "./useStore";

export interface SerializedState {
    nodes: GraphNode[];
    wires: Wire[];
}

export const serializeState = (state: Store): SerializedState => {
    return {
        nodes: Array.from(state.nodes.values()),
        wires: Array.from(state.wires.values())
    };
};

export const deserializeState = (
    serialized: SerializedState
): Partial<Store> => {
    const nodes = new Map<string, GraphNode>();
    const wires = new Map<string, Wire>();

    serialized.nodes.forEach((node) => {
        nodes.set(node.id, node);
    });

    serialized.wires.forEach((wire) => {
        wires.set(wire.id, wire);
    });

    return {
        nodes,
        wires,
        selectedNode: null,
        activeNode: null
    };
};

export const exportToJson = (state: Store): string =>
    JSON.stringify(serializeState(state), null, 2);

export const importFromJson = (json: string): Partial<Store> => {
    try {
        const parsed = JSON.parse(json) as SerializedState;
        return deserializeState(parsed);
    } catch {
        throw new Error(`Failed to parse JSON`);
    }
};
