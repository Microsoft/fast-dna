import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
// TODO: the Resize Observer related files are a temporary stopgap measure until
// Resize Observer types are pulled into TypeScript, which seems imminent
// At that point these files should be deleted.
// https://github.com/microsoft/TypeScript/issues/37861
import {
    ConstructibleResizeObserver,
    ResizeObserverClassDefinition,
} from "../anchored-region/resize-observer";
import { ResizeObserverEntry } from "../anchored-region/resize-observer-entry";

declare global {
    interface WindowWithResizeObserver extends Window {
        ResizeObserver: ConstructibleResizeObserver;
    }
}

/**
 * The views types for a horizontal-scroll {@link @microsoft/fast-foundation#(HorizontalScroll:class)}
 * @public
 */
export type HorizontalScrollView = "default" | "mobile";

/**
 * The easing types available for the horizontal-scroll {@link @microsoft/fast-foundation#(HorizontalScroll:class)}
 * @public
 */
export type ScrollEasing = "linear" | "ease-in" | "ease-out" | "ease-in-out";

/**
 * A HorizontalScroll Custom HTML Element
 * @public
 */
export class HorizontalScroll extends FASTElement {
    /**
     * Reference to DOM element that scrolls the content
     * @public
     */
    public scrollContainer: HTMLDivElement;

    /**
     * Reference to flipper to scroll to previous content
     * @public
     */
    public previousFlipper: HTMLDivElement;

    /**
     * Reference to flipper to scroll to the next content
     * @public
     */
    public nextFlipper: HTMLDivElement;

    /**
     * @internal
     */
    private framesPerSecond: number = 120;

    /**
     * Speed of scroll in pixels per second
     * @public
     */
    @attr
    public speed: number = 600;

    /**
     * Attribute used for easing, defaults to ease-in-out
     * @public
     */
    @attr
    public easing: ScrollEasing = "ease-in-out";

    /**
     * Scrolling state
     * @internal
     */
    private scrolling: boolean = false;

    /**
     * Detects if the component has been resized
     * @internal
     */
    private resizeDetector: ResizeObserverClassDefinition | null = null;

    /**
     * Width of the parent container
     * @internal
     */
    private width: number;

    /**
     * Scroll stop positions between elements
     * @internal
     */
    private scrollStops: number[];

    /**
     * The default slotted items placed in the scrolling container.
     *
     * @public
     */
    @observable
    public scrollItems: HTMLElement[];

    /**
     * In RTL mode
     * @internal
     */
    private get isRtl(): boolean {
        return (
            this.scrollItems.length > 1 &&
            this.scrollItems[0].offsetLeft > this.scrollItems[1].offsetLeft
        );
    }

    /**
     * View: default | mobile
     * @public
     */
    @attr({ attribute: "view" })
    public view: HorizontalScrollView;

    public connectedCallback(): void {
        super.connectedCallback();

        DOM.queueUpdate(this.setStops.bind(this));
        this.initializeResizeDetector();
        this.startObservers();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.disconnectResizeDetector();
    }

    /**
     * Starts observers
     * @internal
     */
    private startObservers = (): void => {
        this.stopObservers();
        this.resizeDetector?.observe(this);
    };

    /**
     * Stops observers
     * @internal
     */
    private stopObservers = (): void => {
        this.resizeDetector?.disconnect();
    };

    /**
     * destroys the instance's resize observer
     * @internal
     */
    private disconnectResizeDetector(): void {
        this.stopObservers();
        this.resizeDetector = null;
    }

    /**
     * initializes the instance's resize observer
     * @internal
     */
    private initializeResizeDetector(): void {
        this.disconnectResizeDetector();
        this.resizeDetector = new ((window as unknown) as WindowWithResizeObserver).ResizeObserver(
            this.handleResize.bind(this)
        );
    }

    /**
     * Handle resize events
     * @internal
     */
    private handleResize = (entries: ResizeObserverEntry[]): void => {
        entries.forEach((entry: ResizeObserverEntry): void => {
            if (entry.target === this) {
                this.resized();
            }
        });
    };

    /**
     * Finds all of the scroll stops between elements
     * @internal
     */
    private setStops(): void {
        this.width = this.offsetWidth;
        let lastStop: number = 0;
        const lastScrollItemIndex = this.scrollItems.length - 1;
        let stops: number[] = this.scrollItems
            .map(({ offsetLeft: left, offsetWidth: width }, index): number => {
                const right: number = left + width;

                if (this.isRtl) {
                    if (index === lastScrollItemIndex) {
                        return 0;
                    }

                    return -right;
                }

                lastStop = right;
                if (index === 0) {
                    return 0;
                }

                return left;
            })
            .concat(lastStop);

        /* Fixes a FireFox bug where it doesn't scroll to the start */
        stops = this.fixScrollMisalign(stops);

        /* Sort to zero */
        stops.sort((a, b) => Math.abs(a) - Math.abs(b));

        this.scrollStops = stops;
        this.setFlippers();
    }

    /**
     *
     */
    private fixScrollMisalign(stops: number[]) {
        if (this.isRtl && stops.some(stop => stop > 0)) {
            stops.sort((a, b) => b - a);
            const offset = stops[0];
            stops = stops.map(stop => stop - offset);
        }

        return stops;
    }

    /**
     * Returns the current scroll position of the scrollContainer
     * @internal
     */
    private getScrollPosition(): number {
        return this.scrollContainer.scrollLeft;
    }

    /**
     * Sets the controls view if enabled
     * @internal
     */
    private setFlippers(): void {
        const position: number = this.getScrollPosition();
        if (this.previousFlipper) {
            this.previousFlipper.classList.toggle("disabled", position === 0);
        }
        if (this.nextFlipper && this.scrollStops) {
            const lastStop: number = Math.abs(
                this.scrollStops[this.scrollStops.length - 1]
            );
            this.nextFlipper.classList.toggle(
                "disabled",
                Math.abs(position) + this.width >= lastStop
            );
        }
    }

    /**
     * Scrolls items to the left
     * @public
     */
    public scrollToPrevious(): void {
        const scrollPosition: number = this.getScrollPosition();
        const current = this.scrollStops.findIndex(
            (stop, index) =>
                stop <= scrollPosition &&
                (this.isRtl ||
                    index === this.scrollStops.length - 1 ||
                    this.scrollStops[index + 1] > scrollPosition)
        );

        const right = Math.abs(this.scrollStops[current + 1]);

        let nextIndex: number = this.scrollStops.findIndex(
            (stop: number): boolean => Math.abs(stop) + this.width > right
        );
        if (nextIndex > current || nextIndex === -1) {
            nextIndex = current > 0 ? current - 1 : 0;
        }
        this.scrollToPosition(this.scrollStops[nextIndex], scrollPosition);
    }

    /**
     * Scrolls items to the right
     * @public
     */
    public scrollToNext(): void {
        const scrollPosition: number = this.getScrollPosition();
        const current = this.scrollStops.findIndex(
            stop => Math.abs(stop) >= Math.abs(scrollPosition)
        );
        const outOfView: number = this.scrollStops.findIndex(
            stop => Math.abs(scrollPosition) + this.width <= Math.abs(stop)
        );

        let nextIndex: number = current;

        if (outOfView > current + 2) {
            nextIndex = outOfView - 2;
        } else if (current < this.scrollStops.length - 2) {
            nextIndex = current + 1;
        }
        const nextStop: number = this.scrollStops[nextIndex];
        this.scrollToPosition(nextStop, scrollPosition);
    }

    /**
     * Handles scrolling with easing
     * @param position - starting position
     * @param newPosition - position to scroll to
     * @public
     */
    public scrollToPosition(
        newPosition: number,
        position: number = this.scrollContainer.scrollLeft
    ): void {
        if (this.scrolling) {
            return;
        }

        this.scrolling = true;

        const steps: number[] = [];
        const direction: number = position < newPosition ? 1 : -1;
        const scrollDistance: number = Math.abs(newPosition - position);
        const seconds: number = scrollDistance / this.speed;
        const stepCount: number = Math.floor(this.framesPerSecond * seconds);

        if (stepCount < 1) {
            this.scrolling = false;
            return;
        }

        for (let i = 0; i < stepCount; i++) {
            const progress = i / stepCount;
            const easingFactor = this.getEasedFactor(this.easing, progress);
            const travel = scrollDistance * easingFactor * direction;
            steps.push(travel + position);
        }

        steps.push(newPosition);

        this.move(steps, 1000 / this.framesPerSecond);
    }

    /**
     * Holds the timestamp of the current animation frame.
     * @internal
     */
    private moveStartTime: number;

    /**
     *
     * @param steps - An array of positions to move
     * @param time - The duration between moves
     * @internal
     */
    private move(steps: number[], time: number): void {
        if (steps.length) {
            this.moveStartTime = requestAnimationFrame(timestamp => {
                if (timestamp - this.moveStartTime >= time) {
                    const nextStep = steps.shift();
                    this.scrollContainer.scrollLeft =
                        nextStep ?? this.scrollContainer.scrollLeft;
                }

                this.move(steps, time);
            });
            return;
        }

        this.setFlippers();
        this.scrolling = false;
    }

    /**
     * Monitors resize event on the horizontal-scroll element
     * @public
     */
    public resized(): void {
        this.width = this.offsetWidth;
        this.setFlippers();
    }

    /**
     * Monitors scrolled event on the content container
     * @public
     */
    public scrolled(): void {
        this.setFlippers();
    }

    /**
     *
     * @param easing - Type of easing
     * @param progress - Progress completed, 0 - 1
     * @internal
     */
    private getEasedFactor(easing: ScrollEasing, progress: number): number {
        if (progress > 1) {
            progress = 1;
        }
        switch (easing) {
            case "ease-in":
                return Math.pow(progress, 1.675);
            case "ease-out":
                return 1 - Math.pow(1 - progress, 1.675);
            case "ease-in-out":
                return 0.5 * (Math.sin((progress - 0.5) * Math.PI) + 1);
            default:
                return progress;
        }
    }
}
