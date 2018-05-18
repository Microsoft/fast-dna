import { toPx } from "@microsoft/fast-jss-utilities";
import {
    applyInputStyle,
    applyLabelStyle,
    applyWrapperStyle,
    colors,
    darkTheme,
    insetStrongBoxShadow,
    lightTheme
} from "../utilities/form-input.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormItemThemeClassNameContract } from "../class-name-contracts/";

function applyThemeInputBackplateStyle(): ICSSRules<{}> {
    return {
        appearance: "none",
        border: `${toPx(2)} solid transparent`,
        height: toPx(36),
        width: toPx(36),
        "&:checked": {
            borderColor: colors.pink
        }
    };
}

const styles: ComponentStyles<IFormItemThemeClassNameContract, {}> = {
    formItemTheme: {
        ...applyWrapperStyle()
    },
    formItemTheme_label: {
        ...applyLabelStyle()
    },
    formItemTheme_input__light: {
        ...applyThemeInputBackplateStyle(),
        background: lightTheme,
        backgroundColor: colors.white,
        "&:focus": {
            outline: "none",
            boxShadow: `${toPx(0)} ${toPx(0)} ${toPx(0)} ${toPx(2)} ${colors.black}`
        }
    },
    formItemTheme_input__dark: {
        ...applyThemeInputBackplateStyle(),
        background: darkTheme,
        backgroundColor: colors.black,
        "&:focus": {
            outline: "none",
            ...insetStrongBoxShadow(colors.white)
        }
    }
};

export default styles;
