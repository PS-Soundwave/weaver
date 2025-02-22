import { call, ConsoleNode } from "@/lib/nodes";
import useStore, { getConnectedNode } from "@/store/useStore";

interface ConsolePanelProps {
    node: ConsoleNode;
}

export default function ConsolePanel({ node }: ConsolePanelProps) {
    const updateNode = useStore((state) => state.updateNode);
    const state = useStore.getState();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const next = getConnectedNode(state, node.id);

        if (next) {
            await call(next, state, node.state.prompt);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-300">User Prompt</label>
                    <textarea
                        value={node.state.prompt}
                        onChange={(e) => {
                            node.state.prompt = e.target.value;
                            updateNode(node);
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
