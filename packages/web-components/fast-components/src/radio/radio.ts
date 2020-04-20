import { attr, observable } from "@microsoft/fast-element";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeSpace,
} from "@microsoft/fast-web-utilities";
import { FormAssociated } from "../form-associated";
import { FASTRadio } from ".";

const radioGroups = new Map<string, Set<FASTRadio>>();

export class Radio extends FormAssociated<HTMLInputElement> {
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean; // Map to proxy element
    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.readOnly = this.readOnly;
        }

        this.readOnly
            ? this.classList.add("readonly")
            : this.classList.remove("readonly");
    }

    @attr
    public name: string; // Map to proxy element
    protected nameChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.name = this.name;
        }
    }

    /**
     * The element's value to be included in form submission when checked.
     * Default to "on" to reach parity with input[type="radio"]
     */
    public value: string = "on"; // Map to proxy element.
    private valueChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = this.value;
        }
    }

    /**
     * Provides the default checkedness of the input element
     * Passed down to proxy
     */
    @attr({ attribute: "checked", mode: "boolean" })
    public checkedAttribute: boolean;
    private checkedAttributeChanged(): void {
        this.defaultChecked = this.checkedAttribute;
    }

    /**
     * Initialized to the value of the checked attribute. Can be changed independently of the "checked" attribute,
     * but changing the "checked" attribute always additionally sets this value.
     */
    @observable
    public defaultChecked: boolean = !!this.checkedAttribute;
    private defaultCheckedChanged(): void {
        if (!this.dirtyChecked) {
            // Setting this.checked will cause us to enter a dirty state,
            // but if we are clean when defaultChecked is changed, we want to stay
            // in a clean state, so reset this.dirtyChecked
            this.checked = this.defaultChecked;
            this.dirtyChecked = false;
        }
    }

    /**
     * The checked state of the control
     */
    @observable
    public checked: boolean = this.defaultChecked;
    private checkedChanged(): void {
        if (!this.dirtyChecked) {
            this.dirtyChecked = true;
        }

        if (this.proxy instanceof HTMLElement) {
            this.proxy.checked = this.checked;
        }
        //this.updateForm();

        this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true }));

        this.checked ? this.classList.add("checked") : this.classList.remove("checked");
        this.checkedAttribute = this.checked;

        if (this.checked) {
            this.updateOtherGroupRadios();
        }
    }

    private updateOtherGroupRadios(): void {
        if (this.name !== undefined && this.parentNode) {
            const radioGroup = radioGroups.get(this.name);
            radioGroup?.forEach((radio: FASTRadio) => {
                if (radio.getAttribute("value") !== this.value) {
                    radio.removeAttribute("checked");
                    radio.checked = false;
                }
            });
        }
    }

    protected proxy: HTMLInputElement = document.createElement("input");

    /**
     * Tracks whether the "checked" property has been changed.
     * This is necessary to provide consistent behavior with
     * normal input radios
     */
    // TODO: marjon check if this is needed for radio buttons?
    private dirtyChecked: boolean = false;

    constructor() {
        super();
        this.proxy.setAttribute("type", "radio");
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.updateForm();
        if (this.name !== undefined) {
            const radioGroup = radioGroups.get(this.name);
            if (radioGroup) {
                radioGroup.add(this);
            } else {
                const newSet = new Set<FASTRadio>();
                newSet.add(this);
                radioGroups.set(this.name, newSet);
            }
        }
    }

    public disconnectedCallback(): void {
        if (this.name !== undefined) {
            const groupSet = radioGroups.get(this.name);
            if (groupSet) {
                groupSet.delete(this);
            }

            if (groupSet?.size === 0) {
                radioGroups.delete(this.name);
            }
        }
        console.log("global radioGroups is now:", radioGroups);
    }

    private updateForm(): void {
        const value = this.checked ? this.value : null;
        this.setFormValue(value, value);
    }

    public keypressHandler = (e: KeyboardEvent): void => {
        super.keypressHandler(e);

        switch (e.keyCode) {
            case keyCodeSpace:
                this.checked = !this.checked;
                break;
            case keyCodeArrowRight:
            case keyCodeArrowUp:
                // TODO: select the radio to the right and mark it checked
                break;
            case keyCodeArrowLeft:
            case keyCodeArrowDown:
                // TODO: select the radio to the left and mark it checked if it exists
                break;
        }
    };

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public clickHandler = (e: MouseEvent): void => {
        if (!this.disabled && !this.readOnly) {
            this.checked = !this.checked;
        }
    };
}
