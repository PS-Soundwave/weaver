import { useState } from "react";
import useStore from "../store/useStore";

export const SettingsMenu: React.FC = () => {
    const { openAIKey, setOpenAIKey, executionSpeed, setExecutionSpeed } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [key, setKey] = useState(openAIKey);
    const [speed, setSpeed] = useState(executionSpeed);

    const handleSubmit = () => {
        setOpenAIKey(key);
        setExecutionSpeed(speed);
        setIsOpen(false);
    };

    return (
        <div className="absolute top-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-md bg-gray-800 p-2 text-gray-200 hover:bg-gray-700"
            >
                ⚙️ Settings
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg bg-gray-800 p-4 shadow-lg">
                    <h3 className="mb-4 text-lg font-semibold text-gray-200">
                        Settings
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-300">
                                OpenAI API Key
                            </label>
                            <input
                                type="password"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                placeholder="sk-..."
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-300">
                                Execution Speed
                            </label>
                            <select
                                value={speed}
                                onChange={(e) => setSpeed(e.target.value as "realtime" | "fast" | "medium" | "slow")}
                                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            >
                                <option value="realtime">Real Time (No Delay)</option>
                                <option value="fast">Fast (0.5s)</option>
                                <option value="medium">Medium (1s)</option>
                                <option value="slow">Slow (2s)</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-md bg-gray-700 px-4 py-2 text-gray-200 hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-500"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
