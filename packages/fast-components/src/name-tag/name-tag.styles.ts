import { css } from "@microsoft/fast-element";

export const NameTagStyles = css`
    :host {
        --depth: 4;
        --background-color: #f00;
        --border-radius: 4;

        display: block;
        color: white;
        background: var(--background-color);
        border-radius: var(--border-radius);
        min-width: 325px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 0 calc(var(--depth) * 1px) rgba(0, 0, 0, 0.5);
    }

    .header {
        margin: 16px 0;
        position: relative;
    }

    h3 {
        font-weight: bold;
        font-family: "Source Sans Pro";
        letter-spacing: 4px;
        font-size: 32px;
        margin: 0;
        padding: 0;
    }

    h4 {
        font-family: sans-serif;
        font-size: 18px;
        margin: 0;
        padding: 0;
    }

    .body {
        background: white;
        color: black;
        padding: 32px 8px;
        font-size: 42px;
        font-family: cursive;
    }

    .footer {
        height: 16px;
        background: var(--background-color);
        border-radius: 0 0 var(--border-radius) var(--border-radius);
    }

    ::slotted(img) {
        border-radius: 50%;
        height: 64px;
        width: 64px;
        box-shadow: 0 0 calc(var(--depth) / 2px) rgba(0, 0, 0, 0.5);
        position: absolute;
        left: 16px;
        top: -4px;
    }
`;
