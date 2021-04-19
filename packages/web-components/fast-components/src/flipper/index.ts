import { Flipper, FlipperTemplate as template } from "@microsoft/fast-foundation";
import { FlipperStyles as styles } from "./flipper.styles";

/**
 * The FAST Flipper Element. Implements {@link @microsoft/fast-foundation#Flipper},
 * {@link @microsoft/fast-foundation#FlipperTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-flipper\>
 */
export const fastFlipper = Flipper.compose({
    baseName: "flipper",
    template,
    styles,
});

/**
 * Styles for Flipper
 * @public
 */
export const FlipperStyles = styles;
