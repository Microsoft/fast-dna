import { isDarkMode } from "./palette";
import { ColorRecipe, colorRecipeFactory, Swatch, SwatchResolver } from "./common";
import { DesignSystem } from "../../design-system";

// These literal values are to remove the dependency on neutralForegroundLight and Dark,
// and are very temporary as focus is being updated to contrast-based as well.
export const neutralFocus: ColorRecipe<Swatch> = colorRecipeFactory(
    (designSystem: DesignSystem): Swatch => {
        return isDarkMode(designSystem) ? "#FFFFFF" : "#101010";
    }
);
