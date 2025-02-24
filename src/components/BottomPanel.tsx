import { useCallback, useEffect, useState } from "react";
import useStore from "@/store/useStore";
import { getNodeFactory } from "./nodes/NodeFactory";

interface BottomPanelProps {
    setHeight: (_height: number) => void;
    height: number;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
    setHeight,
    height
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const selectedNode = useStore((state) => {
        if (state.selectedNode === null) {
            return null;
        }
        return state.nodes.get(state.selectedNode.id)!;
    });

    const nodeFactory = selectedNode ? getNodeFactory(selectedNode) : null;

    const handleMouseDown = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDragging) {
                const newHeight =
                    document.documentElement.clientHeight - e.clientY;

                setHeight(
                    Math.max(
                        100,
                        Math.min(
                            newHeight,
                            document.documentElement.clientHeight * 0.8
                        )
                    )
                );
            }
        },
        [isDragging, setHeight]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "row-resize";
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "default";
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <div
            style={{ height }}
            className="shrink-0 overflow-y-hidden border-t border-gray-800 bg-gray-900"
        >
            <div
                className="h-1 cursor-row-resize bg-gray-800 hover:bg-gray-700"
                onMouseDown={handleMouseDown}
            />
            <div className="h-[calc(100%-4px)] overflow-y-scroll p-4">
                <h2 className="mb-4 text-lg font-medium text-gray-200">
                    {nodeFactory?.name ?? "No node selected"}
                </h2>
                {nodeFactory && nodeFactory.Panel}
            </div>
        </div>
    );
};
