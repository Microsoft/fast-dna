import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { SelectPosition } from "@microsoft/fast-foundation/dist/esm/select/select.options";

export const fastSelectDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-select",
            title: "Select",
            description: "The FAST select element",
            attributes: [
                {
                    name: "disabled",
                    description: "The disabled attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "name",
                    description: "The name attribute",
                    type: DataType.string,
                    default: "",
                    required: false,
                },
                {
                    name: "position",
                    description: "The position attribute",
                    default: undefined,
                    required: false,
                    type: DataType.string,
                    values: Object.keys(SelectPosition).map(x => ({ name: x })),
                },
            ],
            slots: [
                {
                    name: "",
                    description: "Default slot",
                },
                {
                    name: "button-container",
                    description: "Button container slot",
                },
                {
                    name: "selected-value",
                    description: "Selected value slot",
                },
                {
                    name: "indicator",
                    description: "Indicator slot",
                },
            ],
        },
    ],
};
