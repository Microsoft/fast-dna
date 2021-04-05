import { html, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { AnchorTemplate } from "../anchor";
import { endTemplate, startTemplate } from "../patterns/start-end";
import { BreadcrumbItem } from "./breadcrumb-item";

/**
 * The template for the {@link @microsoft/fast-foundation#(BreadcrumbItem:class)} component.
 * @public
 */
export const BreadcrumbItemTemplate: (
    context,
    definition
) => ViewTemplate<BreadcrumbItem> = (context, definition) => html`
    <${context.tagFor(BreadcrumbItem)} role="listitem" class="listitem" part="listitem">
        ${when(
            x => x.href && x.href.length > 0,
            html<BreadcrumbItem>`
                ${AnchorTemplate}
            `
        )}
        ${when(
            x => !x.href,
            html<BreadcrumbItem>`
                ${startTemplate}
                <slot></slot>
                ${endTemplate}
            `
        )}
        ${when(
            x => x.separator,
            html<BreadcrumbItem>`
                <span class="separator" part="separator" aria-hidden="true">
                    <slot name="separator">/</slot>
                </span>
            `
        )}
    </${context.tagFor(BreadcrumbItem)}>
`;
