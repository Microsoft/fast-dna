import {
    neutralFillStealth,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
} from "./neutral-fill-stealth";
import designSystemDefaults, { DesignSystem } from "../../design-system";
import { palette, Palette, PaletteType, Swatch } from "./palette";
import { StatefulSwatch } from "./common";

describe("neutralFillStealth", (): void => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystemDefaults);
    const accentPalette: Palette = palette(PaletteType.accent)(designSystemDefaults);

    test("should opperate on design system defaults", (): void => {
        expect(neutralFillStealthRest({} as DesignSystem)).toBe("#FFFFFF");
        expect(neutralFillStealthHover({} as DesignSystem)).toBe("#F7F7F7");
        expect(neutralFillStealthActive({} as DesignSystem)).toBe("#FBFBFB");
    });

    test("should switch from dark to light after 4 swatches", (): void => {
        expect(neutralFillStealthHover(designSystemDefaults)).toBe("#F7F7F7");
        expect(
            neutralFillStealthHover(() => neutralPalette[1])(designSystemDefaults)
        ).toBe(neutralPalette[3]);
        expect(
            neutralFillStealthHover(() => neutralPalette[2])(designSystemDefaults)
        ).toBe(neutralPalette[4]);
        expect(
            neutralFillStealthHover(() => neutralPalette[3])(designSystemDefaults)
        ).toBe(neutralPalette[5]);
        expect(
            neutralFillStealthHover(() => neutralPalette[4])(designSystemDefaults)
        ).toBe(neutralPalette[2]);
    });

    test("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach(
            (swatch: Swatch): void => {
                expect(neutralFillStealthRest(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillStealthRest(
                        Object.assign({}, designSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                );
                expect(neutralFillStealthHover(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillStealthHover(
                        Object.assign({}, designSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                );
                expect(neutralFillStealthActive(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillStealthActive(
                        Object.assign({}, designSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                );
            }
        );
    });

    test("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach(
            (swatch: Swatch): void => {
                const backplates: StatefulSwatch = neutralFillStealth(() => swatch)(
                    designSystemDefaults
                );
                const rest: Swatch = neutralFillStealthRest(() => swatch)(
                    designSystemDefaults
                );
                const hover: Swatch = neutralFillStealthHover(() => swatch)(
                    designSystemDefaults
                );
                const active: Swatch = neutralFillStealthActive(() => swatch)(
                    designSystemDefaults
                );

                expect(backplates.rest).toBe(rest);
                expect(backplates.hover).toBe(hover);
                expect(backplates.active).toBe(active);
            }
        );
    });
});
