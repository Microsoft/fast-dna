import * as React from "react";
import { IDialogClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IDialogHandledProps {
    /**
     * The button content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The dialog content width
     */
    contentWidth?: string;

    /**
     * The dialog content height
     */
    contentHeight?: string;

    /**
     * The ref for the first focusable element within the dialog
     */
    focusElementRef?: React.RefObject<HTMLElement>;

    /**
     * The aria-describedby attribute to link the dialog to an
     * element that describes its purpose
     */
    describedBy?: string;

    /**
     * The aria-label to provide an accessible name for the dialog
     */
    label?: string;

    /**
     * The aria-labelledby attribute to link the dialog to an existing
     * element that provides it an accessible name
     */
    labelledBy?: string;

    /**
     * The ref for the element that triggered the dialog
     */
    triggerElementRef?: React.RefObject<HTMLElement>;

    /**
     * The option to add modal functionality and prevent a user
     * from interacting with elements outside the dialog
     */
    modal?: boolean;
}

export interface IDialogUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface IDialogManagedClasses extends IManagedClasses<IDialogClassNameContract> {}
export type DialogProps = IDialogHandledProps & IDialogUnhandledProps & IDialogManagedClasses;
