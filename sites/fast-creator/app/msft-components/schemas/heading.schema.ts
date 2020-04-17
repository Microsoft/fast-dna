import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Heading",
    description: "A heading component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/heading",
    formPluginId: "@microsoft/fast-components-react-msft/heading",
    properties: {
        tag: {
            title: "HTML tag",
            type: "string",
            enum: ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
        },
        size: {
            title: "Size",
            type: "number",
            enum: [1, 2, 3, 4, 5, 6, 7],
        },
        children: {
            ...linkedDataSchema,
            title: "Children",
            formPluginId: "@microsoft/fast-components-react-msft/heading/children",
            examples: ["Lorem ipsum sit amet"],
        },
    },
    required: ["children"],
};
