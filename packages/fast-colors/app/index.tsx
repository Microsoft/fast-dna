import React from "react";
import ReactDOM from "react-dom";
import PaletteEditor from "./src/PaletteEditor";

const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render(): void {
    ReactDOM.render(<PaletteEditor />, root);
}

render();
