import { expect } from "chai";
import { DOM } from "./dom";
import { FASTElementDefinition } from "./fast-definitions";
import { ElementStyles } from "./styles";

describe("FASTElementDefinition", () => {
    class MyElement {}

    context("styles", () => {
        it("can accept a string", () => {
            const styles = ".class { color: red; }";
            const options = {
                name: "test-element",
                styles,
            };

            const def = new FASTElementDefinition(MyElement, options);
            expect(def.styles!.styles).to.contain(styles);
        });

        it("can accept multiple strings", () => {
            const css1 = ".class { color: red; }";
            const css2 = ".class2 { color: red; }";
            const options = {
                name: "test-element",
                styles: [css1, css2],
            };
            const def = new FASTElementDefinition(MyElement, options);
            expect(def.styles!.styles).to.contain(css1);
            expect(def.styles!.styles.indexOf(css1)).to.equal(0);
            expect(def.styles!.styles).to.contain(css2);
        });

        it("can accept ElementStyles", () => {
            const css = ".class { color: red; }";
            const styles = ElementStyles.create([css]);
            const options = {
                name: "test-element",
                styles,
            };
            const def = new FASTElementDefinition(MyElement, options);
            expect(def.styles).to.equal(styles);
        });

        it("can accept multiple ElementStyles", () => {
            const css1 = ".class { color: red; }";
            const css2 = ".class2 { color: red; }";
            const existingStyles1 = ElementStyles.create([css1]);
            const existingStyles2 = ElementStyles.create([css2]);
            const options = {
                name: "test-element",
                styles: [existingStyles1, existingStyles2],
            };
            const def = new FASTElementDefinition(MyElement, options);
            expect(def.styles!.styles).to.contain(existingStyles1);
            expect(def.styles!.styles.indexOf(existingStyles1)).to.equal(0);
            expect(def.styles!.styles).to.contain(existingStyles2);
        });

        it("can accept mixed strings and ElementStyles", () => {
            const css1 = ".class { color: red; }";
            const css2 = ".class2 { color: red; }";
            const existingStyles2 = ElementStyles.create([css2]);
            const options = {
                name: "test-element",
                styles: [css1, existingStyles2],
            };
            const def = new FASTElementDefinition(MyElement, options);
            expect(def.styles!.styles).to.contain(css1);
            expect(def.styles!.styles.indexOf(css1)).to.equal(0);
            expect(def.styles!.styles).to.contain(existingStyles2);
        });

        if (DOM.supportsAdoptedStyleSheets) {
            it("can accept a CSSStyleSheet", () => {
                const styles = new CSSStyleSheet();
                const options = {
                    name: "test-element",
                    styles,
                };
                const def = new FASTElementDefinition(MyElement, options);
                expect(def.styles!.styles).to.contain(styles);
            });

            it("can create from multiple CSSStyleSheets", () => {
                const styleSheet1 = new CSSStyleSheet();
                const styleSheet2 = new CSSStyleSheet();
                const options = {
                    name: "test-element",
                    styles: [styleSheet1, styleSheet2],
                };
                const def = new FASTElementDefinition(MyElement, options);
                expect(def.styles!.styles).to.contain(styleSheet1);
                expect(def.styles!.styles.indexOf(styleSheet1)).to.equal(0);
                expect(def.styles!.styles).to.contain(styleSheet2);
            });

            it("can create from mixed strings, ElementStyles, and CSSStyleSheets", () => {
                const css1 = ".class { color: red; }";
                const css2 = ".class2 { color: red; }";
                const existingStyles2 = ElementStyles.create([css2]);
                const styleSheet3 = new CSSStyleSheet();
                const options = {
                    name: "test-element",
                    styles: [css1, existingStyles2, styleSheet3],
                };
                const def = new FASTElementDefinition(MyElement, options);
                expect(def.styles!.styles).to.contain(css1);
                expect(def.styles!.styles.indexOf(css1)).to.equal(0);
                expect(def.styles!.styles).to.contain(existingStyles2);
                expect(def.styles!.styles.indexOf(existingStyles2)).to.equal(1);
                expect(def.styles!.styles).to.contain(styleSheet3);
            });
        }
    });
});
