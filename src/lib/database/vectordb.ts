import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import { create } from "zustand";

interface VectorDBState {
    db: PGlite | null;
    initialize: () => Promise<void>;
}

export const useVectorDB = create<VectorDBState>((set, get) => ({
    db: null,
    isInitialized: false,
    initialize: async () => {
        if (get().db !== null) {
            return;
        }

        try {
            const db = new PGlite({
                extensions: { vector }
            });

            await db.exec("CREATE EXTENSION vector;");

            await db.exec(
                "CREATE TABLE documents (id SERIAL PRIMARY KEY, content TEXT, embedding vector(1536));"
            );

            set({ db });
        } catch (error) {
            console.error("Failed to initialize vector database:", error);
            throw error;
        }
    }
}));
