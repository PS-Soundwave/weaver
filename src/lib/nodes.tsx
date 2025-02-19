import ConsolePanel from "@/components/nodes/Console/ConsolePanel";
import LLMPanel from "@/components/nodes/LLM/LLMPanel";

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
}

export class LLMNode implements Node {
    static readonly WIDTH = 120;
    static readonly HEIGHT = 80;

    id: string;
    x: number;
    y: number;
    type = "llm";

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
        return <LLMPanel />;
    }
}

export class ConsoleNode implements Node {
    static readonly SIZE = 150;

    id: string;
    x: number;
    y: number;
    type = "console";

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
        return <ConsolePanel />;
    }
}
