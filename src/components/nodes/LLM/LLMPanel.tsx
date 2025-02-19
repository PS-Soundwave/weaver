import { useState } from "react";

export default function LLMPanel() {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle the submission of the input value
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 focus:border-purple-500 focus:outline-none"
                placeholder="Input prompt..."
            />
            <button
                type="submit"
                className="focus:ring-opacity-50 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
                Submit
            </button>
        </form>
    );
}
