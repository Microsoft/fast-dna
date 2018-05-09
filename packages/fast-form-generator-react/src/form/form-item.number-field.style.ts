import { Direction, ellipsis, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import { applyInputStyle, applyLabelStyle, applyWrapperStyle } from "../utilities/form-input.shared-style.style";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { IFormItemNumberFieldClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemNumberFieldClassNameContract, {}> = {
    formItemNumberField: {
        ...applyWrapperStyle()
    },
    formItemNumberField_label: {
        ...applyLabelStyle()
    },
    formItemNumberField_input: {
        flexBasis: toPx(50),
        ...applyInputStyle()
    }
};

export default styles;
