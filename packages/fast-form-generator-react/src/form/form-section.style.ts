import { toPx } from "@microsoft/fast-jss-utilities";
import {
    applyCleanListStyle,
    applyLabelStyle,
    applyListItemStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
    applyWrapperStyle
} from "../utilities/form-input.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormSectionClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormSectionClassNameContract, {}> = {
    formSection: {
        display: "block"
    },
    formSection_menu: {
        ...applyCleanListStyle(),
        ...applyListItemStyle()
    },
    formSection_toggleWrapper: {
        display: "flex",
        alignItems: "baseline",
        "& label": {
            flexGrow: "1",
            padding: toPx(12)
        }
    },
    formSection_toggle: {
        borderRadius: toPx(20),
        width: toPx(44),
        height: toPx(20),
        lineHeight: toPx(16),
        fontSize: toPx(14),
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        border: `${toPx(1)} solid #8A8A8A`,
        position: "relative",
        float: "right",
        marginLeft: toPx(8),
        "& > span": {
            position: "absolute",
            background: "black",
            borderRadius: toPx(10),
            content: "''",
            height: toPx(10),
            left: toPx(5),
            pointerEvents: "none",
            top: toPx(4),
            transition: "all .1s ease",
            width: toPx(10)
        },
        "&[aria-pressed='true']": {
            backgroundColor: "#0078D7",
            "& > span": {
                left: toPx(28),
                background: "white",
            }
        },
        "&:focus": {
            outline: "none"
        },
        "& + span": {
            float: "right"
        }
    },
    formSection_selectWrapper: {
        ...applyWrapperStyle(),
        borderBottom: `${toPx(1)} solid rgba(0,0,0,.2)`,
        paddingBottom: toPx(12),
        marginBottom: toPx(4)
    },
    formSection_selectSpan: {
        ...applySelectSpanStyles()
    },
    formSection_selectInput: {
        ...applySelectInputStyles()
    },
    formSection_selectLabel: {
        ...applyLabelStyle()
    }
};

export default styles;
