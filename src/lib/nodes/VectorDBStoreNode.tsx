import OpenAI from "openai";
import { getConnectedNode, Store } from "../../store/useStore";
import { useVectorDB } from "../database/vectordb";
import { Connector, ConnectorPosition, Node } from "../nodes";

export class VectorDBStoreNode implements Node {
    static readonly WIDTH = 150;
    static readonly HEIGHT = 80;

    id: string;
    x: number;
    y: number;
    type = "vectordb-store";

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
                y: screenY + VectorDBStoreNode.HEIGHT / 2
            },
            {
                id: `${this.id}-output`,
                x: screenX + VectorDBStoreNode.WIDTH,
                y: screenY + VectorDBStoreNode.HEIGHT / 2
            }
        ];
    }

    async call(state: Store, input: string) {
        try {
            const openai = new OpenAI({
                apiKey: state.openAIKey,
                dangerouslyAllowBrowser: true
            });

            // Get embeddings from OpenAI
            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input
            });

            let db = useVectorDB.getState();

            if (db.db === null) {
                await db.initialize();
                db = useVectorDB.getState();
            }

            // Store the document and its embedding
            await db.db?.query(
                "INSERT INTO documents (content, embedding) VALUES ($1, $2);",
                [input, JSON.stringify(response.data[0].embedding)]
            );

            getConnectedNode(state, this.id)?.call(state, input);
        } catch (error) {
            console.error("Error in VectorDBStoreNode:", error);
            throw error;
        }
    }

    getPanelContent(): React.ReactElement {
        return (
            <div className="p-4">
                <h3 className="text-lg font-bold">Vector DB Store</h3>
                <p className="text-sm text-gray-600">
                    Stores input in vector database
                </p>
            </div>
        );
    }

    copy(): Node {
        return new VectorDBStoreNode(this.id, this.x, this.y);
    }
}
