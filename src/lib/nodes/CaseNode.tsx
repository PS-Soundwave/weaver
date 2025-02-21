import { getNodeThroughConnector, Store } from "@/store/useStore";
import { CasePanel } from "../../components/nodes/Case/CasePanel";
import { Connector, ConnectorPosition, Node } from "../nodes";

export class CaseNode implements Node {
    static readonly WIDTH = 150;
    static readonly HEIGHT = 80;

    id: string;
    x: number;
    y: number;
    type = "case";

    caseKey: string = "";
    valueKey: string = "";
    cases: string[] = [];

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    getConnectors(): Connector[] {
        const connectors: Connector[] = [
            { id: `${this.id}-input`, type: "input" }
        ];

        // Add an output connector for each case
        this.cases.forEach((caseValue) => {
            connectors.push({
                id: `${this.id}-output-${caseValue}`,
                type: "output"
            });
        });

        return connectors;
    }

    getConnectorPositions(
        screenX: number,
        screenY: number
    ): ConnectorPosition[] {
        const positions: ConnectorPosition[] = [];
        const connectors = this.getConnectors();

        // Input connector at the top
        positions.push({
            id: connectors[0].id,
            x: screenX,
            y: screenY - CaseNode.HEIGHT / 2
        });

        // Output connectors evenly spaced at the bottom
        const outputCount = this.cases.length;
        if (outputCount > 0) {
            const spacing = CaseNode.WIDTH / (outputCount + 1);
            this.cases.forEach((_, index) => {
                positions.push({
                    id: connectors[index + 1].id,
                    x: screenX - CaseNode.WIDTH / 2 + spacing * (index + 1),
                    y: screenY + CaseNode.HEIGHT / 2
                });
            });
        }

        return positions;
    }

    getPanelContent(): React.ReactElement {
        return <CasePanel node={this} />;
    }

    call(state: Store, input: string): void {
        try {
            const jsonInput = JSON.parse(input);

            if (!this.caseKey || !this.valueKey) {
                console.warn("Case or value key not set");
                return;
            }

            const caseValue = jsonInput[this.caseKey];
            const outputValue = jsonInput[this.valueKey];

            if (caseValue === undefined) {
                console.warn(`Case key "${this.caseKey}" not found in input`);
                return;
            }

            if (outputValue === undefined) {
                console.warn(`Value key "${this.valueKey}" not found in input`);
                return;
            }

            getNodeThroughConnector(
                state,
                `${this.id}-output-${caseValue}`
            )?.call(state, JSON.stringify(outputValue));
        } catch (e) {
            console.error("Failed to parse JSON input:", e);
        }
    }

    copy(): Node {
        const newNode = new CaseNode(this.id, this.x, this.y);
        newNode.caseKey = this.caseKey;
        newNode.valueKey = this.valueKey;
        newNode.cases = this.cases;
        return newNode;
    }
}
