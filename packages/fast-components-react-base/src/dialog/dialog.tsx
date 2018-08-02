import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "../foundation";
import { IDialogHandledProps, IDialogManagedClasses, IDialogUnhandledProps } from "./dialog.props";
import { IDialogClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/* tslint:disable-next-line */
class Dialog extends Foundation<IDialogHandledProps & IManagedClasses<IDialogClassNameContract>,  React.AllHTMLAttributes<HTMLElement>, {}> {
    public static defaultProps: Partial<IDialogHandledProps> = {
        contentHeight: "480px",
        contentWidth: "640px"
    };

    protected handledProps: HandledProps<IDialogHandledProps & IManagedClasses<IDialogClassNameContract>> = {
        describedBy: void 0,
        label: void 0,
        labelledBy: void 0,
        children: void 0,
        contentWidth: void 0,
        contentHeight: void 0,
        focusElementRef: void 0,
        modal: void 0,
        managedClasses: void 0,
        triggerElementRef: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
            >
                {this.renderModalOverlay()}
                <div {...this.generateContentRegionAttributes()}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.dialog"));
    }

    /**
     * Generates attributes for the content region
     */
    private generateContentRegionAttributes(): React.HTMLAttributes<HTMLDivElement> {
        return {
            role: "dialog",
            tabIndex: -1,
            className: get(this.props, "managedClasses.dialog_contentRegion"),
            style: {
                height: this.props.contentHeight,
                width: this.props.contentWidth,
            },
            "aria-describedby": this.props.describedBy || null,
            "aria-labelledby": this.props.labelledBy || null,
            "aria-label": this.props.label || null
        };
    }

    /**
     * Renders the modal overlay
     */
    private renderModalOverlay(): React.ReactElement<HTMLDivElement> {
        if (!this.props.modal) {
            return;
        }

        return (
            <div
                className={get(this.props, "managedClasses.dialog_modalOverlay")}
                role={"presentation"}
                tabIndex={-1}
            />
        );
    }
}

export default Dialog;
export * from "./dialog.props";
export { IDialogClassNameContract };
