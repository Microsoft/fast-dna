import { DesignSystem } from "../design-system";
import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { height } from "../utilities/density";
import { filledInputFieldStyles, inputFieldStyles } from "../patterns/input-field";

const styles: ComponentStyles<TextFieldClassNameContract, DesignSystem> = {
    textField: {
        ...inputFieldStyles(),
        height: height(),
        "@media (-ms-high-contrast:active)": {
            color: "ButtonText"
        }
    },
    textField__filled: {
        ...filledInputFieldStyles(),
    },
};

export default styles;
