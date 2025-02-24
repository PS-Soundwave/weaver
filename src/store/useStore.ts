import { create } from "zustand";
import { Node } from "@/components/nodes/NodeFactory";

interface Wire {
    id: string;
    fromNode: string;
    fromConnector: string;
    toNode: string;
    toConnector: string;
}

export interface Store {
    nodes: Map<string, Node>;
    wires: Map<string, Wire>;
    selectedNode: Node | null;
    activeNode: Node | null;
    openAIKey: string;
    executionSpeed: "realtime" | "fast" | "medium" | "slow";
    addNode: (_node: Node) => void;
    removeNode: (_id: string) => void;
    addWire: (_wire: Wire) => void;
    removeWire: (_id: string) => void;
    setSelectedNode: (_node: Node | null) => void;
    setActiveNode: (_node: Node | null) => void;
    updateNode: (_node: Node) => void;
    setOpenAIKey: (_key: string) => void;
    setExecutionSpeed: (
        _speed: "realtime" | "fast" | "medium" | "slow"
    ) => void;
}

const useStore = create<Store>((set) => ({
    nodes: new Map(),
    wires: new Map(),
    selectedNode: null,
    activeNode: null,
    openAIKey: "",
    executionSpeed: "medium",

    addNode: (node: Node) =>
        set((state) => {
            const Nodes = new Map(state.nodes);
            Nodes.set(node.id, node);
            return { nodes: Nodes };
        }),

    removeNode: (id: string) =>
        set((state) => {
            const Nodes = new Map(state.nodes);
            Nodes.delete(id);

            const newWires = new Map(state.wires);
            for (const [wireId, wire] of state.wires) {
                if (wire.fromNode === id || wire.toNode === id) {
                    newWires.delete(wireId);
                }
            }

            return {
                nodes: Nodes,
                wires: newWires,
                selectedNode:
                    state.selectedNode?.id === id ? null : state.selectedNode
            };
        }),

    addWire: (wire: Wire) =>
        set((state) => {
            const newWires = new Map(state.wires);
            newWires.set(wire.id, wire);
            return { wires: newWires };
        }),

    removeWire: (id: string) =>
        set((state) => {
            const newWires = new Map(state.wires);
            newWires.delete(id);
            return {
                wires: newWires
            };
        }),

    setSelectedNode: (node: Node | null) =>
        set({
            selectedNode: node
        }),

    setActiveNode: (node: Node | null) =>
        set({
            activeNode: node
        }),

    updateNode: (node: Node) => {
        set((state) => {
            const Nodes = new Map(state.nodes);
            const Node = { ...node };
            Node.state = { ...node.state };
            Nodes.set(node.id, Node);
            return { nodes: Nodes };
        });
    },

    setOpenAIKey: (key: string) =>
        set({
            openAIKey: key
        }),

    setExecutionSpeed: (speed: "realtime" | "fast" | "medium" | "slow") =>
        set({
            executionSpeed: speed
        })
}));

export default useStore;

export const getConnectedNode = (state: Store, id: string) => {
    const wire = state.wires.values().find((w) => w.fromNode === id);
    if (!wire) {
        return null;
    }

    return state.nodes.get(wire.toNode);
};

export const getNodeThroughConnector = (state: Store, connectorId: string) => {
    const wire = state.wires
        .values()
        .find((w) => w.fromConnector === connectorId);
    if (!wire) {
        return null;
    }

    return state.nodes.get(wire.toNode);
};
