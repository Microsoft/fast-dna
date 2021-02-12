import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { Orientation } from "@microsoft/fast-web-utilities";
import { DataType } from "@microsoft/fast-tooling";

export const fastTabsDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-tabs",
            title: "Tabs",
            description: "The FAST tabs element",
            attributes: [
                {
                    name: "orientation",
                    description: "The orientation attribute",
                    default: Orientation.horizontal,
                    required: false,
                    type: DataType.string,
                    values: [
                        { name: Orientation.horizontal },
                        { name: Orientation.vertical },
                    ],
                },
                {
                    name: "activeid",
                    description: "The activeid attribute",
                    default: undefined,
                    required: false,
                    type: DataType.string,
                },
            ],
            slots: [
                {
                    name: "tab",
                    description: "Tab slot",
                },
                {
                    name: "tabpanel",
                    description: "Tabpanel slot",
                },
                {
                    name: "start",
                    description: "Start slot",
                },
                {
                    name: "end",
                    description: "End slot",
                },
            ],
        },
    ],
};
