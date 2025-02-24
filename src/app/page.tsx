"use client";

import { useEffect, useState } from "react";
import { BottomPanel } from "@/components/BottomPanel";
import { Grid } from "@/components/Grid";

export default function Home() {
    const [documentHeight, setDocumentHeight] = useState<number | null>(null);
    const [panelHeight, setPanelHeight] = useState(256);

    useEffect(() => {
        setDocumentHeight(document.documentElement.clientHeight);
    }, []);

    if (documentHeight === null) {
        return null;
    }

    return (
        <main className="flex h-screen w-screen flex-col bg-gray-950">
            <Grid height={documentHeight - panelHeight} />
            <BottomPanel height={panelHeight} setHeight={setPanelHeight} />
        </main>
    );
}
