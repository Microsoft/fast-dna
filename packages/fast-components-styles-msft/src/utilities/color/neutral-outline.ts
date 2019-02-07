import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import {
    findClosestSwatchIndex,
    isDarkTheme,
    palette,
    Palette,
    PaletteType,
    Swatch,
} from "./palette";
import {
    ColorRecipe,
    StatefulSwatch,
    StatefulSwatchToColorRecipeFactory,
    SwatchStates,
} from "./common";
import { clamp, memoize } from "lodash-es";

/**
 * Deltas to derive state swatches from the background
 */
export const neutralOutlineDeltaRest: number = 34;
export const neutralOutlineDeltaHover: number = 38;
export const neutralOutlineDeltaActive: number = 42;

const neutralOutlineAlgorithm: (designSystem: DesignSystem) => StatefulSwatch = memoize(
    (designSystem: DesignSystem): StatefulSwatch => {
        const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
        const backgroundIndex: number = findClosestSwatchIndex(
            PaletteType.neutral,
            designSystem.backgroundColor
        )(designSystem);
        const direction: 1 | -1 = isDarkTheme(designSystem) ? -1 : 1;
        const maxIndex: number = neutralPalette.length - 1;
        const restIndex: number = clamp(
            backgroundIndex + direction * neutralOutlineDeltaRest,
            0,
            maxIndex
        );
        const hoverIndex: number = clamp(
            backgroundIndex + direction * neutralOutlineDeltaHover,
            0,
            maxIndex
        );
        const activeIndex: number = clamp(
            backgroundIndex + direction * neutralOutlineDeltaActive,
            0,
            maxIndex
        );

        return {
            rest: neutralPalette[restIndex],
            hover: neutralPalette[hoverIndex],
            active: neutralPalette[activeIndex],
        };
    },
    (designSystem: DesignSystem): string => {
        return designSystem.backgroundColor;
    }
);

export function neutralOutline(designSystem: DesignSystem): StatefulSwatch;
export function neutralOutline(
    backgroundResolver: (designSystem: DesignSystem) => Swatch
): (designSystem: DesignSystem) => StatefulSwatch;
export function neutralOutline(arg: any): any {
    if (typeof arg === "function") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): StatefulSwatch => {
                return neutralOutlineAlgorithm(
                    Object.assign({}, designSystem, {
                        backgroundColor: arg(designSystem),
                    })
                );
            }
        );
    } else {
        return neutralOutlineAlgorithm(withDesignSystemDefaults(arg));
    }
}

export const neutralOutlineRest: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.rest,
    neutralOutline
);
export const neutralOutlineHover: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.hover,
    neutralOutline
);
export const neutralOutlineActive: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.active,
    neutralOutline
);
