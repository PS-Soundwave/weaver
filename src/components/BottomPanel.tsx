"use client";

import * as Separator from "@radix-ui/react-separator";
import useStore from "@/store/useStore";

export const BottomPanel: React.FC = () => {
    const selectedNode = useStore((state) =>
        state.nodes.get(state.selectedNode?.id)
    );

    return (
        <div className="h-64 max-h-64 overflow-y-scroll border-t border-gray-800 bg-gray-900">
            <Separator.Root className="h-[1px] bg-gray-800" />
            <div className="overflow-y-scroll p-4">
                <h2 className="mb-4 text-lg font-medium text-gray-200">
                    {selectedNode?.type ?? "No node selected"}
                </h2>
                {selectedNode && selectedNode?.getPanelContent()}
            </div>
        </div>
    );
};
