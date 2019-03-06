import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { SelectClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { SelectHandledProps, SelectProps, SelectUnhandledProps } from "./select.props";
import { ListboxItemProps } from "../listbox-item";
import Listbox from "../listbox";
import Button from "../button";

export interface SelectState {
    value: string;
    displayString: string;
    selectedItems: ListboxItemProps[];
    isMenuOpen: boolean;
}

class Select extends Foundation<SelectHandledProps, SelectUnhandledProps, SelectState> {
    public static displayName: string = "Select";

    public static defaultProps: Partial<SelectProps> = {
        multiselectable: false,
        disabled: false,
        defaultSelection: [],
        placeholder: "",
    };

    private static idPropertyKey: string = "id";

    /**
     * Handled props instantiation
     */
    protected handledProps: HandledProps<SelectHandledProps> = {
        isMenuOpen: void 0,
        disabled: void 0,
        form: void 0,
        labelledBy: void 0,
        multiselectable: void 0,
        contentDisplayRenderFunction: void 0,
        dataValueFormatterFunction: void 0,
        required: void 0,
        managedClasses: void 0,
        selectedItems: void 0,
        defaultSelection: void 0,
        onValueChange: void 0,
        placeholder: void 0,
        autoFocus: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    /**
     * constructor
     */
    constructor(props: SelectProps) {
        super(props);

        this.state = {
            selectedItems: [],
            value: "",
            displayString: "",
            isMenuOpen: false,
        };
    }

    public componentDidUpdate(prevProps: SelectProps): void {
        if (prevProps.selectedItems !== this.props.selectedItems) {
            const newSelection: ListboxItemProps[] = Listbox.getListboxItemDataFromIds(
                this.props.selectedItems,
                this.props.children
            );
            this.updateSelection(newSelection);
        }
        if (prevProps.multiselectable !== this.props.multiselectable) {
            if (
                this.props.multiselectable === false &&
                this.state.selectedItems.length > 1
            ) {
                this.updateSelection([this.state.selectedItems[0]]);
            }
            this.toggleMenu(this.props.multiselectable);
        }
        if (prevProps.isMenuOpen !== this.props.isMenuOpen) {
            this.toggleMenu(this.props.multiselectable ? true : false);
        }
    }

    public componentDidMount(): void {
        let initialSelection: ListboxItemProps[];
        if (this.props.selectedItems !== undefined) {
            initialSelection = Listbox.getListboxItemDataFromIds(
                this.props.selectedItems,
                this.props.children
            );
        } else {
            initialSelection = Listbox.getListboxItemDataFromIds(
                this.props.defaultSelection,
                this.props.children
            );
        }

        if (!this.props.multiselectable && initialSelection.length > 1) {
            initialSelection = initialSelection.slice(0, 1);
        }

        this.updateSelection(initialSelection);
        this.toggleMenu(this.props.multiselectable ? true : false);
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                ref={this.rootElement}
                className={this.generateClassNames()}
                onKeyDown={this.handleKeydown}
                onClick={this.selectClicked}
            >
                {this.renderContentDisplay()}
                {this.renderHiddenSelectElement()}
                {this.renderMenu()}
            </div>
        );
    }

    /**
     * Create class names
     */
    protected generateClassNames(): string {
        let className: string = get(this.props.managedClasses, "select", "");

        if (this.props.disabled) {
            className = className.concat(
                " ",
                get(this.props.managedClasses, "select__disabled")
            );
        }

        return super.generateClassNames(className);
    }

    /**
     * Determine menu state based on props
     */
    private checkPropsForMenuState = (): boolean => {
        let shouldMenuBeOpen: boolean = false;

        if (this.props.isMenuOpen !== undefined) {
            shouldMenuBeOpen = this.props.isMenuOpen;
        } else if (this.props.multiselectable === true) {
            shouldMenuBeOpen = true;
        }

        return shouldMenuBeOpen;
    };

    /**
     * Renders a hidden select element which can interact with a
     * form hosting this component
     */
    private renderHiddenSelectElement(): React.ReactNode {
        return (
            <select
                required={this.props.required || null}
                name={this.props.name || null}
                form={this.props.form || null}
                value={this.state.value}
                multiple={this.props.multiselectable || null}
                disabled={this.props.disabled || null}
                style={{
                    display: "none",
                }}
            />
        );
    }

    /**
     * Deternmines which function to use to render content display (ie. the part of the control that shows when the menu isn't open)
     * and invokes it
     */
    private renderContentDisplay(): React.ReactNode {
        if (this.props.contentDisplayRenderFunction !== undefined) {
            return this.props.contentDisplayRenderFunction(
                this.state.selectedItems,
                this.state.value,
                this.state.displayString,
                this.props
            );
        } else {
            return this.defaultDisplayRenderFunction(
                this.state.selectedItems,
                this.state.value,
                this.state.displayString,
                this.props
            );
        }
    }

    /**
     * Deternmines which function to use to render the menu and invokes it
     */
    private renderMenu(): React.ReactNode {
        if (this.state.isMenuOpen) {
            return (
                <Listbox
                    labelledBy={this.getListboxLabelledBy()}
                    autoFocus={this.shouldAutoFocusListbox()}
                    multiselectable={this.props.multiselectable}
                    defaultSelection={this.state.selectedItems}
                    selectedItems={this.props.selectedItems}
                    onSelectedItemsChanged={this.updateSelection}
                >
                    {this.props.children}
                </Listbox>
            );
        }
    }

    /**
     * Determines desired value of listbox labelledBy prop
     */
    private getListboxLabelledBy = (): string => {
        if (this.props.labelledBy !== undefined && this.props.multiselectable) {
            return this.props.labelledBy;
        }
        return null;
    };

    /**
     * Determines desired value of listbox autofocus prop
     */
    private shouldAutoFocusListbox = (): boolean => {
        let shouldAutofocus: boolean = this.props.autoFocus;
        if (shouldAutofocus === undefined) {
            shouldAutofocus = this.props.multiselectable ? false : true;
        }
        return shouldAutofocus;
    };

    /**
     * Updates selection state and associated values
     */
    private updateSelection = (newSelection: ListboxItemProps[]): void => {
        const newValue: string = this.getFormattedValueString(newSelection);
        const newDisplayString: string = this.getFormattedDisplayString(newSelection);
        this.setState({
            selectedItems: newSelection,
            value: newValue,
            displayString: newDisplayString,
        });
        if (this.props.onValueChange) {
            this.props.onValueChange(newValue, newSelection, newDisplayString);
        }
    };

    /**
     * The default function that renders an unstyled content display
     */
    private defaultDisplayRenderFunction = (
        selectedOptions: ListboxItemProps[],
        formattedValue: string,
        formattedDisplayString: string,
        props: SelectProps
    ): React.ReactNode => {
        if (props.multiselectable) {
            return null;
        }
        return (
            <Button
                disabled={props.disabled}
                aria-labelledby={props.labelledBy || null}
                aria-haspopup={true}
                aria-expanded={this.state.isMenuOpen}
            >
                {formattedDisplayString}
            </Button>
        );
    };

    /**
     * The default function that formats the value string generated based on selection.
     * This implementation should match the default formatting a base html select control applies.
     * Developers can provide an alternate formatter if desired.
     */
    private defaultDataValueFormatter = (
        selectedOptions: ListboxItemProps[],
        selectName: string
    ): string => {
        const separator: string = "&";
        const prefix: string = selectName !== undefined ? selectName + "=" : "";
        let formattedValue: string = "";
        selectedOptions.forEach((thisOption: ListboxItemProps) => {
            if (formattedValue.length > 0) {
                formattedValue = formattedValue + separator;
            }
            formattedValue = formattedValue + prefix + thisOption.value;
        });
        return formattedValue;
    };

    /**
     * The default function that formats the display string generated based on selection.
     * This implementation should match the default formatting a base html select control applies.
     * Developers can provide an alternate formatter if desired.
     */
    private defaultDisplayStringFormatter = (
        selectedOptions: ListboxItemProps[],
        placeholder: string
    ): string => {
        const separator: string = ", ";
        let returnValue: string = "";
        if (selectedOptions.length > 0) {
            selectedOptions.forEach((thisOption: ListboxItemProps) => {
                if (returnValue.length > 0) {
                    returnValue = returnValue + separator;
                }
                returnValue =
                    returnValue +
                    (thisOption.displayString === undefined
                        ? thisOption.value
                        : thisOption.displayString);
            });
        } else {
            returnValue = placeholder;
        }
        return returnValue;
    };

    /**
     * Handles clicks
     */
    private selectClicked = (e: React.MouseEvent): void => {
        if (this.props.disabled || e.defaultPrevented) {
            return;
        }
        this.state.isMenuOpen ? this.toggleMenu(false) : this.toggleMenu(true);
    };

    /**
     * Handles key events
     */
    private handleKeydown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (this.props.disabled || e.defaultPrevented) {
            return;
        }
        switch (e.keyCode) {
            case KeyCodes.enter:
            case KeyCodes.space:
                this.toggleMenu(!this.state.isMenuOpen);
                break;
            case KeyCodes.escape:
                this.toggleMenu(false);
                break;
            case KeyCodes.arrowDown:
            case KeyCodes.arrowRight:
                if (!this.props.multiselectable && !e.defaultPrevented) {
                    this.incrementSelectedOption(+1);
                }
                break;
            case KeyCodes.arrowUp:
            case KeyCodes.arrowLeft:
                if (!this.props.multiselectable && !e.defaultPrevented) {
                    this.incrementSelectedOption(-1);
                }
                break;
        }
    };

    /**
     * Increment selection
     */
    private incrementSelectedOption = (increment: number): void => {
        const childrenAsArray: React.ReactNode[] = React.Children.toArray(
            this.props.children
        );
        const iterationIncrement: number = increment > -1 ? 1 : -1;
        if (this.state.selectedItems.length === 1) {
            const selectedItemIndex: number = Listbox.getItemIndexById(
                this.state.selectedItems[0].id,
                this.props.children
            );
            if (selectedItemIndex !== -1) {
                const startIndex: number = selectedItemIndex + iterationIncrement;
                const endIndex: number = increment > -1 ? 0 : childrenAsArray.length - 1;
                if (startIndex >= 0 && startIndex < childrenAsArray.length) {
                    const validOption: React.ReactNode = Listbox.getFirstValidOptionInRange(
                        startIndex,
                        endIndex,
                        childrenAsArray,
                        increment
                    );
                    if (validOption !== null) {
                        this.updateSelection([
                            (validOption as React.ReactElement<any>).props,
                        ]);
                    }
                }
            }
        } else {
            const startIndex: number = increment > -1 ? 0 : childrenAsArray.length - 1;
            const endIndex: number = increment > -1 ? childrenAsArray.length - 1 : 0;
            const validOption: React.ReactNode = Listbox.getFirstValidOptionInRange(
                startIndex,
                endIndex,
                childrenAsArray,
                increment
            );
            if (validOption !== null) {
                this.updateSelection([(validOption as React.ReactElement<any>).props]);
            }
        }

        this.toggleMenu(true);
        return;
    };

    /**
     * opens/closes the menu
     */
    private toggleMenu = (isMenuOpen: boolean): void => {
        let shouldOpenMenu: boolean = isMenuOpen;
        if (this.props.isMenuOpen !== undefined) {
            shouldOpenMenu = this.props.isMenuOpen;
        } else if (this.props.multiselectable === true) {
            shouldOpenMenu = true;
        } else {
            if (shouldOpenMenu) {
                window.addEventListener("click", this.handleWindowClick);
            } else {
                window.removeEventListener("click", this.handleWindowClick);
            }
        }
        this.setState({
            isMenuOpen: shouldOpenMenu,
        });
    };

    /**
     * tried to close the menu when when there are clicks outside
     */
    private handleWindowClick = (event: MouseEvent): void => {
        if (!this.rootElement.current.contains(event.target as Element)) {
            this.toggleMenu(false);
        }
    };

    /**
     * Determines what function needs to be called to format the result string and
     * calls it with the appropriate params
     */
    private getFormattedValueString = (selectedOptions: ListboxItemProps[]): string => {
        return this.props.dataValueFormatterFunction === undefined
            ? this.defaultDataValueFormatter(selectedOptions, this.props.name)
            : this.props.dataValueFormatterFunction(selectedOptions, this.props.name);
    };

    /**
     * Determines what function needs to be called to format the result string and
     * calls it with the appropriate params
     */
    private getFormattedDisplayString = (selectedOptions: ListboxItemProps[]): string => {
        return this.props.displayStringFormatterFunction === undefined
            ? this.defaultDisplayStringFormatter(selectedOptions, this.props.placeholder)
            : this.props.displayStringFormatterFunction(
                  selectedOptions,
                  this.props.placeholder
              );
    };
}

export default Select;
export * from "./select.props";
export { SelectClassNameContract };
