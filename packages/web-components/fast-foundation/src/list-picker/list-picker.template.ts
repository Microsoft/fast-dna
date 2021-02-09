import {
    children,
    elements,
    html,
    ref,
    slotted,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import { ListPicker } from "./list-picker";

/**
 * The template for the List Picker component.
 * @public
 */
export function createListPickerTemplate(
    prefix: string,
    itemTemplate: ViewTemplate,
    optionTemplate: ViewTemplate
): ViewTemplate {
    return html<ListPicker>`
        <template
            role="list"
            :defaultItemTemplate=${itemTemplate}
            :defaultOptionTemplate=${optionTemplate}
        >
            <slot></slot>
            <slot name="input-region">
                <input
                    class="selected-value"
                    part="selected-value"
                    role="combobox"
                    type="text"
                    autocapitalize="off"
                    autocomplete="off"
                    aria-autocomplete="both"
                    @keydown="${(x, c) => x.handleInputKeyDown(c.event as KeyboardEvent)}"
                    @input="${(x, c) => x.handleTextInput(c.event as InputEvent)}"
                    @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
                    aria-activedescendant="${x => x.listboxFocusOptionId}"
                    aria-owns="${x => (x.listboxOpen ? x.listboxId : null)}"
                    aria-expanded="${x => x.listboxOpen}"
                    aria-haspopup="true"
                    aria-label="TODO"
                    ${ref("inputBox")}
                />
            </slot>
            ${when(
                x => x.listboxOpen,
                html<ListPicker>`
                <${prefix}-anchored-region
                    fixed-placement="true"
                    vertical-positioning-mode="dynamic"
                    vertical-scaling="content"
                    vertical-inset="false"
                    horizontal-positioning-mode="dynamic"
                    horizontal-scaling="anchor"
                    horizontal-inset="true"
                    @loaded="${(x, c) => x.handleRegionLoaded(c.event as Event)}"
                    ${ref("region")}
                >
                    <${prefix}-list-picker-menu
                        id="${x => x.listboxId}"
                        role="list"
                        part="listbox"
                        ${ref("listbox")}
                        ${children({
                            property: "optionElements",
                            filter: elements("[role=listitem]"),
                        })}
                    >
                        <slot
                            name="header-region"
                        ></slot>
                        <slot 
                            name="footer-region"
                        ></slot>
                    </${prefix}-list-picker-menu>
                </${prefix}-anchored-region>
            `
            )}
        </template>
    `;
}
