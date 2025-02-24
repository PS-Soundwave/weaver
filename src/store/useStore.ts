import { create } from "zustand";
import { GraphNode } from "@/components/nodes/NodeFactory";

export interface Wire {
    id: string;
    fromNode: string;
    fromConnector: string;
    toNode: string;
    toConnector: string;
}

export interface Store {
    nodes: Map<string, GraphNode>;
    wires: Map<string, Wire>;
    selectedNode: GraphNode | null;
    activeNode: GraphNode | null;
    openAIKey: string;
    executionSpeed: "realtime" | "fast" | "medium" | "slow";
    addNode: (_node: GraphNode) => void;
    removeNode: (_id: string) => void;
    addWire: (_wire: Wire) => void;
    removeWire: (_id: string) => void;
    setSelectedNode: (_node: GraphNode | null) => void;
    setActiveNode: (_node: GraphNode | null) => void;
    updateNode: (_node: GraphNode) => void;
    setOpenAIKey: (_key: string) => void;
    setExecutionSpeed: (
        _speed: "realtime" | "fast" | "medium" | "slow"
    ) => void;
    exportState: () => string;
    importState: (_json: string) => void;
}

const useStore = create<Store>((set, get) => ({
    nodes: new Map(),
    wires: new Map(),
    selectedNode: null,
    activeNode: null,
    openAIKey: "",
    executionSpeed: "medium",

    addNode: (node: GraphNode) =>
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

    setSelectedNode: (node: GraphNode | null) =>
        set({
            selectedNode: node
        }),

    setActiveNode: (node: GraphNode | null) =>
        set({
            activeNode: node
        }),

    updateNode: (node: GraphNode) => {
        set((state) => {
            const nodes = new Map(state.nodes);
            const newNode = { ...node };
            newNode.state = { ...node.state };
            nodes.set(node.id, newNode);
            return { nodes };
        });
    },

    setOpenAIKey: (key: string) =>
        set({
            openAIKey: key
        }),

    setExecutionSpeed: (speed) =>
        set(() => ({
            executionSpeed: speed
        })),

    exportState: () => exportToJson(get()),

    importState: (json) => set(importFromJson(json))
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

const exportToJson = (state: Store): string =>
    JSON.stringify({
        nodes: Array.from(state.nodes.values()),
        wires: Array.from(state.wires.values()),
        selectedNode: state.selectedNode,
        activeNode: state.activeNode,
        openAIKey: state.openAIKey,
        executionSpeed: state.executionSpeed
    });

const importFromJson = (json: string): Partial<Store> => {
    const data = JSON.parse(json);
    return {
        nodes: new Map(data.nodes.map((node: GraphNode) => [node.id, node])),
        wires: new Map(data.wires.map((wire: Wire) => [wire.id, wire])),
        selectedNode: data.selectedNode,
        activeNode: data.activeNode,
        openAIKey: data.openAIKey,
        executionSpeed: data.executionSpeed
    };
};
