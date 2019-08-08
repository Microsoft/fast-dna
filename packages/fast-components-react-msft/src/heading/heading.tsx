import React from "react";
import ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TypographySize, TypographyTag } from "@microsoft/fast-components-react-base";
import {
    HeadingAlignBaseline,
    HeadingHandledProps,
    HeadingManagedClasses,
    HeadingProps,
    HeadingUnhandledProps,
    HeadingSize,
} from "./heading.props";
import { Typography } from "../typography";
import {
    HeadingClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { DisplayNamePrefix } from "../utilities";
import { classNames } from "@microsoft/fast-web-utilities";

class Heading extends Foundation<HeadingHandledProps, HeadingUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Heading`;
    public static defaultProps: Partial<HeadingProps> = {
        size: HeadingSize._1,
        managedClasses: {},
    };

    protected handledProps: HandledProps<HeadingHandledProps> = {
        size: void 0,
        managedClasses: void 0,
        tag: void 0,
    };

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): TypographyTag {
        return this.props.tag ? TypographyTag[this.props.tag] : TypographyTag.h1;
    }

    /**
     * Stores size for use in render
     */
    private get size(): TypographySize {
        return TypographySize[`_${this.props.size}`];
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLHeadingElement | HTMLParagraphElement> {
        return (
            <Typography
                {...this.unhandledProps()}
                tag={this.tag}
                size={this.size}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </Typography>
        );
    }

    /**
     * Generates class names based on props
     */
    protected generateClassNames(): string {
        const managedClasses: HeadingClassNameContract = this.props.managedClasses;
        return super.generateClassNames(classNames(
            managedClasses.heading,
            managedClasses[`heading__${this.props.size}`]
        ))
    }
}

export default Heading;
export * from "./heading.props";
export { HeadingClassNameContract };
