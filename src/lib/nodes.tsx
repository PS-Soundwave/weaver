import OpenAI from "openai";
import ConsolePanel from "@/components/nodes/Console/ConsolePanel";
import LLMPanel from "@/components/nodes/LLM/LLMPanel";
import { getConnectedNode, Store } from "@/store/useStore";

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

    getConnectors: () => Connector[];
    getConnectorPositions: (
        _screenX: number,
        _screenY: number
    ) => ConnectorPosition[];
    getPanelContent: () => React.ReactElement;
    call: (_state: Store, _prompt: string) => void;
}

export class LLMNode implements Node {
    static readonly WIDTH = 120;
    static readonly HEIGHT = 80;

    id: string;
    x: number;
    y: number;
    type = "llm";

    prompt = "";
    loading = false;
    error: string | null = null;
    structuredOutput = false;

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
                x: screenX - LLMNode.WIDTH / 2,
                y: screenY
            },
            {
                id: `${this.id}-output`,
                x: screenX + LLMNode.WIDTH / 2,
                y: screenY
            }
        ];
    }

    getPanelContent(): React.ReactElement {
        return <LLMPanel node={this} />;
    }

    async call(state: Store, prompt: string) {
        this.loading = true;
        this.error = null;
        state.updateNode(this);

        try {
            const openai = new OpenAI({
                apiKey: state.openAIKey,
                dangerouslyAllowBrowser: true
            });

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini-2024-07-18",
                messages: [
                    { role: "system", content: this.prompt },
                    { role: "user", content: prompt }
                ],
                response_format: this.structuredOutput
                    ? { type: "json_object" }
                    : { type: "text" }
            });

            const result = completion.choices[0]?.message?.content;

            if (!result) {
                throw new Error("No response content received");
            }

            getConnectedNode(state, this.id)?.call(state, result);
        } catch (err) {
            console.error("Error calling OpenAI:", err);
            this.error =
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred";
        } finally {
            this.loading = false;
            state.updateNode(this);
        }
    }
}

export class ConsoleNode implements Node {
    static readonly SIZE = 150;

    id: string;
    x: number;
    y: number;
    type = "console";

    prompt = "";

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    getConnectors(): Connector[] {
        return [{ id: `${this.id}-output`, type: "output" }];
    }

    getConnectorPositions(
        screenX: number,
        screenY: number
    ): ConnectorPosition[] {
        return [
            {
                id: `${this.id}-output`,
                x: screenX + ConsoleNode.SIZE / 2,
                y: screenY
            }
        ];
    }

    getPanelContent(): React.ReactElement {
        return <ConsolePanel node={this} />;
    }

    call() {
        throw new Error("Console nodes do not support calling");
    }
}
