"use client";

import { useState } from "react";
import { BottomPanel } from "@/components/BottomPanel";
import { Grid } from "@/components/Grid";

export default function Home() {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    return (
        <main className="flex h-screen w-screen flex-col bg-gray-950">
            <div className="relative flex-1">
                <Grid onNodeSelect={setSelectedNodeId} />
            </div>
            <BottomPanel selectedNodeId={selectedNodeId} />
        </main>
    );
}
