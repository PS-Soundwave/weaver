"use client";

import { BottomPanel } from "@/components/BottomPanel";
import { Grid } from "@/components/Grid";

export default function Home() {
    return (
        <main className="flex h-screen w-screen flex-col bg-gray-950">
            <Grid />
            <BottomPanel />
        </main>
    );
}
