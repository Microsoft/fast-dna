import * as React from "react";
import { ICheckboxClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts";

export interface ICheckboxHandledProps {
    /**
     * The checked state
     */
    checked?: boolean;

    /**
     * The textual content
     */
    text?: string;

    /**
     * The indeterminate option
     */
    indeterminate?: boolean;

    /**
     * The onChange event handler
     */
    onChange?: CheckboxOnChange;
}

export type CheckboxOnChange = (event?: React.ChangeEvent<HTMLElement>) => void;
export interface ICheckboxUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface ICheckboxManagedClasses extends IManagedClasses<ICheckboxClassNameContract> {}
export type CheckboxProps = ICheckboxHandledProps & ICheckboxUnhandledProps & ICheckboxManagedClasses;
