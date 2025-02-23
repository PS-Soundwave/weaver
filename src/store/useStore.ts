import { create } from "zustand";
import { NewNode } from "../lib/nodes";

interface Wire {
    id: string;
    fromNode: string;
    fromConnector: string;
    toNode: string;
    toConnector: string;
}

export interface Store {
    nodes: Map<string, NewNode>;
    wires: Map<string, Wire>;
    selectedNode: NewNode | null;
    activeNode: NewNode | null;
    openAIKey: string;
    executionSpeed: "realtime" | "fast" | "medium" | "slow";
    addNode: (_node: NewNode) => void;
    removeNode: (_id: string) => void;
    addWire: (_wire: Wire) => void;
    removeWire: (_id: string) => void;
    setSelectedNode: (_node: NewNode | null) => void;
    setActiveNode: (_node: NewNode | null) => void;
    updateNode: (_node: NewNode) => void;
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

    addNode: (node: NewNode) =>
        set((state) => {
            const newNodes = new Map(state.nodes);
            newNodes.set(node.id, node);
            return { nodes: newNodes };
        }),

    removeNode: (id: string) =>
        set((state) => {
            const newNodes = new Map(state.nodes);
            newNodes.delete(id);

            const newWires = new Map(state.wires);
            for (const [wireId, wire] of state.wires) {
                if (wire.fromNode === id || wire.toNode === id) {
                    newWires.delete(wireId);
                }
            }

            return {
                nodes: newNodes,
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

    setSelectedNode: (node: NewNode | null) =>
        set({
            selectedNode: node
        }),

    setActiveNode: (node: NewNode | null) =>
        set({
            activeNode: node
        }),

    updateNode: (node: NewNode) => {
        set((state) => {
            const newNodes = new Map(state.nodes);
            const newNode = { ...node };
            newNode.state = { ...node.state };
            newNodes.set(node.id, newNode);
            return { nodes: newNodes };
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
