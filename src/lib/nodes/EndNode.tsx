import { Store } from "@/store/useStore";
import { EndPanel } from "../../components/nodes/End/EndPanel";
import { Connector, ConnectorPosition, Node } from "../nodes";

export class EndNode implements Node {
    static readonly WIDTH = 120;
    static readonly HEIGHT = 80;

    id: string;
    x: number;
    y: number;
    type = "end";
    lastValue = "";

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    getConnectors(): Connector[] {
        return [{ id: `${this.id}-input`, type: "input" }];
    }

    getConnectorPositions(
        screenX: number,
        screenY: number
    ): ConnectorPosition[] {
        return [
            {
                id: `${this.id}-input`,
                x: screenX - EndNode.WIDTH / 2,
                y: screenY
            }
        ];
    }

    getPanelContent(): React.ReactElement {
        return <EndPanel node={this} />;
    }

    call(_state: Store, value: string) {
        this.lastValue = value;
        _state.updateNode(this);
    }

    copy(): Node {
        const newNode = new EndNode(this.id, this.x, this.y);
        newNode.lastValue = this.lastValue;
        return newNode;
    }
}
