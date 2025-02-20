import { useState } from "react";
import { ConsoleNode } from "@/lib/nodes";
import useStore, { getConnectedNode } from "@/store/useStore";

interface ConsolePanelProps {
    node: ConsoleNode;
}

export default function ConsolePanel({ node }: ConsolePanelProps) {
    const state = useStore.getState();
    const [text, setText] = useState(node.prompt);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        getConnectedNode(state, node.id)?.call(state, node.prompt);
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-300">User Prompt</label>
                    <textarea
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            node.prompt = e.target.value;
                            state.updateNode(node);
                        }}
                        className="h-32 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200"
                        placeholder="Enter your prompt..."
                    />
                </div>
                <button
                    type="submit"
                    className="focus:ring-opacity-50 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                    Execute
                </button>
            </form>
        </div>
    );
}
