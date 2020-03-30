/**
 * Retrieves the "parent" element of a node, ignoring DOM tree boundries.
 * When the "parent" of a node is a shadow-root, it will return the host
 * element of the shadow root.
 * @param element The element to retreive the parent element of
 */
export function composedParent<T extends HTMLElement>(element: T): HTMLElement | null {
    const parentNode = element.parentElement;

    if (parentNode) {
        return parentNode;
    } else {
        const rootNode = element.getRootNode();

        if (rootNode.hasOwnProperty("host")) {
            // this is shadow-root
            return (rootNode as ShadowRoot).host as HTMLElement;
        }
    }

    return null;
}
