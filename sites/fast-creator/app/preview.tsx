import React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
import {
    DataDictionary,
    DataMessageOutgoing,
    InitializeMessageOutgoing,
    MessageSystem,
    MessageSystemNavigationTypeAction,
    MessageSystemOutgoing,
    MessageSystemType,
    NavigationMessageOutgoing,
    SchemaDictionary,
} from "@microsoft/fast-tooling";
import { HTMLRenderOriginatorId } from "@microsoft/fast-tooling/dist/esm/web-components/html-render/html-render";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import { ViewerCustomAction } from "@microsoft/fast-tooling-react";
import {
    fastComponentDefinitions,
    nativeElementDefinitions,
} from "@microsoft/site-utilities";
import { Direction } from "@microsoft/fast-web-utilities";
import { HTMLRenderReact } from "./web-components";
import {
    mapFASTComponentsDesignSystem,
    setupFASTComponentDesignSystem,
} from "./configs/library.fast.design-system.mapping";
import { registerFASTComponents } from "./configs/library.fast.registry";
import { designTokensLinkedDataId } from "./creator";

const style: HTMLStyleElement = document.createElement("style");
style.innerText =
    "body, html { width:100%; height:100%; overflow-x:initial; } #root {height:100%} ";
document.head.appendChild(style);
registerFASTComponents();

export const previewReady: string = "PREVIEW::READY";

export interface PreviewState {
    activeDictionaryId: string;
    dataDictionary: DataDictionary<unknown> | void;
    schemaDictionary: SchemaDictionary;
    designSystemDataDictionary: DataDictionary<unknown> | void;
    htmlRenderMessageSystem: MessageSystem;
    htmlRenderReady: boolean;
}

class Preview extends Foundation<{}, {}, PreviewState> {
    private ref: React.RefObject<HTMLDivElement>;
    private renderRef: React.RefObject<HTMLRenderReact>;
    private activeDictionaryItemWrapperRef: React.RefObject<HTMLDivElement>;
    private htmlRenderMessageSystemWorker = new FASTMessageSystemWorker();

    constructor(props: {}) {
        super(props);

        this.ref = React.createRef();
        this.renderRef = React.createRef();
        this.activeDictionaryItemWrapperRef = React.createRef();

        this.state = {
            activeDictionaryId: "",
            dataDictionary: void 0,
            schemaDictionary: {},
            designSystemDataDictionary: void 0,
            htmlRenderMessageSystem: new MessageSystem({
                webWorker: this.htmlRenderMessageSystemWorker,
            }),
            htmlRenderReady: false,
        };

        setupFASTComponentDesignSystem(document.body);

        this.state.htmlRenderMessageSystem.add({
            onMessage: this.handleHtmlMessageSystem,
        });

        window.addEventListener("message", this.handleMessage);
    }

    public render(): React.ReactNode {
        if (this.state.dataDictionary !== undefined) {
            const directionValue: Direction =
                this.state.designSystemDataDictionary &&
                (this.state.designSystemDataDictionary[0][designTokensLinkedDataId]
                    .data as any) &&
                (this.state.designSystemDataDictionary[0][designTokensLinkedDataId]
                    .data as any)["direction"]
                    ? (this.state.designSystemDataDictionary[0][designTokensLinkedDataId]
                          .data as any)["direction"]
                    : Direction.ltr;

            return (
                <React.Fragment>
                    <div className={"preview"} dir={directionValue} ref={this.ref}>
                        <HTMLRenderReact ref={this.renderRef} />
                        <div />
                    </div>
                    <div ref={this.activeDictionaryItemWrapperRef}>
                        <div />
                    </div>
                </React.Fragment>
            );
        }

        return null;
    }

    public componentDidMount(): void {
        window.postMessage(
            {
                type: MessageSystemType.custom,
                action: ViewerCustomAction.call,
                value: previewReady,
            },
            "*"
        );
    }

    /**
     * Sets up the DOM with quick exit cases
     * if another request is performed.
     */
    private attachMappedComponents(): void {
        if (this.renderRef.current !== null && !this.state.htmlRenderReady) {
            (this.renderRef.current
                .renderRef as any).messageSystem = this.state.htmlRenderMessageSystem;
            (this.renderRef.current.renderRef as any).markupDefinitions = {
                ...fastComponentDefinitions,
                ...nativeElementDefinitions,
            };
            this.setState({ htmlRenderReady: true });
        }

        if (this.state.dataDictionary !== undefined && this.renderRef.current !== null) {
            if (
                this.state.designSystemDataDictionary &&
                (this.state.designSystemDataDictionary[0][designTokensLinkedDataId]
                    .data as any)
            ) {
                mapFASTComponentsDesignSystem(
                    document.body,
                    this.state.designSystemDataDictionary[0][designTokensLinkedDataId]
                        .data as any
                );
            }
        }
    }

    private attachComponentsAndInit(): void {
        this.attachMappedComponents();
        if (this.state.dataDictionary !== undefined) {
            this.state.htmlRenderMessageSystem.postMessage({
                type: MessageSystemType.initialize,
                dataDictionary: this.state.dataDictionary,
                schemaDictionary: this.state.schemaDictionary,
            });
            if (this.state.activeDictionaryId) {
                this.state.htmlRenderMessageSystem.postMessage({
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeDictionaryId: this.state.activeDictionaryId,
                    options: {
                        originatorId: "preview",
                    },
                    activeNavigationConfigId: "",
                });
            }
        }
    }

    private handleNavigation(): void {
        if (this.renderRef.current !== null) {
            this.state.htmlRenderMessageSystem.postMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeDictionaryId: this.state.activeDictionaryId,
                options: {
                    originatorId: "preview",
                },
                activeNavigationConfigId: "",
            });
        }
    }

    private updateDOM(messageData: MessageSystemOutgoing): () => void {
        switch (messageData.type) {
            case MessageSystemType.initialize:
            case MessageSystemType.custom:
            case MessageSystemType.data:
                return this.attachComponentsAndInit;
            case MessageSystemType.navigation:
                return this.handleNavigation;
        }
        return this.attachMappedComponents;
    }

    private handleMessage = (message: MessageEvent): void => {
        if (message.origin === location.origin) {
            let messageData: unknown;

            try {
                messageData = JSON.parse(message.data);
            } catch (e) {
                return;
            }

            if (
                messageData !== undefined &&
                (!(messageData as any).options ||
                    ((messageData as any).options as any).originatorId !== "preview")
            ) {
                switch ((messageData as MessageSystemOutgoing).type) {
                    case MessageSystemType.initialize:
                        this.setState(
                            {
                                dataDictionary: (messageData as InitializeMessageOutgoing)
                                    .dataDictionary,
                                schemaDictionary: (messageData as InitializeMessageOutgoing)
                                    .schemaDictionary,
                                activeDictionaryId: (messageData as InitializeMessageOutgoing)
                                    .activeDictionaryId,
                            },
                            this.updateDOM(messageData as MessageSystemOutgoing)
                        );
                        break;
                    case MessageSystemType.data:
                        this.setState(
                            {
                                dataDictionary: (messageData as DataMessageOutgoing)
                                    .dataDictionary,
                            },
                            this.updateDOM(messageData as MessageSystemOutgoing)
                        );
                        break;
                    case MessageSystemType.navigation:
                        if (
                            !(messageData as any).options ||
                            ((messageData as any).options as any).originatorId !==
                                HTMLRenderOriginatorId
                        )
                            this.setState(
                                {
                                    activeDictionaryId: (messageData as NavigationMessageOutgoing)
                                        .activeDictionaryId,
                                },
                                this.updateDOM(messageData as MessageSystemOutgoing)
                            );
                        break;
                    case MessageSystemType.custom:
                        if (
                            (messageData as any).originatorId === designTokensLinkedDataId
                        ) {
                            const updatedDesignSystemDataDictionary: DataDictionary<unknown> =
                                this.state.designSystemDataDictionary &&
                                (this.state.designSystemDataDictionary[0][
                                    designTokensLinkedDataId
                                ].data as any)
                                    ? [
                                          {
                                              [designTokensLinkedDataId]: {
                                                  schemaId: this.state
                                                      .designSystemDataDictionary[0][
                                                      designTokensLinkedDataId
                                                  ].schemaId,
                                                  data: {
                                                      ...(messageData as any).data,
                                                  },
                                              },
                                          },
                                          designTokensLinkedDataId,
                                      ]
                                    : [
                                          {
                                              [designTokensLinkedDataId]: {
                                                  schemaId: "fastDesignTokens",
                                                  data: {
                                                      ...(messageData as any).data,
                                                  },
                                              },
                                          },
                                          designTokensLinkedDataId,
                                      ];

                            this.setState(
                                {
                                    designSystemDataDictionary: updatedDesignSystemDataDictionary,
                                },
                                this.updateDOM(messageData as MessageSystemOutgoing)
                            );
                        }
                        break;
                }
            }
        }
    };

    private handleHtmlMessageSystem = (message: MessageEvent): void => {
        if (message.data) {
            if (
                message.data.type === MessageSystemType.navigation &&
                message.data.action === MessageSystemNavigationTypeAction.update &&
                message.data.options &&
                message.data.options.originatorId === HTMLRenderOriginatorId
            ) {
                this.setState({
                    activeDictionaryId: message.data.activeDictionaryId,
                });
                window.postMessage(
                    {
                        type: MessageSystemType.custom,
                        action: ViewerCustomAction.call,
                        value: message.data.activeDictionaryId,
                    },
                    "*"
                );
            } else if (
                message.data.type === MessageSystemType.data &&
                message.data.action === MessageSystemNavigationTypeAction.update &&
                message.data.options &&
                message.data.options.originatorId === HTMLRenderOriginatorId
            ) {
                window.postMessage(
                    {
                        type: MessageSystemType.custom,
                        action: ViewerCustomAction.call,
                        data: message.data.data,
                    },
                    "*"
                );
            }
        }
    };
}

export default Preview as React.ComponentType;
