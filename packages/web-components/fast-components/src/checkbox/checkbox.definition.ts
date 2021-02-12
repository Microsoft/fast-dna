import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastCheckboxDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-checkbox",
            title: "Checkbox",
            description: "The FAST checkbox element",
            attributes: [
                {
                    name: "checked",
                    description: "The checked attribute",
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
                    name: "required",
                    description: "The required attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "disabled",
                    description: "The disabled attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "readonly",
                    description: "The readonly attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    description: "Default slot",
                },
                {
                    name: "indeterminate-indicator",
                    description: "Indeterminate indicator slot",
                },
                {
                    name: "checked-indicator",
                    description: "Checked indicator slot",
                },
            ],
        },
    ],
};
