import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { focusOutlineWidth, outlineWidth } from "./design-system";

export const highContrastSelector: string = "@media (-ms-high-contrast:active)";

export enum HighContrastColor {
    text = "WindowText",
    hyperLinks = "LinkText",
    disabledText = "GrayText !important",
    selectedText = "HighlightText",
    selectedBackground = "Highlight",
    buttonText = "ButtonText",
    buttonBackground = "ButtonFace",
    background = "Background",
}

function ImportantColor(color: HighContrastColor): string {
    return color + "!important";
}

// Used to remove text backplate and borders in 'button-text' colors
export const highContrastStealth: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        border: "none",
        color: HighContrastColor.buttonText,
        fill: HighContrastColor.buttonText,
        "-ms-high-contrast-adjust": "none",
    },
};

// Used to remove text backplate in 'button-text' and 'button-background' colors
export const highContrastOutline: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        "border-color": HighContrastColor.buttonText,
        color: HighContrastColor.buttonText,
        fill: HighContrastColor.buttonText,
        "-ms-high-contrast-adjust": "none",
    },
};

// Used to remove text backplate in 'select-text' and 'selected-background' colors
export const highContrastAccent: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedBackground,
        "border-color": HighContrastColor.selectedBackground,
        color: HighContrastColor.selectedText,
        fill: HighContrastColor.selectedText,
        "-ms-high-contrast-adjust": "none",
    },
};

// Used to set a borderless component to disabled color
export const highContrastDisabled: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: HighContrastColor.background,
        color: HighContrastColor.disabledText,
        fill: HighContrastColor.disabledText,
    },
};

// Used to set a components with border to disabled color
export const highContrastDisabledBorder: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: ImportantColor(HighContrastColor.buttonBackground),
        "border-color": HighContrastColor.disabledText,
        color: HighContrastColor.disabledText,
        fill: HighContrastColor.disabledText,
    },
};

// Used to set foreground to disabled color
export const highContrastDisabledForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        color: HighContrastColor.disabledText,
        fill: HighContrastColor.disabledText,
    },
};

// Used to set focus with keyboard focus
export const highContrastOutlineFocus: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        "border-color": HighContrastColor.buttonText,
        "box-shadow": format(
            "0 0 0 {0} inset {1}",
            toPx(outlineWidth),
            () => HighContrastColor.buttonText
        ),
    },
};

// Used to set double focus with keyboard focus
export const highContrastDoubleFocus: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        "border-color": ImportantColor(HighContrastColor.buttonText),
        "box-shadow": format(
            "0 0 0 {0} inset {1}",
            toPx(focusOutlineWidth),
            () => HighContrastColor.buttonBackground
        ),
    },
};

// Used to set 'selected-text' color
export const highContrastSelected: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedBackground,
        color: HighContrastColor.selectedText,
        fill: HighContrastColor.selectedText,
    },
};

// Used to set 'selected-background' color with an outline
export const highContrastSelectedOutline: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedText,
        "border-color": HighContrastColor.selectedBackground,
        color: HighContrastColor.selectedBackground,
        fill: HighContrastColor.selectedBackground,
    },
};

// Used to set foreground and glyph to be 'button-text' color
export const highContrastForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: ImportantColor(HighContrastColor.buttonText),
        fill: ImportantColor(HighContrastColor.buttonText),
    },
};

// Used to set foreground and glyph to be 'select-text' color
export const highContrastSelectedForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: ImportantColor(HighContrastColor.selectedText),
        fill: ImportantColor(HighContrastColor.selectedText),
    },
};

// Used to set foreground and glyph to be 'highlight' color
export const highContrastHighlightForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: ImportantColor(HighContrastColor.selectedBackground),
        fill: ImportantColor(HighContrastColor.selectedBackground),
    },
};

// Used to set borders to be 'text' color
export const highContrastBorder: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            () => HighContrastColor.text
        ),
    },
};

// Used to set border color to be 'button-text' color
export const highContrastBorderColor: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        "border-color": HighContrastColor.buttonText,
    },
};

// Used to set background to be 'button-text' color
export const highContrastBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonText,
    },
};

// Used to set background to be 'selected-text' color
export const highContrastSelectionBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedText,
    },
};

// Used to set background to be 'highlight' color
export const highContrastHighlightBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedBackground,
    },
};
