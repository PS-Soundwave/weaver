import OpenAI from "openai";
import { getConnectedNode, Store } from "../../store/useStore";
import { useVectorDB } from "../database/vectordb";
import { Connector, ConnectorPosition, Node } from "../nodes";

export class VectorDBRetrieveNode implements Node {
    static readonly WIDTH = 150;
    static readonly HEIGHT = 80;

    id: string;
    x: number;
    y: number;
    type = "vectordb-retrieve";

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    getConnectors(): Connector[] {
        return [
            { id: `${this.id}-input`, type: "input" },
            { id: `${this.id}-output`, type: "output" }
        ];
    }

    getConnectorPositions(
        screenX: number,
        screenY: number
    ): ConnectorPosition[] {
        return [
            {
                id: `${this.id}-input`,
                x: screenX,
                y: screenY + VectorDBRetrieveNode.HEIGHT / 2
            },
            {
                id: `${this.id}-output`,
                x: screenX + VectorDBRetrieveNode.WIDTH,
                y: screenY + VectorDBRetrieveNode.HEIGHT / 2
            }
        ];
    }

    async call(state: Store, input: string) {
        try {
            let vectorDB = useVectorDB.getState();
            if (vectorDB.db === null) {
                await vectorDB.initialize();
                vectorDB = useVectorDB.getState();
            }

            // Get embeddings for the input query

            const openai = new OpenAI({
                apiKey: state.openAIKey,
                dangerouslyAllowBrowser: true
            });

            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input
            });

            const queryEmbedding = response.data[0].embedding;

            // Get all documents and find the most similar one
            const results = await vectorDB.db?.query(
                "SELECT content FROM documents ORDER BY 1 - (embedding <=> ($1)) DESC LIMIT 1;",
                [JSON.stringify(queryEmbedding)]
            );

            const output = `${input}\n${(results?.rows[0] as { content: string }).content}`;

            getConnectedNode(state, this.id)?.call(state, output);
        } catch (error) {
            console.error("Error in VectorDBRetrieveNode:", error);
            throw error;
        }
    }

    getPanelContent(): React.ReactElement {
        return (
            <div className="p-4">
                <h3 className="text-lg font-bold">Vector DB Retrieve</h3>
                <p className="text-sm text-gray-600">
                    Retrieves similar documents
                </p>
            </div>
        );
    }

    copy(): Node {
        return new VectorDBRetrieveNode(this.id, this.x, this.y);
    }
}
