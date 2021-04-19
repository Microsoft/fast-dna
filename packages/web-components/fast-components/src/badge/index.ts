import { Badge, BadgeTemplate as template } from "@microsoft/fast-foundation";
import { BadgeStyles as styles } from "./badge.styles";

/**
 * The FAST Badge Element. Implements {@link @microsoft/fast-foundation#Badge},
 * {@link @microsoft/fast-foundation#BadgeTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-badge\>
 */
export const fastBadge = Badge.compose({
    baseName: "badge",
    template,
    styles,
});

/**
 * Styles for Badge
 * @public
 */
export const BadgeStyles = styles;
