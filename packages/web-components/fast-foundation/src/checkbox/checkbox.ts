import { attr, observable } from "@microsoft/fast-element";
import { keyCodeSpace } from "@microsoft/fast-web-utilities";
import { FormAssociated } from "../form-associated/form-associated";

/**
 * A Switch Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#checkbox | ARIA checkbox }.
 *
 * @public
 */
export class Checkbox extends FormAssociated<HTMLInputElement> {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean; // Map to proxy element
    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.readOnly = this.readOnly;
        }
    }

    /**
     * The element's value to be included in form submission when checked.
     * Default to "on" to reach parity with input[type="checkbox"]
     *
     * @internal
     */
    protected initialValue: string = "on"; // Map to proxy element.

    /**
     * Provides the default checkedness of the input element
     * Passed down to proxy
     *
     * @public
     * @remarks
     * HTML Attribute: checked
     */
    @attr({ attribute: "checked", mode: "boolean" })
    public checkedAttribute: boolean;
    private checkedAttributeChanged(): void {
        this.defaultChecked = this.checkedAttribute;
    }

    /**
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * Initialized to the value of the checked attribute. Can be changed independently of the "checked" attribute,
     * but changing the "checked" attribute always additionally sets this value.
     *
     * @public
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
     * The checked state of the control.
     *
     * @public
     */
    @observable
    public checked: boolean = this.defaultChecked;
    private checkedChanged(): void {
        if (!this.dirtyChecked) {
            this.dirtyChecked = true;
        }

        this.updateForm();

        if (this.proxy instanceof HTMLElement) {
            this.proxy.checked = this.checked;
        }

        if (this.constructed) {
            this.$emit("change");
        }

        this.validate();
    }

    protected proxy: HTMLInputElement = document.createElement("input");

    /**
     * The indeterminate state of the control
     */
    @observable
    public indeterminate: boolean = false;

    /**
     * Tracks whether the "checked" property has been changed.
     * This is necessary to provide consistent behavior with
     * normal input checkboxes
     */
    private dirtyChecked: boolean = false;

    /**
     * Set to true when the component has constructed
     */
    private constructed: boolean = false;

    constructor() {
        super();

        this.constructed = true;
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.proxy.setAttribute("type", "checkbox");

        this.updateForm();
    }

    public formResetCallback() {
        this.checked = this.checkedAttribute;
        this.dirtyChecked = false;
    }

    private updateForm(): void {
        const value = this.checked ? this.value : null;
        this.setFormValue(value, value);
    }

    /**
     * @internal
     */
    public keypressHandler = (e: KeyboardEvent): void => {
        super.keypressHandler(e);

        switch (e.keyCode) {
            case keyCodeSpace:
                this.checked = !this.checked;
                break;
        }
    };

    /**
     * @internal
     */
    public clickHandler = (e: MouseEvent): void => {
        if (!this.disabled && !this.readOnly) {
            this.checked = !this.checked;
        }
    };
}
