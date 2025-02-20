import { useState } from "react";
import { LLMNode } from "@/lib/nodes";
import useStore from "@/store/useStore";

interface LLMPanelProps {
    node: LLMNode;
}

export default function LLMPanel({ node }: LLMPanelProps) {
    const updateNode = useStore((state) => state.updateNode);
    const [text, setText] = useState(node.prompt);

    return (
        <div className="flex flex-col gap-4 p-4">
            {/*<div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Model</label>
                <select
                    value={node.data.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200"
                >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                </select>
            </div>
            
            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Temperature</label>
                <input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={node.data.temperature}
                    onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                    className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200"
                />
            </div>

                <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Max Tokens</label>
                <input
                    type="number"
                    min="1"
                    max="4000"
                    value={node.data.maxTokens}
                    onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
                    className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200"
                />
            </div>*/}
            {node.loading && (
                <div className="text-sm text-purple-400">Processing...</div>
            )}

            {node.error && (
                <div className="rounded bg-red-950 p-2 text-sm text-red-400">
                    {node.error}
                </div>
            )}

            <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Structured Output</label>
                <input
                    type="checkbox"
                    checked={node.structuredOutput}
                    onChange={(e) => {
                        node.structuredOutput = e.target.checked;
                        updateNode(node);
                    }}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-600"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">System Prompt</label>
                <textarea
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        node.prompt = e.target.value;
                        updateNode(node);
                    }}
                    className="h-32 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200"
                    placeholder="Enter system prompt..."
                />
            </div>
        </div>
    );
}
