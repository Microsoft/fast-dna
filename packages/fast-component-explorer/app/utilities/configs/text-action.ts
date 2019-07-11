import { ComponentViewConfig } from "./data.props";
import {
    buttonSchema,
    TextAction,
    TextActionAppearance,
    TextActionProps,
    textActionSchema,
} from "@microsoft/fast-components-react-msft";
import glyphSchema from "../components/glyph.schema";
import { Icon } from "../components/glyph";
import Guidance from "../../.tmp/image/guidance";

const textActionConfig: ComponentViewConfig<TextActionProps> = {
    schema: textActionSchema,
    component: TextAction,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                appearance: TextActionAppearance.filled,
                button: {
                    id: buttonSchema.id,
                    props: {
                        children: {
                            id: glyphSchema.id,
                            props: {
                                path: Icon.arrow,
                            },
                        },
                    },
                } as any,
                beforeGlyph: {
                    id: glyphSchema.id,
                    props: {
                        path: Icon.user,
                    },
                } as any,
            },
        },
    ],
};

export default textActionConfig;
