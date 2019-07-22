import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { ProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { accentFillRest, neutralFillRest } from "../utilities/color";
import { toPx } from "@microsoft/fast-jss-utilities";
import { designUnit } from "../utilities/design-system";

const styles: ComponentStyles<ProgressClassNameContract, DesignSystem> = {
    progress: {
        display: "flex",
        width: "100%",
        alignItems: "center",
        height: toPx<DesignSystem>(designUnit),
        textAlign: "left",
    },
    progressCircular: {
        height: "unset",
    },
    progress_valueIndicator: {
        background: accentFillRest,
        borderRadius: "100px",
        height: "100%",
        transition: "all 0.2s ease-in-out",
        "@media (-ms-high-contrast:active)": {
            background: "ButtonText",
        },
    },
    progressCircular_valueIndicator: {
        fill: "none",
        stroke: accentFillRest,
        strokeWidth: "2px",
        strokeLinecap: "round",
        transformOrigin: "50% 50%",
        transform: "rotate(-90deg)",
        transition: "all 0.2s ease-in-out",
        "@media (-ms-high-contrast:active)": {
            stroke: "ButtonText",
        },
    },
    progressCircular_valueIndicator__indeterminate: {
        animation: "spin-infinite 2s linear infinite",
    },
    progress_indicator: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
        overflow: "hidden",
        borderRadius: "100px",
        height: toPx<DesignSystem>(designUnit),
        background: neutralFillRest,
        transition: "all 0.2s ease-in-out",
        maskImage: "-webkit-radial-gradient(white, black)",
    },
    progressCircular_indicator: {
        fill: "none",
        stroke: neutralFillRest,
        strokeWidth: "2px",
        strokeLinecap: "round",
        transformOrigin: "50% 50%",
        transform: "rotate(-90deg)",
        transition: "all 0.2s ease-in-out",
    },
    progress_indicator__determinate: {
        height: toPx<DesignSystem>(designUnit),
        borderRadius: "2px",
        "@media (-ms-high-contrast:active)": {
            background: "ButtonShadow",
        },
    },
    progress_dot: {
        position: "absolute",
        opacity: "0",
        height: "100%",
        backgroundColor: accentFillRest,
        borderRadius: "100px",
        animationTimingFunction: "cubic-bezier(0.4, 0.0, 0.6, 1.0)",
        "@media (-ms-high-contrast:active)": {
            background: "ButtonShadow",
            opacity: "1 !important",
        },
    },
    progress_dot__1: {
        width: "40%",
        transform: "translateX(-100%)",
        animation: "indeterminate-1 2s infinite",
    },
    progress_dot__2: {
        width: "60%",
        transform: "translateX(-150%)",
        animation: "indeterminate-2 2s infinite",
    },
    "@keyframes spin-infinite": {
        "0%": {
            strokeDasharray: "0.01px 43.97px",
            transform: "rotate(0deg)",
        },
        "50%": {
            strokeDasharray: "21.99px 21.99px",
            transform: "rotate(450deg)",
        },
        "100%": {
            strokeDasharray: ".01px 43.97px",
            transform: "rotate(1080deg)",
        }
    },
    "@keyframes indeterminate-1": {
        "0%": {
            opacity: "1",
            transform: "translateX(-100%)",
        },
        "70%": {
            opacity: "1",
            transform: "translateX(300%)",
        },
        "70.01%": {
            opacity: "0",
        },
        "100%": {
            opacity: "0",
            transform: "translateX(300%)",
        },
    },
    "@keyframes indeterminate-2": {
        "0%": {
            opacity: "0",
            transform: "translateX(-150%)",
        },
        "29.99%": {
            opacity: "0",
        },
        "30%": {
            opacity: "1",
            transform: "translateX(-150%)",
        },
        "100%": {
            transform: "translateX(166.66%)",
            opacity: "1",
        },
    },
};

export default styles;
