import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActive,
    accentFillHover,
    accentForegroundCut,
    bodyFont,
    cornerRadius,
    designUnit,
    disabledOpacity,
    focusOutlineWidth,
    neutralFillHover,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import {
    neutralFocusBehavior,
    neutralFocusInnerAccentBehavior,
    neutralForegroundHoverBehavior,
    neutralForegroundRestBehavior,
    neutralLayerL1Behavior,
} from "../styles/recipes";
import { heightNumber } from "../styles/size";

export const optionStyles = (context, definition) =>
    css`
    ${display("inline-flex")} :host {
        align-items: center;
        font-family: ${bodyFont};
        border-radius: calc(${cornerRadius} * 1px);
        border: calc(${focusOutlineWidth} * 1px) solid transparent;
        box-sizing: border-box;
        color: ${neutralForegroundRestBehavior.var};
        cursor: pointer;
        fill: currentcolor;
        font-size: ${typeRampBaseFontSize};
        height: calc(${heightNumber} * 1px);
        line-height: ${typeRampBaseLineHeight};
        margin: 0 calc(${designUnit} * 1px);
        outline: none;
        overflow: hidden;
        padding: 0 calc(${designUnit} * 2.25px);
        user-select: none;
        white-space: nowrap;
    }

    :host(:${focusVisible}) {
        box-shadow: 0 0 0 calc(${focusOutlineWidth} * 1px) inset ${
        neutralFocusInnerAccentBehavior.var
    };
        border-color: ${neutralFocusBehavior.var};
        background: ${accentFillHover};
        color: ${accentForegroundCut};
    }

    :host([aria-selected="true"]) {
        background: ${accentFillHover};
        color: ${accentForegroundCut};
    }

    :host(:active) {
        background: ${accentFillActive};
        color: ${accentForegroundCut};
    }

    :host(:not([aria-selected="true"]):hover) {
        background: ${neutralFillHover};
        color: ${neutralForegroundHoverBehavior.var};
    }

    :host(:not([aria-selected="true"]):active) {
        background: ${neutralFillHover};
        color: ${neutralForegroundHoverBehavior.var};
    }

    :host([disabled]) {
        cursor: ${disabledCursor};
        opacity: ${disabledOpacity};
    }

    :host([disabled]:hover) {
        background-color: inherit;
    }

    .content {
        grid-column-start: 2;
        justify-self: start;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .start,
    .end,
    ::slotted(svg) {
        display: flex;
    }

    ::slotted(svg) {
        ${
            /* Glyph size and margin-left is temporary - replace when adaptive typography is figured out */ ""
        }
        height: calc(${designUnit} * 4px);
        width: calc(${designUnit} * 4px);
    }

    ::slotted([slot="end"]) {
        margin-inline-start: 1ch;
    }

    ::slotted([slot="start"]) {
        margin-inline-end: 1ch;
    }

`.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${SystemColors.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${SystemColors.Highlight};
                    color: ${SystemColors.HighlightText};
                }

                :host([disabled]),
                :host([disabled]:not([aria-selected="true"]):hover) {
                    background: ${SystemColors.Canvas};
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }
            `
        ),
        neutralFocusBehavior,
        neutralFocusInnerAccentBehavior,
        neutralForegroundHoverBehavior,
        neutralForegroundRestBehavior,
        neutralLayerL1Behavior
    );
