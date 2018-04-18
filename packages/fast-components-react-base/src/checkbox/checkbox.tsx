import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, {HandledProps} from "../foundation";
import { ICheckboxItem, ICheckboxProps} from "./checkbox.props";
import {ICheckboxClassNameContract, IManagedClasses} from "@microsoft/fast-components-class-name-contracts";

/* tslint:disable-next-line */
class Checkbox extends Foundation<ICheckboxProps & IManagedClasses<ICheckboxClassNameContract>,  React.AllHTMLAttributes<HTMLElement>, {}> {
    protected handledProps: HandledProps<ICheckboxProps & IManagedClasses<ICheckboxClassNameContract>> = {
        managedClasses: void 0,
        items: void(0)
    };

    // protected defaultProps: ICheckboxProps = {
    //     tag: ButtonHTMLTags.button
    // };

    /**
     * Generate HTML attributes based on props
     */
    public generateAttributes(item) {
        let attributes = {};

        if (item.disabled) {
            attributes["disabled"] = "disabled";
        }

        if (item.indeterminate) {
            // this is here to maintain shape
            attributes["data-js-checkbox"] = "indeterminate";
        }

        // If the author is not setting the checked state, we should let the checkbox manage itself
        // if (!isUndefined(item.checked)) {
        //     if (item.onChange) {
        //         attributes['checked'] = !!item.checked;
        //     } else {
        //         attributes['defaultChecked'] = !!item.checked;
        //     }
        // }

        attributes["id"] = item.id;
        attributes["name"] = item.name;
        attributes["value"] = item.value;
        attributes["aria-label"] = item.text;

        return attributes;
    }

    /**
     * Renders a checkbox item
     */
    public renderCheckboxItem(item: ICheckboxItem, index: number) {
        return (
            <label key={item.id + index} className="c-label">
                <input
                    type="checkbox"
                    {...this.generateAttributes(item)}
                    onChange={item.onChange}
                    ref={this.setRef("items", index)}
                />
                <span dangerouslySetInnerHTML={{ __html: item.text }} />
            </label>
        );
    }

    /**
     * Renders checkbox items
     */
    public renderCheckboxItems() {
        return this.props.items.map((item, index) => {
            return this.renderCheckboxItem(item, index);
        });
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLInputElement> {
        return (
            // <div>
            //     <input
            //         type="checkbox"
            //         {...this.unhandledProps()}
            //         className={this.generateClassNames()}
            //     />
            // </div>
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
            >
                {this.renderCheckboxItems()}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(this.props.managedClasses.checkbox);
    }
}

export default Checkbox;
export {ICheckboxItem, ICheckboxProps, ICheckboxClassNameContract};
