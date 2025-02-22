import React, { useState } from "react";
import { CaseNode } from "@/lib/nodes";
import useStore from "@/store/useStore";

interface CasePanelProps {
    node: CaseNode;
}

export const CasePanel: React.FC<CasePanelProps> = ({ node }) => {
    const [newCase, setNewCase] = useState("");
    const updateNode = useStore((state) => state.updateNode);

    const addCase = () => {
        if (newCase && !node.state.cases.includes(newCase)) {
            node.state.cases = [...node.state.cases, newCase];
            setNewCase("");
            updateNode(node);
        }
    };

    const removeCase = (caseValue: string) => {
        node.state.cases = node.state.cases.filter((c) => c !== caseValue);
        updateNode(node);
    };

    return (
        <div className="space-y-4 p-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium">Case Key</label>
                <input
                    type="text"
                    value={node.state.caseKey}
                    onChange={(e) => {
                        node.state.caseKey = e.target.value;
                        updateNode(node);
                    }}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Enter JSON key for case analysis"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Value Key</label>
                <input
                    type="text"
                    value={node.state.valueKey}
                    onChange={(e) => {
                        node.state.valueKey = e.target.value;
                        updateNode(node);
                    }}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Enter JSON key for output value"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Cases</label>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newCase}
                        onChange={(e) => setNewCase(e.target.value)}
                        className="flex-1 rounded-md border px-3 py-2"
                        placeholder="Add new case"
                    />
                    <button
                        onClick={addCase}
                        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                        Add
                    </button>
                </div>
                <div className="space-y-2">
                    {node.state.cases.map((caseValue) => (
                        <div
                            key={caseValue}
                            className="flex items-center justify-between rounded bg-gray-800 p-2"
                        >
                            <span>{caseValue}</span>
                            <button
                                onClick={() => removeCase(caseValue)}
                                className="text-red-500 hover:text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
