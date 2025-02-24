import OpenAI from "openai";
import { ReactElement } from "react";
import { useVectorDB } from "@/lib/database/vectordb";
import {
    getConnectedNode,
    getNodeThroughConnector,
    Store
} from "@/store/useStore";
import { CasePanel } from "./Case/CasePanel";
import { CaseNode } from "./CaseNode";
import ConsolePanel from "./Console/ConsolePanel";
import { ConsoleNode } from "./ConsoleNode";
import { EndPanel } from "./End/EndPanel";
import { EndNode } from "./EndNode";
import LLMPanel from "./LLM/LLMPanel";
import { LLMNode } from "./LLMNode";
import { VectorDBRetrieveNode } from "./VectorDBRetrieveNode";
import { VectorDBStoreNode } from "./VectorDBStoreNode";

type NewBaseNode = {
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

export type GraphNode =
    | LLMNode
    | ConsoleNode
    | EndNode
    | CaseNode
    | VectorDBStoreNode
    | VectorDBRetrieveNode;

type Connector = {
    id: string;
    type: "input" | "output";
    x: number;
    y: number;
};

type NodeProps = {
    x: number;
    y: number;
    onMouseDown: (_e: React.MouseEvent, _id: string) => void;
    onStartConnection: (
        _connectorId: string,
        _type: "input" | "output",
        _nodeId: string
    ) => void;
    onEndConnection: (
        _connectorId: string,
        _type: "input" | "output",
        _nodeId: string
    ) => void;
    onContextMenu: (_e: React.MouseEvent, _id: string) => void;
};

type NodeFactory = (_node: GraphNode) => {
    Node: React.FC<NodeProps>;
    Panel: ReactElement;
    name: string;
    getConnectors: (_x: number, _y: number) => Connector[];
    call: (_state: Store, _input: string) => void;
};

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

export const getNodeFactory: NodeFactory = (node: GraphNode) => {
    switch (node.type) {
        case "llm":
            return {
                Node: (props: NodeProps) => <LLMNode node={node} {...props} />,
                Panel: <LLMPanel node={node} />,
                name: "LLM",
                getConnectors: (x: number, y: number) => {
                    const LLM_WIDTH = 120;
                    return [
                        {
                            id: `${node.id}-input`,
                            type: "input",
                            x: x - LLM_WIDTH / 2,
                            y
                        },
                        {
                            id: `${node.id}-output`,
                            type: "output",
                            x: x + LLM_WIDTH / 2,
                            y
                        }
                    ];
                },
                call: async (state: Store, input: string) => {
                    state.setActiveNode(node);
                    // Add delay based on execution speed setting
                    const delay = getDelayForSpeed(state.executionSpeed);
                    if (delay > 0) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, delay)
                        );
                    }

                    node.state.loading = true;
                    node.state.error = null;
                    state.updateNode(node);

                    try {
                        const openai = new OpenAI({
                            apiKey: state.openAIKey,
                            dangerouslyAllowBrowser: true
                        });

                        const completion = await openai.chat.completions.create(
                            {
                                model: "gpt-4o-mini-2024-07-18",
                                messages: [
                                    {
                                        role: "system",
                                        content: node.state.prompt
                                    },
                                    { role: "user", content: input }
                                ],
                                response_format: node.state.structuredOutput
                                    ? { type: "json_object" }
                                    : { type: "text" }
                            }
                        );

                        const result = completion.choices[0]?.message?.content;

                        if (!result) {
                            throw new Error("No response content received");
                        }

                        const next = getConnectedNode(state, node.id);

                        state.setActiveNode(null);
                        if (next) {
                            await getNodeFactory(next).call(state, result);
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
                        state.setActiveNode(null);
                    }
                }
            };
        case "end":
            return {
                Node: (props: NodeProps) => <EndNode node={node} {...props} />,
                Panel: <EndPanel node={node} />,
                name: "End",
                getConnectors: (x: number, y: number) => {
                    const END_WIDTH = 120;

                    return [
                        {
                            id: `${node.id}-input`,
                            type: "input",
                            x: x - END_WIDTH / 2,
                            y
                        }
                    ];
                },
                call: async (state: Store, input: string) => {
                    state.setActiveNode(node);
                    // Add delay based on execution speed setting
                    const delay = getDelayForSpeed(state.executionSpeed);
                    if (delay > 0) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, delay)
                        );
                    }
                    node.state.value = input;
                    state.updateNode(node);
                    state.setActiveNode(null);
                }
            };
        case "case":
            return {
                Node: (props: NodeProps) => <CaseNode node={node} {...props} />,
                Panel: <CasePanel node={node} />,
                name: "Case",
                getConnectors: (x: number, y: number) => {
                    const WIDTH = 80;
                    const HEIGHT = 150;

                    const connectors: Connector[] = [
                        {
                            id: `${node.id}-input`,
                            type: "input",
                            x: x - WIDTH / 2,
                            y
                        }
                    ];
                    const spacing = HEIGHT / (node.state.cases.length + 1);

                    // Add an output connector for each case
                    node.state.cases.forEach((caseValue, index) => {
                        connectors.push({
                            id: `${node.id}-output-${caseValue}`,
                            type: "output",
                            x: x + WIDTH / 2,
                            y: y - HEIGHT / 2 + spacing * (index + 1)
                        });
                    });

                    return connectors;
                },
                call: async (state: Store, input: string) => {
                    state.setActiveNode(node);
                    // Add delay based on execution speed setting
                    const delay = getDelayForSpeed(state.executionSpeed);
                    if (delay > 0) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, delay)
                        );
                    }

                    try {
                        const jsonInput = JSON.parse(input);

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

                        state.setActiveNode(null);
                        if (next) {
                            await getNodeFactory(next).call(
                                state,
                                JSON.stringify(outputValue)
                            );
                        }
                    } catch (e) {
                        console.error("Failed to parse JSON input:", e);
                    } finally {
                        state.setActiveNode(null);
                    }
                }
            };
        case "console":
            return {
                Node: (props: NodeProps) => (
                    <ConsoleNode node={node} {...props} />
                ),
                Panel: <ConsolePanel node={node} />,
                name: "Start",
                getConnectors: (x: number, y: number) => {
                    const CONSOLE_SIZE = 150;
                    return [
                        {
                            id: `${node.id}-output`,
                            type: "output",
                            x: x + CONSOLE_SIZE / 2,
                            y
                        }
                    ];
                },
                call: async (state: Store, input: string) => {
                    state.setActiveNode(node);
                    // Add delay based on execution speed setting
                    const delay = getDelayForSpeed(state.executionSpeed);
                    if (delay > 0) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, delay)
                        );
                    }

                    const next = getConnectedNode(state, node.id);
                    state.setActiveNode(null);
                    if (next) {
                        await getNodeFactory(next).call(state, input);
                    }
                }
            };
        case "vectordb-store":
            return {
                Node: (props: NodeProps) => (
                    <VectorDBStoreNode node={node} {...props} />
                ),
                Panel: (
                    <div className="p-4">
                        <h3 className="text-lg font-bold">Vector DB Store</h3>
                        <p className="text-sm text-gray-600">
                            Stores input in vector database
                        </p>
                    </div>
                ),
                name: "Vector DB Storage",
                getConnectors: (x: number, y: number) => {
                    const WIDTH = 150;

                    return [
                        {
                            id: `${node.id}-input`,
                            type: "input",
                            x: x - WIDTH / 2,
                            y
                        },
                        {
                            id: `${node.id}-output`,
                            type: "output",
                            x: x + WIDTH / 2,
                            y
                        }
                    ];
                },
                call: async (state: Store, input: string) => {
                    state.setActiveNode(node);
                    // Add delay based on execution speed setting
                    const delay = getDelayForSpeed(state.executionSpeed);
                    if (delay > 0) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, delay)
                        );
                    }

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

                        const next = getConnectedNode(state, node.id);

                        state.setActiveNode(null);
                        if (next) {
                            await getNodeFactory(next).call(state, input);
                        }
                    } catch (error) {
                        console.error("Error in VectorDBStoreNode:", error);
                        throw error;
                    } finally {
                        state.setActiveNode(null);
                    }
                }
            };
        case "vectordb-retrieve":
            return {
                Node: (props: NodeProps) => (
                    <VectorDBRetrieveNode node={node} {...props} />
                ),
                Panel: (
                    <div className="p-4">
                        <h3 className="text-lg font-bold">
                            Vector DB Retrieve
                        </h3>
                        <p className="text-sm text-gray-600">
                            Retrieves similar documents
                        </p>
                    </div>
                ),
                name: "Vector DB Retrieval",
                getConnectors: (x: number, y: number) => {
                    const WIDTH = 150;

                    return [
                        {
                            id: `${node.id}-input`,
                            type: "input",
                            x: x - WIDTH / 2,
                            y
                        },
                        {
                            id: `${node.id}-output`,
                            type: "output",
                            x: x + WIDTH / 2,
                            y
                        }
                    ];
                },
                call: async (state: Store, input: string) => {
                    state.setActiveNode(node);
                    // Add delay based on execution speed setting
                    const delay = getDelayForSpeed(state.executionSpeed);
                    if (delay > 0) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, delay)
                        );
                    }

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

                        const output = `${prompt}\n${(results?.rows[0] as { content: string }).content}`;

                        const next = getConnectedNode(state, node.id);

                        state.setActiveNode(null);

                        if (next) {
                            await getNodeFactory(next).call(state, output);
                        }
                    } catch (error) {
                        console.error("Error in VectorDBRetrieveNode:", error);
                        throw error;
                    } finally {
                        state.setActiveNode(null);
                    }
                }
            };
        default:
            throw new Error(`Unknown node type`);
    }
};
