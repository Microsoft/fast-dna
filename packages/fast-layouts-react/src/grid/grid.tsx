import * as React from "react";
import manageJss, { ComponentStyles, ICSSRules, IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import BreakpointTracker from "../utilities/breakpoint-tracker";
import { getValueByBreakpoint } from "../utilities/breakpoints";
import { GridAlignment, GridProps, GridTag, IGridHandledProps } from "./grid.props";
import Foundation, { IFoundationProps } from "../foundation";
import Column from "../column";

export interface IGridClassNamesContract {
    grid: string;
}

const styles: ComponentStyles<IGridClassNamesContract, undefined> = {
    grid: {
        display: "grid",
        gridAutoRows: "auto"
    }
};

class Grid extends Foundation<GridProps, {}> {
    /**
     * Stores HTML tag for use in render
     */
    private get tag(): string {
        return this.generateHTMLTag();
    }

    public static defaultProps: IGridHandledProps = {
        tag: GridTag.div,
        gridColumn: 2,
        gutter: 8,
        verticalAlign: GridAlignment.stretch,
        horizontalAlign: GridAlignment.stretch
    };

    protected handledProps: GridProps = {
        columnCount: void 0,
        gridColumn: void 0,
        gutter: void 0,
        horizontalAlign: void 0,
        managedClasses: void 0,
        tag: void 0,
        verticalAlign: void 0
    };

    /**
     * Renders the Grid markup
     */
    public render(): JSX.Element {
        return (
            <this.tag
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                style={this.generateStyleAttributes()}
            >
                {this.renderChildren()}
            </this.tag>
        );
    }

    /**
     * Component has mounted
     */
    public componentDidMount(): void {
        if (this.shouldTrackBreakpoints(this.props)) {
            BreakpointTracker.subscribe(this.update);
        }
    }

    /**
     * Component will be unmounted
     */
    public componentWillUnmount(): void {
        BreakpointTracker.unsubscribe(this.update);
    }

    /**
     * Component has updated
     */
    public componentDidUpdate(previousProps: GridProps): void {
        if (this.shouldTrackBreakpoints(this.props) && !this.shouldTrackBreakpoints(previousProps)) {
            // If we should be tracking breakpoints but previously weren't, then subscribe to changes
            BreakpointTracker.subscribe(this.update);
        } else if (!this.shouldTrackBreakpoints(this.props) && this.shouldTrackBreakpoints(previousProps)) {
            // If we were tracking breakpoints but we shouldn't be now, then unsubscribe from chnages
            BreakpointTracker.unsubscribe(this.update);
        }
    }

    protected generateClassNames(): string {
        const className: string = this.props.managedClasses.grid;

        return super.generateClassNames(className);
    }

    /**
     * Determines if we should be tracking breakpoints based on a set of props
     */
    private shouldTrackBreakpoints(props: GridProps): boolean {
        return Array.isArray(props.gutter);
    }

    /**
     * Generates the column-span value
     */
    private generateGutter(): number {
        if (typeof this.props.gutter === "number") {
            return this.props.gutter;
        } else if (Array.isArray(this.props.gutter)) {
            return getValueByBreakpoint(this.props.gutter);
        } else {
            return null;
        }
    }

    private generateAlignment(alignment: GridAlignment): string {
        return GridAlignment[alignment];
    }

    /**
     * Force the component to update
     */
    private update = (): void => {
        this.forceUpdate();
    }

    private generateStyleAttributes(): React.HTMLAttributes<HTMLDivElement> {
        const style: React.CSSProperties = {
            gridColumn: this.props.gridColumn,
            gridTemplateColumns: `repeat(${this.props.columnCount} 1fr)`,
            gridColumnGap: `${this.generateGutter()}px`,
            gridRow: this.props.row,
            justifyItems: this.generateAlignment(this.props.horizontalAlign || GridAlignment.stretch),
            alignItems: this.generateAlignment(this.props.verticalAlign || GridAlignment.stretch),
            msGridColumns: `1fr (${this.generateGutter()})[${this.props.columnCount - 1}]`,
            ["msGridRow" as any]: this.props.row
        };

        return style;
    }

    /**
     * Creates tags for rendering based on href
     */
    private generateHTMLTag(): string {
        return GridTag[this.props.tag] || GridTag.div;
    }

    private renderChildren(): React.ReactNode | React.ReactNode[] {
        return React.Children.map(this.props.children, (child: React.ReactNode | React.ReactNode[]) => {
            if ((child as any).type !== Column || (child as any).props.gutter) {
                return child;
            }

            return React.cloneElement(child as any, { gutter: this.props.gutter }, (child as any).props.children);
        });
    }
}

export default manageJss(styles)(Grid);
