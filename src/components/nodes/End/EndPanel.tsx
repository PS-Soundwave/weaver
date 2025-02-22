import { EndNode } from "@/lib/nodes";

interface EndPanelProps {
    node: EndNode;
}

export const EndPanel = ({ node }: EndPanelProps) => {
    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Last Value</label>
                <div className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200">
                    {node.state.value || "No value received yet"}
                </div>
            </div>
        </div>
    );
};
