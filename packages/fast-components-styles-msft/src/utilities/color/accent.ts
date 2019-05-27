import { DesignSystem } from "../../design-system";
import { Palette, palette, PaletteType } from "./palette";
import { accent } from "./color-constants";
import { findClosestSwatchIndex, isDarkMode } from "./palette";
import { contrast, Swatch, SwatchResolver } from "./common";
import { clamp, inRange } from "lodash-es";

/**
 * Returns a swatch from the middle of the accent palette
 */
export const accentSwatch: SwatchResolver = (designSystem: DesignSystem): Swatch => {
    const accentPalette: Palette | null = palette(PaletteType.accent)(designSystem);

    return accentPalette === null
        ? accent
        : accentPalette[Math.floor(accentPalette.length / 2)];
};

////////////////////
// Any portion of the code referencing newRecipeOffset is considered experimental
// and will be incorporated permanently or removed upon review. DO NOT use values
// in this range unless you are temporarily evaluation this feature as they will
// no longer produce predictable results once removed.
////////////////////
const newRecipeOffset: number = 100;

/**
 * Returns indexes for accent UI states that are accessible against an input reference color.
 * @param stateDeltas The offsets for each state, which are offsets from the closest accessible color.
 */
export function findAccessibleAccentSwatchIndexes(
    designSystem: DesignSystem,
    contrastTarget: number,
    referenceColor: Swatch,
    stateDeltas: {
        rest: number;
        hover: number;
        active: number;
    }
): {
    rest: number;
    hover: number;
    active: number;
} {
    function largestDelta(a: number, b: number): number {
        return Math.abs(a) > Math.abs(b) ? a : b;
    }
    function adjustDelta(a: number): number {
        if (Math.abs(a) >= newRecipeOffset) {
            return a < 0 ? a + newRecipeOffset : a - newRecipeOffset;
        }
        return a;
    }

    const accentColor: Swatch = accentSwatch(designSystem);
    const accentPalette: Palette = palette(PaletteType.accent)(designSystem);
    const darkTheme: boolean = isDarkMode(designSystem);
    const stateDirection: 1 | -1 = darkTheme ? 1 : -1;
    const accessibleTextDirection: 1 | -1 = darkTheme ? -1 : 1;
    const paletteLength: number = accentPalette.length;
    const maxIndex: number = paletteLength - 1;
    let accessibleAccentIndex: number = findClosestSwatchIndex(
        PaletteType.accent,
        accentColor
    )(designSystem);

    /* Begin new recipe calculations */
    if (stateDeltas.rest >= newRecipeOffset) {
        // Get the furthest distance we need to go from the base accent color
        const accessibilityDelta: number = largestDelta(
            adjustDelta(stateDeltas.rest),
            adjustDelta(stateDeltas.hover)
        );
        let testDirection: number = 1;
        let accessibleLighterOffset: number = 0;

        // Check the furthest distance to the _lighter_ side for contrast requirements
        while (
            inRange(
                accessibleAccentIndex + accessibleLighterOffset + accessibilityDelta,
                0,
                paletteLength
            ) &&
            contrast(
                accentPalette[
                    accessibleAccentIndex + accessibleLighterOffset + accessibilityDelta
                ],
                referenceColor
            ) < contrastTarget &&
            inRange(
                accessibleAccentIndex +
                    accessibleLighterOffset +
                    accessibilityDelta +
                    testDirection,
                0,
                maxIndex
            )
        ) {
            accessibleLighterOffset += testDirection;
        }

        // Check the furthest distance to the _darker_ side for contrast requirements
        testDirection = -1;
        let accessibleDarkerOffset: number = 0;
        while (
            contrast(
                accentPalette[
                    accessibleAccentIndex + accessibleDarkerOffset + accessibilityDelta
                ],
                referenceColor
            ) < contrastTarget &&
            inRange(
                accessibleAccentIndex +
                    accessibleDarkerOffset +
                    accessibilityDelta +
                    testDirection,
                0,
                maxIndex
            )
        ) {
            accessibleDarkerOffset += testDirection;
        }

        // Find the closest offset to the base accent color that meets contrast (lighter or darker)
        const lightContrastValue: number = contrast(
            accentPalette[
                accessibleAccentIndex + accessibleLighterOffset + accessibilityDelta
            ],
            referenceColor
        );
        const darkContrastValue: number = contrast(
            accentPalette[
                accessibleAccentIndex + accessibleDarkerOffset + accessibilityDelta
            ],
            referenceColor
        );
        const accessibleOffset: number =
            lightContrastValue > darkContrastValue
                ? accessibleLighterOffset
                : accessibleDarkerOffset;

        // Return the adjusted indexes
        return {
            rest: clamp(
                accessibleAccentIndex + accessibleOffset + adjustDelta(stateDeltas.rest),
                0,
                maxIndex
            ),
            hover: clamp(
                accessibleAccentIndex + accessibleOffset + adjustDelta(stateDeltas.hover),
                0,
                maxIndex
            ),
            active: clamp(
                accessibleAccentIndex +
                    accessibleOffset +
                    adjustDelta(stateDeltas.active),
                0,
                maxIndex
            ),
        };
    }
    /* End new recipe calculations */

    while (
        inRange(
            accessibleAccentIndex + stateDirection * stateDeltas.hover,
            0,
            paletteLength
        ) &&
        contrast(
            accentPalette[accessibleAccentIndex + stateDirection * stateDeltas.hover],
            referenceColor
        ) < contrastTarget &&
        inRange(accessibleAccentIndex + accessibleTextDirection, 0, maxIndex)
    ) {
        accessibleAccentIndex += accessibleTextDirection;
    }

    return {
        rest: clamp(
            accessibleAccentIndex + stateDirection * stateDeltas.rest,
            0,
            maxIndex
        ),
        hover: clamp(
            accessibleAccentIndex + stateDirection * stateDeltas.hover,
            0,
            maxIndex
        ),
        active: clamp(
            accessibleAccentIndex + stateDirection * stateDeltas.active,
            0,
            maxIndex
        ),
    };
}
