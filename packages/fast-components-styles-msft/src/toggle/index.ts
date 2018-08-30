import designSystemDefaults, { IDesignSystem, safeDesignSystem } from "../design-system";
import { ensureNormalContrast } from "../utilities/colors";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { applyLocalizedProperty, Direction, ensureContrast, toPx } from "@microsoft/fast-jss-utilities";
import { typeRamp } from "../utilities/typography";
import { IToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Chroma from "chroma-js";

/* tslint:disable-next-line */
const styles: ComponentStyles<IToggleClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<IToggleClassNameContract, IDesignSystem> => {
    const designSystem: IDesignSystem = safeDesignSystem(config);
    const backgroundColor: string = ensureNormalContrast(config.contrast, designSystem.backgroundColor, designSystem.foregroundColor);
    const brandColor: string = ensureNormalContrast(config.contrast, designSystem.brandColor, designSystem.backgroundColor);
    const foregroundColor: string = ensureNormalContrast(config.contrast, designSystem.foregroundColor, designSystem.backgroundColor);
    const direction: Direction = designSystem.direction;

    return {
        toggle: {
            display: "inline-block",
            color: foregroundColor,
            "& span": {
                userSelect: "none",
                marginTop: "0",
                paddingBottom: "0" },
            "&[aria-disabled=\"true\"]": {
                color: Chroma(foregroundColor).alpha(0.5).css()
            }
        },
        toggle_label: {
            display: "inline-block",
            fontSize: toPx(typeRamp.t8.vp3.fontSize),
            lineHeight: toPx(typeRamp.t8.vp3.lineHeight),
            foreground: foregroundColor,
            paddingBottom: "7px",
            float: applyLocalizedProperty("left", "right", direction),
            clear: applyLocalizedProperty("left", "right", direction),
            "& + div": {
                marginTop: "0",
                float: applyLocalizedProperty("left", "right", direction),
                clear: applyLocalizedProperty("left", "right", direction),
                "& + span": {
                    float: applyLocalizedProperty("left", "right", direction),
                    [applyLocalizedProperty("margin-left", "margin-right", direction)]: "5px",
                }
            }
        },
        toggle_wrapper: {
            position: "relative"
        },
        toggle_button: {
            position: "absolute",
            pointerEvents: "none",
            foreground: foregroundColor,
            top: "5px",
            left: "5px",
            transition: "all .1s ease",
            backgroundColor,
            borderRadius: "10px",
            width: "10px",
            height: "10px"
        },
        toggle_input: {
            position: "relative",
            margin: "0",
            width: "44px",
            height: "20px",
            background: backgroundColor,
            border: "1px solid",
            borderColor: foregroundColor,
            borderRadius: "20px",
            appearance: "none",
            cursor: "pointer",
            "@media screen and (-ms-high-contrast:active)": {
                "&::after, &:checked + span": {
                    background: backgroundColor
                },
            },
            "@media screen and (-ms-high-contrast:black-on-white)": {
                "&::after, &:checked + span": {
                    background: foregroundColor
                }
            },
            "&:checked": {
                backgroundColor: brandColor,
                borderColor: brandColor,
                "&:focus": {
                    borderColor: brandColor
                },
                "& + span": {
                    left: "28px",
                    backgroundColor
                },
                "&:disabled": {
                    cursor: "not-allowed",
                    background: Chroma.mix(foregroundColor, backgroundColor, 0.8).css(),
                    borderColor: "transparent",
                    "& + span": {
                        background: backgroundColor
                    },
                    "&:hover": {
                        borderColor: "transparent"
                    }
                }
            },
            "&:not(:checked)": {
                borderColor: foregroundColor,
                "& + span": {
                    backgroundColor: foregroundColor
                },
                "&:disabled": {
                    cursor: "not-allowed",
                    borderColor: Chroma(foregroundColor).alpha(0.2).css(),
                    "& + span": {
                        backgroundColor: Chroma(foregroundColor).alpha(0.2).css()
                    }
                }
            },
            "&:focus": {
                outline: "0"
            }
        }
    };
};

export default styles;
