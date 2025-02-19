import { create } from "zustand";
import { Node } from "../lib/nodes";

interface Wire {
    id: string;
    fromNode: string;
    fromConnector: string;
    toNode: string;
    toConnector: string;
}

interface Store {
    nodes: Map<string, Node>;
    wires: Map<string, Wire>;
    selectedNode: Node | null;
    addNode: (_node: Node) => void;
    removeNode: (_id: string) => void;
    addWire: (_wire: Wire) => void;
    removeWire: (_id: string) => void;
    setSelectedNode: (_node: Node | null) => void;
    moveNode: (_id: string, _x: number, _y: number) => void;
}

const useStore = create<Store>((set) => ({
    nodes: new Map(),
    wires: new Map(),
    selectedNode: null,

    addNode: (node: Node) =>
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

    setSelectedNode: (node: Node | null) =>
        set({
            selectedNode: node
        }),

    moveNode: (id: string, x: number, y: number) =>
        set((state) => {
            const node = state.nodes.get(id);

            if (!node) {
                return state;
            }

            node.x = x;
            node.y = y;

            const newNodes = new Map(state.nodes);

            return { nodes: newNodes };
        })
}));

export default useStore;
