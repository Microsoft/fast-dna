/**
 * @jest-environment node
 */

import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import HorizontalOverflow, {
    IHorizontalOverflowClassNameContract,
    IHorizontalOverflowHandledProps,
} from "./";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

const imageSet1: JSX.Element[] = [
    (<img key="image1" src="https://placehold.it/200x200?text=1" />),
    (<img key="image2" src="https://placehold.it/200x200?text=2" />),
    (<img key="image3" src="https://placehold.it/200x200?text=3" />),
    (<img key="image4" src="https://placehold.it/200x200?text=4" />),
    (<img key="image5" src="https://placehold.it/200x200?text=5" />),
    (<img key="image6" src="https://placehold.it/200x200?text=6" />)
];

const managedClasses: IHorizontalOverflowClassNameContract = {
    horizontalOverflow: "horizontal-overflow-class",
    horizontalOverflow_items: "horizontal-overflow-items-class",
    horizontalOverflow_next: "horizontal-overflow-next-class",
    horizontalOverflow_previous: "horizontal-overflow-previous-class"
};

describe("horizontal overflow server-side", (): void => {
    test("should render in a node environment without throwing an error", () => {
        const renderedWithImagesAndNextAndPrevious: string = shallow(
            <HorizontalOverflow managedClasses={managedClasses}>
                <button id="testButtonNext" slot="next">next</button>
                <button id="testButtonPrevious" slot="previous">previous</button>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImagesAndNextAndPrevious).not.toBe(undefined);
    });
    test("should not error when trying to fire a click on server-side", () => {
        const renderedWithImagesAndNextAndPrevious: any = shallow(
            <HorizontalOverflow managedClasses={managedClasses}>
                <button id="testButtonNext" slot="next">next</button>
                <button id="testButtonPrevious" slot="previous">previous</button>
                {imageSet1}
            </HorizontalOverflow>
        );

        /* tslint:disable:no-string-literal */
        expect(renderedWithImagesAndNextAndPrevious.instance()["handleNextClick"]()).toBe(undefined);
        expect(renderedWithImagesAndNextAndPrevious.instance()["handlePreviousClick"]()).toBe(undefined);
        /* tslint:enable:no-string-literal */
    });
    test("should render to string for server side rendering", () => {
        const renderedWithImagesAndNextAndPrevious: string = ReactDOMServer.renderToString(
            <HorizontalOverflow managedClasses={managedClasses}>
                <button id="testButtonNext" slot="next">next</button>
                <button id="testButtonPrevious" slot="previous">previous</button>
                {imageSet1}
            </HorizontalOverflow>
        );

        /* tslint:disable:max-line-length */
        expect(renderedWithImagesAndNextAndPrevious).toEqual("<div class=\"horizontal-overflow-class\" data-reactroot=\"\"><div style=\"height:0px;position:relative;overflow:hidden\"><ul class=\"horizontal-overflow-items-class\" style=\"position:relative;white-space:nowrap;overflow-x:scroll;padding:0;margin:0\"><li style=\"display:inline-block\"><img src=\"https://placehold.it/200x200?text=1\"/></li><li style=\"display:inline-block\"><img src=\"https://placehold.it/200x200?text=2\"/></li><li style=\"display:inline-block\"><img src=\"https://placehold.it/200x200?text=3\"/></li><li style=\"display:inline-block\"><img src=\"https://placehold.it/200x200?text=4\"/></li><li style=\"display:inline-block\"><img src=\"https://placehold.it/200x200?text=5\"/></li><li style=\"display:inline-block\"><img src=\"https://placehold.it/200x200?text=6\"/></li></ul></div><div class=\"horizontal-overflow-previous-class\"><div><div><button id=\"testButtonPrevious\" slot=\"previous\">previous</button></div></div></div><div class=\"horizontal-overflow-next-class\"><div><div><button id=\"testButtonNext\" slot=\"next\">next</button></div></div></div></div>");
        /* tslint:enable:max-line-length */
    });
});
