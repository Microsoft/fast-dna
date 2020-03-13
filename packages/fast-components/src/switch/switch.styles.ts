import { css } from "@microsoft/fast-element";
import { disabledCursor } from "../styles";

export const SwitchStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        position: relative;
        display: inline-flex;
        align-items: center;
        outline: none;
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .switch,
    :host(.disabled) .switch {
        cursor: ${disabledCursor};
    }

    .switch {
        position: relative;
        outline: none;
        width: calc(var(--height-number) * 2px);
        height: calc(var(--height-number) * 1px);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--height-number) * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
    }

    .switch:hover {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }

    .switch:active {
        background: var(--neutral-fill-input-active);
        border-color: var(--neutral-outline-active);
    }

    :host(:focus) .switch {
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
        border-color: var(--neutral-focus);
    }

    .status-indicator {
        position: absolute;
        height: calc((var(--height-number) - (var(--design-unit) * 2)) * 1px);
        width: calc((var(--height-number) - (var(--design-unit) * 2)) * 1px);
        top: calc(var(--design-unit) * 1px);
        left: calc(var(--design-unit) * 1px);
        background: var(--neutral-foreground-rest);
        border-radius: 50%;
        transition: all 0.2s ease-in-out;
    }

    .label .status-maessage {
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        ${/* Font size is temporary - replace when adaptive typography is figured out */ ""} font-size: calc(1rem + (var(--density) * 2px));
    }

    .label {
        ${/* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast-dna/issues/2766 */ ""} margin-inline-end: calc(var(--design-unit) * 2px + 2px);
    }

    ::slotted(.content) {
        ${/* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast-dna/issues/2766 */ ""} margin-inline-start: calc(var(--design-unit) * 2px + 2px);
    }

    :host(.checked) .status-indicator {
        left: calc((var(--height-number) + var(--design-unit)) * 1px);
        background: var(--accent-foreground-cut-rest);
    }

    :host(.checked) .switch {
        background: var(--accent-fill-rest);
    }

    .unchecked-message {
        display: block;
    }

    .checked-message {
        display: none;
    }

    :host(.checked) .unchecked-message {
        display: none;
    }

    :host(.checked) .checked-message {
        display: block;
    }

    .root {
        margin-bottom: auto;
        border-radius: calc(var(--elevated-corner-radius));
        width: var(--dialog-width);
        height: var(--dialog-height);
        background: var(--background-color);
        z-index: 1;
    }
`;
