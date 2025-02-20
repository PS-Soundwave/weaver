import { useState } from 'react';
import useStore from '../store/useStore';

export const SettingsMenu: React.FC = () => {
    const { openAIKey, setOpenAIKey } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [key, setKey] = useState(openAIKey);

    const handleSubmit = () => {
        setOpenAIKey(key);
        setIsOpen(false);
    };

    return (
        <div className="absolute top-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200"
            >
                ⚙️ Settings
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                OpenAI API Key
                            </label>
                            <input
                                type="password"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="sk-..."
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white"
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
