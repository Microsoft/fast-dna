import React from "react";
import { uniqueId } from "lodash-es";
import styles from "./form-category.style";
import {
    FormCategoryClassNameContract,
    FormCategoryProps,
    FormCategoryState,
} from "./form-category.props";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Schema form category component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class FormCategory extends React.Component<
    FormCategoryProps & ManagedClasses<FormCategoryClassNameContract>,
    FormCategoryState
> {
    public static displayName: string = "FormCategory";

    private id: string = uniqueId("category");

    constructor(
        props: FormCategoryProps & ManagedClasses<FormCategoryClassNameContract>
    ) {
        super(props);

        this.state = {
            expanded: this.props.expandable || false,
        };
    }
    /**
     * Renders the component
     */
    public render(): React.ReactNode {
        return (
            <div>
                {this.props.expandable
                    ? this.renderHeaderButton()
                    : this.renderHeaderTitle()}
                <div
                    className={this.getClassNames()}
                    {...this.generateContainerAttributes()}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }

    private generateContainerAttributes(): React.HtmlHTMLAttributes<HTMLDivElement> {
        const attributes: Partial<React.HtmlHTMLAttributes<HTMLDivElement>> = {
            id: this.id,
        };

        if (this.props.expandable) {
            attributes["aria-hidden"] = !this.state.expanded;
        }

        return attributes;
    }

    private handleCategoryCollapse = (): void => {
        this.setState({
            expanded: !this.state.expanded,
        });
    };

    private getClassNames(): string | null {
        return this.props.expandable && !this.state.expanded
            ? this.props.managedClasses.formCategory__collapsed
            : null;
    }

    private renderHeaderButton(): JSX.Element {
        return (
            <button
                onClick={this.handleCategoryCollapse}
                aria-expanded={this.state.expanded}
                aria-controls={this.id}
                className={this.props.managedClasses.formCategory_button}
            >
                {this.props.title}
            </button>
        );
    }

    private renderHeaderTitle(): JSX.Element {
        return (
            <h3 className={this.props.managedClasses.formCategory_header}>
                {this.props.title}
            </h3>
        );
    }
}

export default manageJss(styles)(FormCategory);
