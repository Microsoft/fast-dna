// TODO: Is exporting Foundation still necessary with the updated API's?
// export * from "@microsoft/fast-element";
import { DesignSystem } from "@microsoft/fast-foundation";
import * as fastComponents from "./custom-elements";

export * from "./index";

/**
 * TODO rename this to FASTDesignSystem when {@link @FASTDesignSystem} interface is removed.
 */
export const fastDesignSystem = new DesignSystem();

Object.values(fastComponents).forEach(definition => {
    fastDesignSystem.register(definition());
});

fastDesignSystem.applyTo(document.body);
