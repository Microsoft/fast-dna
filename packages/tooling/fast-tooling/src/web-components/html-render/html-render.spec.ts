import { customElement, DOM, html } from "@microsoft/fast-element";
import { fixture } from "@microsoft/fast-foundation/dist/esm/fixture";
import { expect } from "chai";
import {
    MessageSystem,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
} from "../../message-system";
import dataDictionaryConfig from "../../__test__/html-render/data-dictionary-config";
import schemaDictionary from "../../__test__/html-render/schema-dictionary";
import { nativeElementDefinitions } from "../../definitions";
import { ActivityType, HTMLRenderLayer } from "../html-render-layer/html-render-layer";
import { HTMLRender } from "./html-render";

HTMLRender;
HTMLRenderLayer;

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTMessageSystemWorker = require("../../../message-system.min.js");

const fastMessageSystemWorker = new FASTMessageSystemWorker();

class ActivityResult {
    public activityType: ActivityType;
    public datadictionaryid: string;
    constructor(activity: ActivityType, dataid: string) {
        this.activityType = activity;
        this.datadictionaryid = dataid;
    }
}

export const HTMLRenderLayerNavigationTemplate = html<HTMLRenderLayerTest>`
    <div id="testContainer"></div>
`;

@customElement({
    name: "fast-tooling-html-render-layer-test",
    template: HTMLRenderLayerNavigationTemplate,
})
export class HTMLRenderLayerTest extends HTMLRenderLayer {
    public lastActivity: ActivityResult = null;

    public elementActivity(
        activityType: ActivityType,
        datadictionaryid: string,
        elementRef: HTMLElement
    ) {
        this.lastActivity = new ActivityResult(activityType, datadictionaryid);
    }
}

async function setup() {
    const { element, connect, disconnect } = await fixture<HTMLRender>(
        html`
            <fast-tooling-html-render>
                <fast-tooling-html-render-layer-test role="htmlrenderlayer" />
            </fast-tooling-html-render>
        `
    );
    const message = new MessageSystem({
        webWorker: fastMessageSystemWorker,
        dataDictionary: dataDictionaryConfig as any,
        schemaDictionary,
    });
    element.markupDefinitions = Object.values(nativeElementDefinitions);
    element.messageSystem = message;

    return { element, connect, disconnect, message };
}

describe("HTMLRender", () => {
    it("should initialize and render", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await DOM.nextUpdate();

        expect(element.layers).to.not.be.null;
        expect(element.querySelector("[role=htmlrenderlayer]")).to.not.be.null;
        const el = element.shadowRoot?.querySelector("[data-datadictionaryid=root]");
        expect(el).to.not.be.null;

        await disconnect();
    });
    it("should send navigation on click", async () => {
        const { element, connect, disconnect, message } = await setup();
        await connect();
        await DOM.nextUpdate();

        let messageSent: boolean = false;

        message.add({
            onMessage: (e: MessageEvent): void => {
                if (
                    e.data.type === MessageSystemType.navigation &&
                    e.data.action === MessageSystemNavigationTypeAction.update &&
                    e.data.activeNavigationConfigId === "fast-tooling::html-renderer" &&
                    e.data.activeDictionaryId === "root"
                ) {
                    messageSent = true;
                }
            },
        });
        const el = element.shadowRoot?.querySelector("[data-datadictionaryid=root]");
        expect(el).to.not.be.null;
        el.click();
        await DOM.nextUpdate();

        expect(messageSent).to.equal(true);

        await disconnect();
    });
    it("should send navigation on tab", async () => {
        const { element, connect, disconnect, message } = await setup();
        await connect();
        await DOM.nextUpdate();

        let messageSent: string = "";

        message.add({
            onMessage: (e: MessageEvent): void => {
                if (
                    e.data.type === MessageSystemType.navigation &&
                    e.data.action === MessageSystemNavigationTypeAction.update &&
                    e.data.activeNavigationConfigId === "fast-tooling::html-renderer"
                ) {
                    messageSent = e.data.activeDictionaryId;
                }
            },
        });
        const container = element.shadowRoot?.querySelector(".htmlRender");
        expect(container).to.not.be.null;
        container.focus();
        container.dispatchEvent(new KeyboardEvent("keyup", { key: "Tab" }));
        await DOM.nextUpdate();

        expect(messageSent).to.equal("span");
        messageSent = "";

        container.dispatchEvent(new KeyboardEvent("keyup", { key: "Tab" }));
        await DOM.nextUpdate();

        expect(messageSent).to.equal("root");

        container.dispatchEvent(
            new KeyboardEvent("keyup", { key: "Tab", shiftKey: true })
        );
        await DOM.nextUpdate();

        expect(messageSent).to.equal("span");

        container.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
        await DOM.nextUpdate();

        expect(messageSent).to.equal("span");

        container.dispatchEvent(new KeyboardEvent("keyup", { key: "Tab" }));
        await DOM.nextUpdate();
        messageSent = "";
        container.dispatchEvent(new KeyboardEvent("keyup", { key: "Tab" }));
        await DOM.nextUpdate();
        expect(messageSent).to.equal("");

        container.dispatchEvent(
            new KeyboardEvent("keyup", { key: "Tab", shiftKey: true })
        );
        await DOM.nextUpdate();

        expect(messageSent).to.equal("root");

        container.dispatchEvent(new KeyboardEvent("keyup", { key: "a" }));
        await DOM.nextUpdate();

        expect(messageSent).to.equal("root");

        await disconnect();
    });
    it("should send clear navigation on container click", async () => {
        const { element, connect, disconnect, message } = await setup();
        await connect();
        await DOM.nextUpdate();

        let messageSent: boolean = false;

        message.add({
            onMessage: (e: MessageEvent): void => {
                if (
                    e.data.type === MessageSystemType.navigation &&
                    e.data.action === MessageSystemNavigationTypeAction.update &&
                    e.data.activeNavigationConfigId === "fast-tooling::html-renderer" &&
                    e.data.activeDictionaryId === ""
                ) {
                    messageSent = true;
                }
            },
        });
        const container = element.shadowRoot?.querySelector(".htmlRender");
        expect(container).to.not.be.null;
        container.focus();
        container.click();
        await DOM.nextUpdate();

        expect(messageSent).to.equal(true);

        await disconnect();
    });
    it("should send click / clear activity to layers", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await DOM.nextUpdate();

        const el = element.shadowRoot?.querySelector("[data-datadictionaryid=root]");
        expect(el).to.not.be.null;
        el.click();
        await DOM.nextUpdate();

        let activity: ActivityResult = (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity;
        expect(activity).to.not.be.null;
        expect(activity.activityType === ActivityType.click).to.equal(true);
        expect(activity.datadictionaryid).to.equal("root");
        (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity = null;

        const container = element.shadowRoot?.querySelector(".htmlRender");
        expect(container).to.not.be.null;
        container.click();
        await DOM.nextUpdate();

        activity = (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity;
        expect(activity).to.not.be.null;
        expect(activity.activityType === ActivityType.clear).to.equal(true);
        expect(activity.datadictionaryid).to.equal("");
        (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity = null;

        await disconnect();
    });
    it("should send hover / blur activity to layers", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await DOM.nextUpdate();

        const el = element.shadowRoot?.querySelector("[data-datadictionaryid=root]");
        expect(el).to.not.be.null;
        element.hoverHandler({
            composedPath: () => {
                return [el];
            },
        });
        await DOM.nextUpdate();

        let activity: ActivityResult = (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity;
        expect(activity).to.not.be.null;
        expect(activity.activityType === ActivityType.hover).to.equal(true);
        expect(activity.datadictionaryid).to.equal("root");
        (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity = null;

        element.blurHandler({});
        await DOM.nextUpdate();

        activity = (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity;
        expect(activity).to.not.be.null;
        expect(activity.activityType === ActivityType.blur).to.equal(true);
        expect(activity.datadictionaryid).to.equal("");
        (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity = null;

        await disconnect();
    });
    it("should not send hover activity on clicked elements to layers", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await DOM.nextUpdate();

        const el = element.shadowRoot?.querySelector("[data-datadictionaryid=root]");
        expect(el).to.not.be.null;
        el.click();
        await DOM.nextUpdate();

        element.hoverHandler({
            composedPath: () => {
                return [el];
            },
        });
        await DOM.nextUpdate();
        const activity: ActivityResult = (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity;
        expect(activity).to.not.be.null;
        expect(activity.activityType === ActivityType.click).to.equal(true);
        expect(activity.datadictionaryid).to.equal("root");

        await disconnect();
    });
    it("should send click activity to layers when nagivation message recieved", async () => {
        const { element, connect, disconnect, message } = await setup();
        await connect();
        await DOM.nextUpdate();

        message.postMessage({
            type: MessageSystemType.navigation,
            action: MessageSystemNavigationTypeAction.update,
            activeDictionaryId: "root",
            activeNavigationConfigId: "foo",
        });

        await DOM.nextUpdate();
        const activity: ActivityResult = (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity;
        expect(activity).to.not.be.null;
        expect(activity.activityType === ActivityType.click).to.equal(true);
        expect(activity.datadictionaryid).to.equal("root");
        (element.querySelector(
            "[role=htmlrenderlayer]"
        ) as HTMLRenderLayerTest).lastActivity = null;

        await disconnect();
    });
});
