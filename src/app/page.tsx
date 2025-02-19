"use client";

import { useState } from "react";
import { BottomPanel } from "@/components/BottomPanel";
import { Grid } from "@/components/Grid";
import { Node } from "@/lib/nodes";

export default function Home() {
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    return (
        <main className="flex h-screen w-screen flex-col bg-gray-950">
            <div className="relative flex-1">
                <Grid onNodeSelect={setSelectedNode} />
            </div>
            <BottomPanel selectedNode={selectedNode} />
        </main>
    );
}
