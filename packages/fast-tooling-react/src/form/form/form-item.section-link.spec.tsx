import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import FormItemSectionLink from "./form-item.section-link";
import { FormItemSectionLinkProps } from "./form-item.section-link.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formItemSectionLinkProps: FormItemSectionLinkProps = {
    index: 1,
    dataLocation: "",
    schemaLocation: "",
    data: "",
    required: false,
    label: "",
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
    invalidMessage: "",
};

describe("NumberField", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<FormItemSectionLink {...formItemSectionLinkProps} />);
        }).not.toThrow();
    });
    test("should generate an HTML anchor element", () => {
        const rendered: any = mount(
            <FormItemSectionLink {...formItemSectionLinkProps} />
        );

        expect(rendered.find("a")).toHaveLength(1);
    });
    test("should fire an `onSectionUpdate` callback with the anchor is clicked", () => {
        const handleSectionUpdate: any = jest.fn();
        const rendered: any = mount(
            <FormItemSectionLink
                {...formItemSectionLinkProps}
                onUpdateSection={handleSectionUpdate}
            />
        );

        rendered
            .find("a")
            .at(0)
            .simulate("click");

        expect(handleSectionUpdate).toHaveBeenCalled();
        expect(handleSectionUpdate.mock.calls[0][0]).toEqual("");
        expect(handleSectionUpdate.mock.calls[0][1]).toEqual("");

        const handleSectionUpdateWithTestLocations: any = jest.fn();
        const renderedWithTestLocations: any = mount(
            <FormItemSectionLink
                {...formItemSectionLinkProps}
                onUpdateSection={handleSectionUpdateWithTestLocations}
                schemaLocation={"properties.test"}
                dataLocation={"test"}
            />
        );

        renderedWithTestLocations
            .find("a")
            .at(0)
            .simulate("click");

        expect(handleSectionUpdateWithTestLocations).toHaveBeenCalled();
        expect(handleSectionUpdateWithTestLocations.mock.calls[0][0]).toEqual(
            "properties.test"
        );
        expect(handleSectionUpdateWithTestLocations.mock.calls[0][1]).toEqual("test");
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <FormItemSectionLink
                {...formItemSectionLinkProps}
                data={10}
                onChange={handleChange}
            />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(undefined);
    });
    test("should add the previous data that was removed if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const data: number = 10;
        const rendered: any = mount(
            <FormItemSectionLink
                {...formItemSectionLinkProps}
                data={data}
                onChange={handleChange}
            />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change");

        rendered.setProps({ data: handleChange.mock.calls[0][1] });

        rendered
            .find("input")
            .at(0)
            .simulate("change");

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][1]).toBe(data);
    });
    test("should not show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is undefined", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <FormItemSectionLink
                {...formItemSectionLinkProps}
                data={"foo"}
                invalidMessage={invalidMessage}
            />
        );

        expect(rendered.html().includes(invalidMessage)).toBe(false);
    });
    test("should show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is true", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <FormItemSectionLink
                {...formItemSectionLinkProps}
                data={"foo"}
                invalidMessage={invalidMessage}
                displayValidationInline={true}
            />
        );

        expect(rendered.html().includes(invalidMessage)).toBe(true);
    });
    test("should update an invalid message if the invalid message is updated", () => {
        const invalidMessage1: string = "Foo";
        const invalidMessage2: string = "Bar";
        const rendered: any = mount(
            <FormItemSectionLink
                {...formItemSectionLinkProps}
                invalidMessage={invalidMessage1}
                displayValidationInline={true}
            />
        );

        expect(rendered.html().includes(invalidMessage1)).toBe(true);

        rendered.setProps({ invalidMessage: invalidMessage2 });

        expect(rendered.html().includes(invalidMessage2)).toBe(true);
    });
});
