import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get, isNil } from "lodash-es";
import { ViewportPositionerClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    AxisPositioningMode,
    ViewportPositionerHandledProps,
    ViewportPositionerHorizontalPosition,
    ViewportPositionerProps,
    ViewportPositionerUnhandledProps,
    ViewportPositionerVerticalPosition,
} from "./viewport-positioner.props";
import {
    IntersectionObserverEntry,
    ResizeObserverClassDefinition,
    ResizeObserverEntry,
} from "../utilities";
import { DisplayNamePrefix } from "../utilities";
import { canUseDOM } from "exenv-es6";

export interface ViewportPositionerState {
    disabled: boolean;
    noOberverMode: boolean;
    xTransformOrigin: string;
    yTransformOrigin: string;
    xTranslate: number;
    yTranslate: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
    currentVerticalPosition: ViewportPositionerVerticalPositionLabel;
    currentHorizontalPosition: ViewportPositionerHorizontalPositionLabel;
    defaultVerticalPosition: ViewportPositionerVerticalPositionLabel;
    defaultHorizontalPosition: ViewportPositionerHorizontalPositionLabel;
    initialLayoutComplete: boolean;
}

export enum ViewportPositionerHorizontalPositionLabel {
    left = "left",
    centerLeft = "centerLeft",
    centerRight = "centerRight",
    right = "right",
    uncontrolled = "uncontrolled",
}

export enum ViewportPositionerVerticalPositionLabel {
    top = "top",
    centerTop = "centerTop",
    centerBottom = "centerBottom",
    bottom = "bottom",
    uncontrolled = "uncontrolled",
}

class ViewportPositioner extends Foundation<
    ViewportPositionerHandledProps,
    ViewportPositionerUnhandledProps,
    ViewportPositionerState
> {
    public static displayName: string = `${DisplayNamePrefix}ViewportPositioner`;

    public static defaultProps: Partial<ViewportPositionerProps> = {
        horizontalPositioningMode: AxisPositioningMode.uncontrolled,
        defaultHorizontalPosition: ViewportPositionerHorizontalPosition.uncontrolled,
        verticalPositioningMode: AxisPositioningMode.flipOutward,
        defaultVerticalPosition: ViewportPositionerVerticalPosition.bottom,
        horizontalAlwaysInView: false,
        verticalAlwaysInView: false,
        fixedAfterInitialPlacement: false,
    };

    protected handledProps: HandledProps<ViewportPositionerHandledProps> = {
        managedClasses: void 0,
        anchor: void 0,
        viewport: void 0,
        horizontalPositioningMode: void 0,
        defaultHorizontalPosition: void 0,
        horizontalThreshold: void 0,
        horizontalAlwaysInView: void 0,
        verticalPositioningMode: void 0,
        defaultVerticalPosition: void 0,
        verticalThreshold: void 0,
        verticalAlwaysInView: void 0,
        fixedAfterInitialPlacement: void 0,
        disabled: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private openRequestAnimationFrame: number = null;

    private collisionDetector: IntersectionObserver;
    private resizeDetector: ResizeObserverClassDefinition;

    private viewportRect: ClientRect | DOMRect;
    private positionerRect: ClientRect | DOMRect;
    private anchorTop: number = 0;
    private anchorRight: number = 0;
    private anchorBottom: number = 0;
    private anchorLeft: number = 0;
    private anchorHeight: number = 0;
    private anchorWidth: number = 0;

    private scrollTop: number = 0;
    private scrollLeft: number = 0;

    /**
     * constructor
     */
    constructor(props: ViewportPositionerProps) {
        super(props);

        this.state = {
            disabled: true,
            noOberverMode: false,
            xTransformOrigin: "left",
            yTransformOrigin: "top",
            xTranslate: 0,
            yTranslate: 0,
            top: null,
            right: null,
            bottom: null,
            left: null,
            currentHorizontalPosition:
                ViewportPositionerHorizontalPositionLabel.uncontrolled,
            currentVerticalPosition: ViewportPositionerVerticalPositionLabel.uncontrolled,
            defaultHorizontalPosition: this.ConvertHorizontalPositionToLabel(
                this.props.horizontalPositioningMode,
                this.props.defaultHorizontalPosition
            ),
            defaultVerticalPosition: this.ConvertVerticalPositionToLabel(
                this.props.verticalPositioningMode,
                this.props.defaultVerticalPosition
            ),
            initialLayoutComplete: false,
        };
    }

    public componentDidMount(): void {
        this.checkComponentConfig();
        this.requestFrame();
    }

    public componentWillUnmount(): void {
        this.disableComponent();
    }

    public componentDidUpdate(prevProps: ViewportPositionerProps): void {
        if (
            prevProps.viewport !== this.props.viewport ||
            prevProps.anchor !== this.props.anchor ||
            prevProps.disabled !== this.props.disabled
        ) {
            this.checkComponentConfig();
        }
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                ref={this.rootElement}
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                style={this.getPositioningStyles()}
            >
                {this.props.children}
            </div>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        let classNames: string = get(this.props, "managedClasses.viewportPositioner", "");

        switch (this.state.currentHorizontalPosition) {
            case ViewportPositionerHorizontalPositionLabel.left:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__left", "")
                );
                classNames = classNames.concat(
                    " ",
                    get(
                        this.props.managedClasses,
                        "viewportPositioner__horizontalFlipOutward",
                        ""
                    )
                );
                break;

            case ViewportPositionerHorizontalPositionLabel.centerLeft:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__left", "")
                );
                classNames = classNames.concat(
                    " ",
                    get(
                        this.props.managedClasses,
                        "viewportPositioner__horizontalFlipInward",
                        ""
                    )
                );
                break;

            case ViewportPositionerHorizontalPositionLabel.centerRight:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__right", "")
                );
                classNames = classNames.concat(
                    " ",
                    get(
                        this.props.managedClasses,
                        "viewportPositioner__horizontalFlipInward",
                        ""
                    )
                );
                break;

            case ViewportPositionerHorizontalPositionLabel.right:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__right", "")
                );
                classNames = classNames.concat(
                    " ",
                    get(
                        this.props.managedClasses,
                        "viewportPositioner__horizontalFlipOutward",
                        ""
                    )
                );
                break;
        }

        switch (this.state.currentVerticalPosition) {
            case ViewportPositionerVerticalPositionLabel.top:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__top", "")
                );
                classNames = classNames.concat(
                    " ",
                    get(
                        this.props.managedClasses,
                        "viewportPositioner__verticalFlipOutward",
                        ""
                    )
                );
                break;

            case ViewportPositionerVerticalPositionLabel.centerTop:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__top", "")
                );
                classNames = classNames.concat(
                    " ",
                    get(
                        this.props.managedClasses,
                        "viewportPositioner__verticalFlipInward",
                        ""
                    )
                );
                break;

            case ViewportPositionerVerticalPositionLabel.centerBottom:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__bottom", "")
                );
                classNames = classNames.concat(
                    " ",
                    get(
                        this.props.managedClasses,
                        "viewportPositioner__verticalFlipInward",
                        ""
                    )
                );
                break;

            case ViewportPositionerVerticalPositionLabel.bottom:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__bottom", "")
                );
                classNames = classNames.concat(
                    " ",
                    get(
                        this.props.managedClasses,
                        "viewportPositioner__verticalFlipOutward",
                        ""
                    )
                );
                break;
        }

        return super.generateClassNames(classNames);
    }

    /**
     *  gets the CSS classes to be programmatically applied to the component
     */
    private getPositioningStyles = (): {} => {
        // determine if we should hide the positioner because we don't have data to position it yet
        // (avoiding flicker)
        let shouldHide: boolean = false;
        if (this.state.disabled) {
            if (
                (this.props.disabled === undefined || this.props.disabled === false) &&
                isNil(this.positionerRect) &&
                this.getAnchorElement() !== null
            ) {
                shouldHide = true;
            }
        } else if (isNil(this.positionerRect) && !this.state.noOberverMode) {
            shouldHide = true;
        }

        return {
            opacity: shouldHide ? 0 : undefined,
            position: "relative",
            transformOrigin: `${this.state.xTransformOrigin} ${
                this.state.yTransformOrigin
            }`,
            transform: `translate(
                ${Math.floor(this.state.xTranslate)}px, 
                ${Math.floor(this.state.yTranslate)}px
            )`,
            top: this.state.top === null ? null : `${this.state.top}px`,
            right: this.state.right === null ? null : `${this.state.right}px`,
            bottom: this.state.bottom === null ? null : `${this.state.bottom}px`,
            left: this.state.left === null ? null : `${this.state.left}px`,
        };
    };

    /**
     *  Checks whether component should be disabled or not
     */
    private checkComponentConfig = (): void => {
        if (
            !canUseDOM() ||
            this.props.disabled === true ||
            this.getAnchorElement() === null
        ) {
            this.disableComponent();
            return;
        }
        this.enableComponent();
    };

    /**
     *  Enable the component
     */
    private enableComponent = (): void => {
        if (
            !this.state.disabled ||
            this.props.disabled ||
            this.getAnchorElement() === null ||
            isNil(this.rootElement.current)
        ) {
            return;
        }

        if (
            !(window as WindowWithIntersectionObserver).IntersectionObserver ||
            !(window as WindowWithResizeObserver).ResizeObserver
        ) {
            this.setNoObserverMode();
            return;
        }

        this.setState({
            disabled: false,
            noOberverMode: false,
        });

        this.collisionDetector = new (window as WindowWithIntersectionObserver).IntersectionObserver(
            this.handleCollision,
            {
                root: this.getViewportElement(),
                rootMargin: "0px",
                threshold: [0, 1],
            }
        );
        this.collisionDetector.observe(this.rootElement.current);
        this.collisionDetector.observe(this.getAnchorElement());

        this.resizeDetector = new (window as WindowWithResizeObserver).ResizeObserver(
            this.handleAnchorResize
        );
        this.resizeDetector.observe(this.getAnchorElement());

        this.getViewportElement().addEventListener("scroll", this.handleScroll);
    };

    /**
     *  Disable the component
     */
    private setNoObserverMode = (): void => {
        // observers not supported so the best we do is try to set the default position if there is one
        this.positionerRect = {
            top: 0,
            right: this.rootElement.current.clientHeight,
            bottom: this.rootElement.current.clientHeight,
            left: 0,
            height: this.rootElement.current.clientHeight,
            width: this.rootElement.current.clientHeight,
        };

        if (this.props.horizontalPositioningMode !== AxisPositioningMode.uncontrolled) {
            const horizontalPositions: ViewportPositionerHorizontalPositionLabel[] = this.getHorizontalPositioningOptions();
            if (
                this.state.defaultHorizontalPosition !== undefined &&
                horizontalPositions.indexOf(this.state.defaultHorizontalPosition) !== -1
            ) {
                this.applyBaseHorizontalPositioningState(
                    this.state.defaultHorizontalPosition
                );
            } else {
                this.applyBaseHorizontalPositioningState(horizontalPositions[0]);
            }
        }

        if (this.props.verticalPositioningMode !== AxisPositioningMode.uncontrolled) {
            const verticalPositions: ViewportPositionerVerticalPositionLabel[] = this.getVerticalPositioningOptions();
            if (
                this.state.defaultVerticalPosition !== undefined &&
                verticalPositions.indexOf(this.state.defaultVerticalPosition) !== -1
            ) {
                this.applyBaseVerticalPositioningState(
                    this.state.defaultVerticalPosition
                );
            } else {
                this.applyBaseVerticalPositioningState(verticalPositions[0]);
            }
        }

        this.setState({
            disabled: false,
            noOberverMode: true,
        });
    };

    /**
     *  Disable the component
     */
    private disableComponent = (): void => {
        if (this.state.disabled) {
            return;
        }
        this.setState({
            disabled: true,
        });

        if (!this.state.noOberverMode) {
            if (
                this.collisionDetector &&
                typeof this.collisionDetector.disconnect === "function"
            ) {
                this.collisionDetector.unobserve(this.rootElement.current);
                this.collisionDetector.unobserve(this.getAnchorElement());
                this.collisionDetector.disconnect();
                this.collisionDetector = null;
            }

            // TODO #1142 https://github.com/Microsoft/fast-dna/issues/1142
            // Full browser support imminent
            // Revisit usage once Safari and Firefox adapt
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1272409
            // https://bugs.webkit.org/show_bug.cgi?id=157743
            if (
                this.resizeDetector &&
                typeof this.resizeDetector.disconnect === "function"
            ) {
                this.resizeDetector.unobserve(this.getAnchorElement());
                this.resizeDetector.disconnect();
                this.resizeDetector = null;
            }

            this.getViewportElement().addEventListener("scroll", this.handleScroll);
        }
    };

    /**
     *  Get available Horizontal positions based on positioning mode
     */
    private getHorizontalPositioningOptions = (): ViewportPositionerHorizontalPositionLabel[] => {
        switch (this.props.horizontalPositioningMode) {
            case AxisPositioningMode.flipInward:
                return [
                    ViewportPositionerHorizontalPositionLabel.centerLeft,
                    ViewportPositionerHorizontalPositionLabel.centerRight,
                ];

            case AxisPositioningMode.flipOutward:
                return [
                    ViewportPositionerHorizontalPositionLabel.left,
                    ViewportPositionerHorizontalPositionLabel.right,
                ];
        }
    };

    /**
     * Get available Vertical positions based on positioning mode
     */
    private getVerticalPositioningOptions = (): ViewportPositionerVerticalPositionLabel[] => {
        switch (this.props.verticalPositioningMode) {
            case AxisPositioningMode.flipInward:
                return [
                    ViewportPositionerVerticalPositionLabel.centerTop,
                    ViewportPositionerVerticalPositionLabel.centerBottom,
                ];

            case AxisPositioningMode.flipOutward:
                return [
                    ViewportPositionerVerticalPositionLabel.top,
                    ViewportPositionerVerticalPositionLabel.bottom,
                ];
        }
    };

    /**
     *  Get the width available for a particular horizontal position
     */
    private getOptionWidth = (
        positionOption: ViewportPositionerHorizontalPositionLabel
    ): number => {
        const spaceLeft: number = this.anchorLeft - this.viewportRect.left;
        const spaceRight: number =
            this.viewportRect.right - (this.anchorLeft + this.anchorWidth);

        switch (positionOption) {
            case ViewportPositionerHorizontalPositionLabel.left:
                return spaceLeft;
            case ViewportPositionerHorizontalPositionLabel.centerLeft:
                return spaceLeft + this.anchorWidth;
            case ViewportPositionerHorizontalPositionLabel.centerRight:
                return spaceRight + this.anchorWidth;
            case ViewportPositionerHorizontalPositionLabel.right:
                return spaceRight;
        }
    };

    /**
     *  Get the height available for a particular vertical position
     */
    private getOptionHeight = (
        positionOption: ViewportPositionerVerticalPositionLabel
    ): number => {
        const spaceAbove: number = this.anchorTop - this.viewportRect.top;
        const spaceBelow: number =
            this.viewportRect.bottom - (this.anchorTop + this.anchorHeight);

        switch (positionOption) {
            case ViewportPositionerVerticalPositionLabel.top:
                return spaceAbove;
            case ViewportPositionerVerticalPositionLabel.centerTop:
                return spaceAbove + this.anchorHeight;
            case ViewportPositionerVerticalPositionLabel.centerBottom:
                return spaceBelow + this.anchorHeight;
            case ViewportPositionerVerticalPositionLabel.bottom:
                return spaceBelow;
        }
    };

    /**
     *  Handle scroll events
     */
    private handleScroll = (): void => {
        this.requestFrame();
    };

    /**
     *  Handle anchor resize events
     */
    private handleAnchorResize = (entries: ResizeObserverEntry[]): void => {
        const entry: ResizeObserverEntry = entries[0];
        this.anchorHeight = entry.contentRect.height;
        this.anchorWidth = entry.contentRect.width;

        if (
            this.state.currentVerticalPosition ===
            ViewportPositionerVerticalPositionLabel.top
        ) {
            this.anchorBottom = this.anchorTop + this.anchorHeight;
        } else {
            this.anchorTop = this.anchorBottom - this.anchorHeight;
        }

        if (
            this.state.currentHorizontalPosition ===
            ViewportPositionerHorizontalPositionLabel.left
        ) {
            this.anchorRight = this.anchorLeft + this.anchorWidth;
        } else {
            this.anchorLeft = this.anchorRight - this.anchorWidth;
        }

        this.requestFrame();
    };

    /**
     *  Handle collisions
     */
    private handleCollision = (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
    ): void => {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.target === this.rootElement.current) {
                this.processPositionerCollision(entry);
            } else {
                this.processAnchorCollision(entry);
            }
        });

        this.scrollTop = this.getViewportElement().scrollTop;

        this.scrollLeft = this.getViewportElement().scrollLeft;

        this.requestFrame();
    };

    /**
     *  Update data based on anchor collisions
     */
    private processAnchorCollision = (anchorEntry: IntersectionObserverEntry): void => {
        this.viewportRect = anchorEntry.rootBounds;
        this.anchorTop = anchorEntry.boundingClientRect.top;
        this.anchorRight = anchorEntry.boundingClientRect.right;
        this.anchorBottom = anchorEntry.boundingClientRect.bottom;
        this.anchorHeight = anchorEntry.boundingClientRect.height;
        this.anchorWidth = anchorEntry.boundingClientRect.width;
    };

    /**
     *  Update data based on positioner collisions
     */
    private processPositionerCollision = (
        positionerEntry: IntersectionObserverEntry
    ): void => {
        this.viewportRect = positionerEntry.rootBounds;
        this.positionerRect = positionerEntry.boundingClientRect;

        switch (this.state.currentVerticalPosition) {
            case ViewportPositionerVerticalPositionLabel.top:
                this.anchorTop = this.positionerRect.bottom - this.state.yTranslate;
                this.anchorBottom = this.anchorTop + this.anchorHeight;
                break;

            case ViewportPositionerVerticalPositionLabel.centerTop:
                this.anchorBottom = this.positionerRect.bottom - this.state.yTranslate;
                this.anchorTop = this.anchorBottom - this.anchorHeight;
                break;

            case ViewportPositionerVerticalPositionLabel.centerBottom:
                this.anchorTop = this.positionerRect.top - this.state.yTranslate;
                this.anchorBottom = this.anchorTop + this.anchorHeight;
                break;

            case ViewportPositionerVerticalPositionLabel.bottom:
                this.anchorBottom = this.positionerRect.top - this.state.yTranslate;
                this.anchorTop = this.anchorBottom - this.anchorHeight;
                break;
        }

        switch (this.state.currentHorizontalPosition) {
            case ViewportPositionerHorizontalPositionLabel.left:
                this.anchorLeft = this.positionerRect.right - this.state.xTranslate;
                this.anchorRight = this.anchorLeft + this.anchorWidth;
                break;

            case ViewportPositionerHorizontalPositionLabel.centerLeft:
                this.anchorRight = this.positionerRect.right - this.state.xTranslate;
                this.anchorLeft = this.anchorRight - this.anchorWidth;
                break;

            case ViewportPositionerHorizontalPositionLabel.centerRight:
                this.anchorLeft = this.positionerRect.left - this.state.xTranslate;
                this.anchorRight = this.anchorLeft + this.anchorWidth;
                break;

            case ViewportPositionerHorizontalPositionLabel.right:
                this.anchorRight = this.positionerRect.left - this.state.xTranslate;
                this.anchorLeft = this.anchorRight - this.anchorWidth;
                break;
        }
    };

    /**
     * Check for scroll changes in viewport and adjust position data
     */
    private updateForScrolling = (): void => {
        const scrollingContainer: Element = this.getViewportElement();

        if (isNil(scrollingContainer) || isNaN(scrollingContainer.scrollTop)) {
            return;
        }

        const scrollTop: number = scrollingContainer.scrollTop;
        const scrollLeft: number = scrollingContainer.scrollLeft;

        if (this.scrollTop !== scrollTop) {
            const verticalScrollDelta: number = this.scrollTop - scrollTop;
            this.scrollTop = scrollTop;
            this.anchorTop = this.anchorTop + verticalScrollDelta;
            this.anchorBottom = this.anchorBottom + verticalScrollDelta;
        }

        if (this.scrollLeft !== scrollLeft) {
            const horizontalScrollDelta: number = this.scrollLeft - scrollLeft;
            this.scrollLeft = scrollLeft;
            this.anchorLeft = this.anchorLeft + horizontalScrollDelta;
            this.anchorRight = this.anchorRight + horizontalScrollDelta;
        }
    };

    /**
     *  Recalculate layout related state values
     */
    private updateLayout = (): void => {
        this.openRequestAnimationFrame = null;
        if (
            this.state.disabled ||
            isNil(this.viewportRect) ||
            isNil(this.positionerRect) ||
            (this.props.fixedAfterInitialPlacement && this.state.initialLayoutComplete)
        ) {
            return;
        }

        this.updateForScrolling();

        let desiredVerticalPosition: ViewportPositionerVerticalPositionLabel =
            ViewportPositionerVerticalPositionLabel.uncontrolled;
        let desiredHorizontalPosition: ViewportPositionerHorizontalPositionLabel =
            ViewportPositionerHorizontalPositionLabel.uncontrolled;

        if (this.props.horizontalPositioningMode !== AxisPositioningMode.uncontrolled) {
            const horizontalOptions: ViewportPositionerHorizontalPositionLabel[] = this.getHorizontalPositioningOptions();

            if (horizontalOptions.indexOf(this.state.defaultHorizontalPosition) !== -1) {
                desiredHorizontalPosition = this.state.defaultHorizontalPosition;
            }

            const horizontalThreshold: number =
                this.props.horizontalThreshold !== undefined
                    ? this.props.horizontalThreshold
                    : this.positionerRect.width;

            if (
                desiredHorizontalPosition ===
                    ViewportPositionerHorizontalPositionLabel.uncontrolled ||
                this.getOptionWidth(desiredHorizontalPosition) < horizontalThreshold
            ) {
                desiredHorizontalPosition =
                    this.getOptionWidth(horizontalOptions[0]) >
                    this.getOptionWidth(horizontalOptions[1])
                        ? horizontalOptions[0]
                        : horizontalOptions[1];
            }

            this.applyBaseHorizontalPositioningState(desiredHorizontalPosition);
        }

        if (this.props.verticalPositioningMode !== AxisPositioningMode.uncontrolled) {
            const verticalOptions: ViewportPositionerVerticalPositionLabel[] = this.getVerticalPositioningOptions();

            if (verticalOptions.indexOf(this.state.defaultVerticalPosition) !== -1) {
                desiredVerticalPosition = this.state.defaultVerticalPosition;
            }

            const verticalThreshold: number =
                this.props.verticalThreshold !== undefined
                    ? this.props.verticalThreshold
                    : this.positionerRect.height;

            if (
                desiredVerticalPosition ===
                    ViewportPositionerVerticalPositionLabel.uncontrolled ||
                this.getOptionHeight(desiredVerticalPosition) < verticalThreshold
            ) {
                desiredVerticalPosition =
                    this.getOptionHeight(verticalOptions[0]) >
                    this.getOptionHeight(verticalOptions[1])
                        ? verticalOptions[0]
                        : verticalOptions[1];
            }

            this.applyBaseVerticalPositioningState(desiredVerticalPosition);
        }

        this.setState({
            xTranslate: this.calculateHorizontalTranslate(desiredHorizontalPosition),
            yTranslate: this.calculateVerticalTranslate(desiredVerticalPosition),
            initialLayoutComplete: true,
        });
    };

    /**
     * Apply base horizontal positioning state based on desired position
     */
    private applyBaseHorizontalPositioningState = (
        desiredHorizontalPosition: ViewportPositionerHorizontalPositionLabel
    ): void => {
        let right: number = null;
        let left: number = null;
        let xTransformOrigin: string = "left";

        switch (desiredHorizontalPosition) {
            case ViewportPositionerHorizontalPositionLabel.left:
                xTransformOrigin = "right";
                right = this.positionerRect.width;
                break;

            case ViewportPositionerHorizontalPositionLabel.centerLeft:
                xTransformOrigin = "right";
                right = 0;
                break;

            case ViewportPositionerHorizontalPositionLabel.centerRight:
                xTransformOrigin = "left";
                left = 0;
                break;

            case ViewportPositionerHorizontalPositionLabel.right:
                xTransformOrigin = "left";
                left = this.anchorWidth;
                break;
        }

        this.setState({
            xTransformOrigin,
            right,
            left,
            currentHorizontalPosition: desiredHorizontalPosition,
        });
    };

    /**
     * Apply base vertical positioning state based on desired position
     */
    private applyBaseVerticalPositioningState = (
        desiredVerticalPosition: ViewportPositionerVerticalPositionLabel
    ): void => {
        let top: number = null;
        let bottom: number = null;
        let yTransformOrigin: string = "top";

        switch (desiredVerticalPosition) {
            case ViewportPositionerVerticalPositionLabel.top:
                yTransformOrigin = "bottom";
                bottom = this.positionerRect.height + this.anchorHeight;
                break;

            case ViewportPositionerVerticalPositionLabel.centerTop:
                yTransformOrigin = "bottom";
                bottom = this.positionerRect.height;
                break;

            case ViewportPositionerVerticalPositionLabel.centerBottom:
                yTransformOrigin = "top";
                top = -this.anchorHeight;
                break;

            case ViewportPositionerVerticalPositionLabel.bottom:
                yTransformOrigin = "top";
                top = 0;
                break;
        }
        this.setState({
            yTransformOrigin,
            top,
            bottom,
            currentVerticalPosition: desiredVerticalPosition,
        });
    };

    /**
     *  Calculate horizontal tranlation to keep positioner in view
     */
    private calculateHorizontalTranslate = (
        horizontalPosition: ViewportPositionerHorizontalPositionLabel
    ): number => {
        if (!this.props.horizontalAlwaysInView) {
            return 0;
        }

        let translate: number = 0;

        switch (horizontalPosition) {
            case ViewportPositionerHorizontalPositionLabel.left:
                translate = this.viewportRect.right - this.anchorLeft;
                translate = translate < 0 ? translate - 1 : 0;
                break;

            case ViewportPositionerHorizontalPositionLabel.centerLeft:
                translate = this.viewportRect.right - this.anchorRight;
                translate = translate < 0 ? translate - 1 : 0;
                break;

            case ViewportPositionerHorizontalPositionLabel.centerRight:
                translate = this.viewportRect.left - this.anchorLeft;
                translate = translate > 0 ? translate + 1 : 0;
                break;

            case ViewportPositionerHorizontalPositionLabel.right:
                translate = this.viewportRect.left - this.anchorRight;
                translate = translate > 0 ? translate + 1 : 0;
                break;
        }
        return translate;
    };

    /**
     *  Calculate vertical tranlation to keep positioner in view
     */
    private calculateVerticalTranslate = (
        verticalPosition: ViewportPositionerVerticalPositionLabel
    ): number => {
        if (!this.props.verticalAlwaysInView) {
            return 0;
        }

        let translate: number = 0;

        switch (verticalPosition) {
            case ViewportPositionerVerticalPositionLabel.top:
                translate = this.viewportRect.bottom - this.anchorTop;
                translate = translate < 0 ? translate - 1 : 0;
                break;

            case ViewportPositionerVerticalPositionLabel.centerTop:
                translate = this.viewportRect.bottom - this.anchorBottom;
                translate = translate < 0 ? translate - 1 : 0;
                break;

            case ViewportPositionerVerticalPositionLabel.centerBottom:
                translate = this.viewportRect.top - this.anchorTop;
                translate = translate < 0 ? 0 : translate + 1;
                break;

            case ViewportPositionerVerticalPositionLabel.bottom:
                translate = this.viewportRect.top - this.anchorBottom;
                translate = translate < 0 ? 0 : translate + 1;
                break;
        }

        return translate;
    };

    /**
     * Request's an animation frame if there are currently no open animation frame requests
     */
    private requestFrame = (): void => {
        if (this.openRequestAnimationFrame === null && !this.state.disabled) {
            this.openRequestAnimationFrame = window.requestAnimationFrame(
                this.updateLayout
            );
        }
    };

    /**
     * get the anchor element
     */
    private getAnchorElement = (): HTMLElement => {
        if (isNil(this.props.anchor)) {
            return null;
        }

        if (this.props.anchor instanceof HTMLElement) {
            return this.props.anchor;
        } else {
            return this.props.anchor.current;
        }
    };

    /**
     * get the viewport element
     */
    private getViewportElement = (): HTMLElement => {
        if (isNil(this.props.viewport)) {
            return document.scrollingElement as HTMLElement;
        }

        if (this.props.viewport instanceof HTMLElement) {
            return this.props.viewport;
        } else {
            return this.props.viewport.current;
        }
    };

    /**
     * Converts simple horizontal position to a position label based on AxisPositioningMode
     */
    private ConvertHorizontalPositionToLabel = (
        positioningMode: AxisPositioningMode,
        position: ViewportPositionerHorizontalPosition
    ): ViewportPositionerHorizontalPositionLabel => {
        switch (positioningMode) {
            case AxisPositioningMode.flipInward:
                if (position === ViewportPositionerHorizontalPosition.left) {
                    return ViewportPositionerHorizontalPositionLabel.centerLeft;
                } else if (position === ViewportPositionerHorizontalPosition.right) {
                    return ViewportPositionerHorizontalPositionLabel.centerRight;
                }

            case AxisPositioningMode.flipOutward:
                if (position === ViewportPositionerHorizontalPosition.left) {
                    return ViewportPositionerHorizontalPositionLabel.left;
                } else if (position === ViewportPositionerHorizontalPosition.right) {
                    return ViewportPositionerHorizontalPositionLabel.right;
                }
            case AxisPositioningMode.uncontrolled:
                return ViewportPositionerHorizontalPositionLabel.uncontrolled;
        }
    };

    /**
     * Converts simple vertical position to a position label based on AxisPositioningMode
     */
    private ConvertVerticalPositionToLabel = (
        positioningMode: AxisPositioningMode,
        position: ViewportPositionerVerticalPosition
    ): ViewportPositionerVerticalPositionLabel => {
        switch (positioningMode) {
            case AxisPositioningMode.flipInward:
                if (position === ViewportPositionerVerticalPosition.top) {
                    return ViewportPositionerVerticalPositionLabel.centerTop;
                } else if (position === ViewportPositionerVerticalPosition.bottom) {
                    return ViewportPositionerVerticalPositionLabel.centerBottom;
                }

            case AxisPositioningMode.flipOutward:
                if (position === ViewportPositionerVerticalPosition.top) {
                    return ViewportPositionerVerticalPositionLabel.top;
                } else if (position === ViewportPositionerVerticalPosition.bottom) {
                    return ViewportPositionerVerticalPositionLabel.bottom;
                }
            case AxisPositioningMode.uncontrolled:
                return ViewportPositionerVerticalPositionLabel.uncontrolled;
        }
    };
}

export default ViewportPositioner;
export * from "./viewport-positioner.props";
export { ViewportPositionerClassNameContract };
