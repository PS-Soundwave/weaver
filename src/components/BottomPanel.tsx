"use client";

import * as Separator from "@radix-ui/react-separator";
import { Node } from "../lib/nodes";

interface BottomPanelProps {
    selectedNode: Node | null;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({ selectedNode }) => {
    return (
        <div className="h-48 border-t border-gray-800 bg-gray-900">
            <Separator.Root className="h-[1px] bg-gray-800" />
            <div className="p-4">
                <h2 className="mb-4 text-lg font-medium text-gray-200">
                    {selectedNode?.type ?? "No node selected"}
                </h2>
                {selectedNode && selectedNode.getPanelContent()}
            </div>
        </div>
    );
};
