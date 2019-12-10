import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSWidthClassNameContract } from "./width.style";
import { CommonControlConfig } from "../../form/templates";
import { Omit } from "utility-types";

export interface CSSWidthValues {
    width?: string;
}

export interface CSSWidthUnhandledProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {}

export interface CSSWidthHandledProps
    extends CommonControlConfig,
        ManagedClasses<CSSWidthClassNameContract> {
    // /**
    //  * The data
    //  */
    // data?: CSSWidthValues;
    // /**
    //  * The onChange callback
    //  */
    // onChange?: (config: CommonControlConfig) => void;
}

export type CSSWidthProps = CSSWidthHandledProps & CSSWidthUnhandledProps;
