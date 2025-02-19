"use client";

import * as Separator from "@radix-ui/react-separator";
import { useState } from "react";

interface BottomPanelProps {
    selectedNodeId: string | null;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({ selectedNodeId }) => {
    const [consoleInput, setConsoleInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setConsoleInput("");
    };

    return (
        <div className="h-48 border-t border-gray-800 bg-gray-900">
            <Separator.Root className="h-[1px] bg-gray-800" />
            <div className="p-4">
                <h2 className="mb-4 text-lg font-medium text-gray-200">
                    {selectedNodeId ?? "No node selected"}
                </h2>
                {selectedNodeId && (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={consoleInput}
                            onChange={(e) => setConsoleInput(e.target.value)}
                            className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 focus:border-purple-500 focus:outline-none"
                            placeholder="Enter console command..."
                        />
                        <button
                            type="submit"
                            className="focus:ring-opacity-50 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                            Submit
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
