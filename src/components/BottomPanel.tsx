"use client";

import * as Separator from "@radix-ui/react-separator";
import useStore from "@/store/useStore";
import { getNodeFactory } from "./nodes/NodeFactory";

export const BottomPanel: React.FC = () => {
    const selectedNode = useStore((state) => {
        if (state.selectedNode === null) {
            return null;
        }

        return state.nodes.get(state.selectedNode.id)!;
    });

    const nodeFactory = selectedNode ? getNodeFactory(selectedNode) : null;

    return (
        <div className="h-64 max-h-64 overflow-y-scroll border-t border-gray-800 bg-gray-900">
            <Separator.Root className="h-[1px] bg-gray-800" />
            <div className="overflow-y-scroll p-4">
                <h2 className="mb-4 text-lg font-medium text-gray-200">
                    {nodeFactory?.name ?? "No node selected"}
                </h2>
                {nodeFactory && nodeFactory.Panel}
            </div>
        </div>
    );
};
