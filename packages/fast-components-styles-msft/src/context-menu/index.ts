import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { ContextMenuClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyCornerRadius } from "../utilities/border";
import { elevation, ElevationMultiplier } from "../utilities/elevation";

const styles: ComponentStyles<ContextMenuClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ContextMenuClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        contextMenu: {
            background: designSystem.backgroundColor,
            ...applyCornerRadius(designSystem, true),
            ...elevation(ElevationMultiplier.e11)(designSystem),
            margin: "0",
            padding: "4px 0",
            maxWidth: "368px",
            minWidth: "64px",
            transition: "all 0.2s ease-in-out",
        },
    };
};

export default styles;
