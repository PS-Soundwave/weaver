import OpenAI from "openai";
import { CasePanel } from "@/components/nodes/Case/CasePanel";
import { getConnectors } from "@/components/nodes/CaseNode";
import ConsolePanel from "@/components/nodes/Console/ConsolePanel";
import { EndPanel } from "@/components/nodes/End/EndPanel";
import LLMPanel from "@/components/nodes/LLM/LLMPanel";
import {
    getConnectedNode,
    getNodeThroughConnector,
    Store
} from "@/store/useStore";
import { useVectorDB } from "./database/vectordb";

export interface Connector {
    id: string;
    type: "input" | "output";
}

export interface ConnectorPosition {
    id: string;
    x: number;
    y: number;
}

export interface Node {
    id: string;
    x: number;
    y: number;
    type: string;
    getConnectorPositions: (
        _screenX: number,
        _screenY: number
    ) => ConnectorPosition[];
    getPanelContent: () => React.ReactElement;
    call: (_state: Store, _prompt: string) => void;
    copy: () => Node;
}

export type NewBaseNode = {
    id: string;
    x: number;
    y: number;
};

export type LLMNode = NewBaseNode & {
    type: "llm";
    state: {
        loading: boolean;
        error: string | null;
        prompt: string;
        structuredOutput: boolean;
    };
};

export type ConsoleNode = NewBaseNode & {
    type: "console";
    state: {
        prompt: string;
    };
};

export type EndNode = NewBaseNode & {
    type: "end";
    state: {
        value: string;
    };
};

export type CaseNode = NewBaseNode & {
    type: "case";
    state: {
        caseKey: string;
        valueKey: string;
        cases: string[];
    };
};

export type VectorDBStoreNode = NewBaseNode & {
    type: "vectordb-store";
    state: Record<string, never>;
};

export type VectorDBRetrieveNode = NewBaseNode & {
    type: "vectordb-retrieve";
    state: Record<string, never>;
};

export type NewNode =
    | LLMNode
    | ConsoleNode
    | EndNode
    | CaseNode
    | VectorDBStoreNode
    | VectorDBRetrieveNode;

const getDelayForSpeed = (
    speed: "realtime" | "fast" | "medium" | "slow"
): number => {
    switch (speed) {
        case "fast":
            return 500;
        case "medium":
            return 1000;
        case "slow":
            return 2000;
        default:
            return 0;
    }
};

export const call = async (node: NewNode, state: Store, prompt: string) => {
    // Add delay based on execution speed setting
    const delay = getDelayForSpeed(state.executionSpeed);
    if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    switch (node.type) {
        case "llm":
            node.state.loading = true;
            node.state.error = null;
            state.updateNode(node);

            try {
                const openai = new OpenAI({
                    apiKey: state.openAIKey,
                    dangerouslyAllowBrowser: true
                });

                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini-2024-07-18",
                    messages: [
                        { role: "system", content: node.state.prompt },
                        { role: "user", content: prompt }
                    ],
                    response_format: node.state.structuredOutput
                        ? { type: "json_object" }
                        : { type: "text" }
                });

                const result = completion.choices[0]?.message?.content;

                if (!result) {
                    throw new Error("No response content received");
                }

                const next = getConnectedNode(state, node.id);

                if (next) {
                    await call(next, state, result);
                }
            } catch (err) {
                console.error("Error calling OpenAI:", err);
                node.state.error =
                    err instanceof Error
                        ? err.message
                        : "An unknown error occurred";
                state.updateNode(node);
            } finally {
                node.state.loading = false;
                state.updateNode(node);
            }
            break;
        case "end":
            node.state.value = prompt;
            state.updateNode(node);
            break;
        case "case":
            try {
                const jsonInput = JSON.parse(prompt);

                if (!node.state.caseKey || !node.state.valueKey) {
                    console.warn("Case or value key not set");
                    return;
                }

                const caseValue = jsonInput[node.state.caseKey];
                const outputValue = jsonInput[node.state.valueKey];

                if (caseValue === undefined) {
                    console.warn(
                        `Case key "${node.state.caseKey}" not found in input`
                    );
                    return;
                }

                if (outputValue === undefined) {
                    console.warn(
                        `Value key "${node.state.valueKey}" not found in input`
                    );
                    return;
                }

                const next = getNodeThroughConnector(
                    state,
                    `${node.id}-output-${caseValue}`
                );

                if (next) {
                    await call(next, state, JSON.stringify(outputValue));
                }
            } catch (e) {
                console.error("Failed to parse JSON input:", e);
            }
            break;
        case "vectordb-store":
            try {
                const openai = new OpenAI({
                    apiKey: state.openAIKey,
                    dangerouslyAllowBrowser: true
                });

                // Get embeddings from OpenAI
                const response = await openai.embeddings.create({
                    model: "text-embedding-3-small",
                    input: prompt
                });

                let db = useVectorDB.getState();

                if (db.db === null) {
                    await db.initialize();
                    db = useVectorDB.getState();
                }

                // Store the document and its embedding
                await db.db?.query(
                    "INSERT INTO documents (content, embedding) VALUES ($1, $2);",
                    [prompt, JSON.stringify(response.data[0].embedding)]
                );

                const next = getConnectedNode(state, node.id);

                if (next) {
                    await call(next, state, prompt);
                }
            } catch (error) {
                console.error("Error in VectorDBStoreNode:", error);
                throw error;
            }
            break;
        case "vectordb-retrieve":
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
                    input: prompt
                });

                const queryEmbedding = response.data[0].embedding;

                // Get all documents and find the most similar one
                const results = await vectorDB.db?.query(
                    "SELECT content FROM documents ORDER BY 1 - (embedding <=> ($1)) DESC LIMIT 1;",
                    [JSON.stringify(queryEmbedding)]
                );

                const output = `${prompt}\n${(results?.rows[0] as { content: string }).content}`;

                const next = getConnectedNode(state, node.id);

                if (next) {
                    await call(next, state, output);
                }
            } catch (error) {
                console.error("Error in VectorDBRetrieveNode:", error);
                throw error;
            }
            break;
        default:
            throw new Error(
                `Node type "${node.type}" does not support calling`
            );
    }
};

export const getPanelContent = (node: NewNode) => {
    switch (node.type) {
        case "llm":
            return <LLMPanel node={node} />;
        case "console":
            return <ConsolePanel node={node} />;
        case "end":
            return <EndPanel node={node} />;
        case "case":
            return <CasePanel node={node} />;
        case "vectordb-store":
            return (
                <div className="p-4">
                    <h3 className="text-lg font-bold">Vector DB Store</h3>
                    <p className="text-sm text-gray-600">
                        Stores input in vector database
                    </p>
                </div>
            );
        case "vectordb-retrieve":
            return (
                <div className="p-4">
                    <h3 className="text-lg font-bold">Vector DB Retrieve</h3>
                    <p className="text-sm text-gray-600">
                        Retrieves similar documents
                    </p>
                </div>
            );
        default:
            return null;
    }
};

export const getConnectorPositions = (
    node: NewNode,
    screenX: number,
    screenY: number
) => {
    switch (node.type) {
        case "llm": {
            const LLM_WIDTH = 120;

            return [
                {
                    id: `${node.id}-input`,
                    x: screenX - LLM_WIDTH / 2,
                    y: screenY
                },
                {
                    id: `${node.id}-output`,
                    x: screenX + LLM_WIDTH / 2,
                    y: screenY
                }
            ];
        }
        case "console": {
            const CONSOLE_SIZE = 150;

            return [
                {
                    id: `${node.id}-output`,
                    x: screenX + CONSOLE_SIZE / 2,
                    y: screenY
                }
            ];
        }
        case "end": {
            const END_WIDTH = 120;

            return [
                {
                    id: `${node.id}-input`,
                    x: screenX - END_WIDTH / 2,
                    y: screenY
                }
            ];
        }
        case "case": {
            const WIDTH = 80;
            const HEIGHT = 150;

            const positions: ConnectorPosition[] = [];
            const connectors = getConnectors(node);

            // Input connector at the top
            positions.push({
                id: connectors[0].id,
                x: screenX - WIDTH / 2,
                y: screenY
            });

            // Output connectors evenly spaced at the bottom
            const outputCount = node.state.cases.length;
            if (outputCount > 0) {
                const spacing = HEIGHT / (outputCount + 1);
                node.state.cases.forEach((_, index) => {
                    positions.push({
                        id: connectors[index + 1].id,
                        x: screenX + WIDTH / 2,
                        y: screenY - HEIGHT / 2 + spacing * (index + 1)
                    });
                });
            }

            return positions;
        }
        case "vectordb-store": {
            const WIDTH = 150;
            const HEIGHT = 80;

            return [
                {
                    id: `${node.id}-input`,
                    x: screenX,
                    y: screenY + HEIGHT / 2
                },
                {
                    id: `${node.id}-output`,
                    x: screenX + WIDTH,
                    y: screenY + HEIGHT / 2
                }
            ];
        }
        case "vectordb-retrieve": {
            const WIDTH = 150;
            const HEIGHT = 80;

            return [
                {
                    id: `${node.id}-input`,
                    x: screenX,
                    y: screenY + HEIGHT / 2
                },
                {
                    id: `${node.id}-output`,
                    x: screenX + WIDTH,
                    y: screenY + HEIGHT / 2
                }
            ];
        }
        default:
            return [];
    }
};
