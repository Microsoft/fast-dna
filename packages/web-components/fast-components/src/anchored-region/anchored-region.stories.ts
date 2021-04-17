import { Direction, RtlScrollConverter } from "@microsoft/fast-web-utilities";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import AnchoredRegionTemplate from "./fixtures/base.html";
import type { FASTAnchoredRegion } from "./index";
import "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("anchored-region")) {
        //scroll stuff into view
        document.querySelectorAll("div[id^=viewport]").forEach((el: HTMLElement) => {
            el.scrollTop = 280;
            RtlScrollConverter.setScrollLeft(
                el,
                el.dir === Direction.rtl ? -250 : 250,
                el.dir === Direction.rtl ? Direction.rtl : Direction.ltr
            );
        });

        // header region
        const headerFixedButton = document.getElementById("anchor-header-menu-fixed");
        headerFixedButton?.addEventListener("click", (e: MouseEvent) => {
            const menu: FASTAnchoredRegion = document.getElementById(
                "header-menu-fixed"
            ) as FASTAnchoredRegion;
            if (menu.style.display === "none") {
                menu.style.display = "";
            } else {
                menu.style.display = "none";
            }
        });

        const headerScalingButton = document.getElementById("anchor-header-menu-scaling");
        headerScalingButton?.addEventListener("click", (e: MouseEvent) => {
            const menu: FASTAnchoredRegion = document.getElementById(
                "header-menu-scaling"
            ) as FASTAnchoredRegion;
            if (menu.style.display === "none") {
                menu.style.display = "";
            } else {
                menu.style.display = "none";
            }
        });

        // toggle flyout
        // document.querySelectorAll("[id^=toggle-flyout-anchor").forEach(anchor => {
        //     anchor.addEventListener("click", (e: MouseEvent) => {
        //         document
        //             .getElementById("toggle-anchor-region")!
        //             .setAttribute("anchor", (e.target as HTMLElement).id);
        //     });
        // });

        // toggle anchor example
        // document.querySelectorAll("[id^=toggle-anchor-anchor").forEach(anchor => {
        //     anchor.addEventListener("click", (e: MouseEvent) => {
        //         document
        //             .getElementById("toggle-anchor-region")!
        //             .setAttribute("anchor", (e.target as HTMLElement).id);
        //     });
        // });

        // const positionsRegion = document.getElementById("toggle-positions-region")!;
        // document
        //     .querySelectorAll("#toggle-positions-horizontal, #toggle-positions-vertical")
        //     .forEach((el: HTMLElement) => {
        //         el.addEventListener("click", (e: MouseEvent) => {
        //             const isHorizontal = (e.target as HTMLElement).id.includes(
        //                 "horizontal"
        //             );
        //             const direction = isHorizontal ? "horizontal" : "vertical";
        //             const attr = `${direction}-default-position`;

        //             const currentPosition = positionsRegion.getAttribute(attr);

        //             positionsRegion.setAttribute(
        //                 attr,
        //                 isHorizontal
        //                     ? currentPosition === "left"
        //                         ? "right"
        //                         : "left"
        //                     : currentPosition === "top"
        //                     ? "bottom"
        //                     : "top"
        //             );
        //         });
        //     });

        // const smallContent = document.getElementById("toggle-positions-small")!;
        // const largeContent = document.getElementById("toggle-positions-large")!;
        // document
        //     .querySelectorAll("[id^=btn-toggle-positions]")
        //     .forEach((el: HTMLElement) => {
        //         el.addEventListener("click", (e: MouseEvent) => {
        //             const isSmall = (e.target as HTMLElement).id.includes("small");
        //             smallContent.hidden = !isSmall;
        //             largeContent.hidden = isSmall;
        //         });
        //     });

        // const regionScalingUpdate = document.getElementById(
        //     "region-scaling-update"
        // ) as FASTAnchoredRegion;
        // document
        //     .getElementById("viewport-scaling-update")!
        //     .addEventListener("scroll", () => regionScalingUpdate.update());
    }
});

const providerStyles = `
fast-design-system-provider {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
`;

export default {
    title: "Anchored Region",
    decorators: [
        Story => `
            <style>${providerStyles}</style>
            ${Story()}
        `,
    ],
};

export const AnchoredRegion = () => AnchoredRegionTemplate;
