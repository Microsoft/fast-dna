import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ellipsis } from "@microsoft/fast-jss-utilities";
import {
    applyControl,
    applyControlRegion,
    applyControlSingleLineWrapper,
    applyFormItemBadge,
    applyInvalidMessage,
    applySoftRemove,
    applySoftRemoveInput,
} from "../../style";
import { FormItemSectionLinkClassNameContract } from "./form-item.section-link.props";

const styles: ComponentStyles<FormItemSectionLinkClassNameContract, {}> = {
    formItemSectionLink: {
        ...applyControlSingleLineWrapper(),
        display: "block",
    },
    formItemSectionLink_anchor: {
        ...ellipsis(),
        width: "calc(100% - 30px)",
        cursor: "pointer",
        fontSize: "12px",
        lineHeight: "23px",
    },
    formItemSectionLink_badge: {
        ...applyFormItemBadge(),
    },
    formItemSectionLink_controlRegion: {
        ...applyControlRegion(),
    },
    formItemSectionLink_invalidMessage: {
        ...applyInvalidMessage(),
    },
    formItemSectionLink_softRemove: {
        ...applySoftRemove(),
    },
    formItemSectionLink_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
