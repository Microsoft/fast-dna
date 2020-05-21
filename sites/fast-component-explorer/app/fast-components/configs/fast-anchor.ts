import textSchema from "../../utilities/text.schema";
import Guidance from "../../.tmp/anchor/guidance";
import { ComponentViewConfig } from "./data.props";
import { webComponentSchemas } from "..";

export const fastAnchorId = "fast-anchor";
const fastAnchorConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastAnchorId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastAnchorId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot",
                                },
                            ],
                        },
                    },
                    Slot: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Anchor",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastAnchorConfig;
