import { attr, booleanConverter, FASTElement, observable } from "@microsoft/fast-element";
import { isHTMLElement, keyCodeEnter, keyCodeSpace } from "@microsoft/fast-web-utilities";

export enum MenuItemRole {
    menuitem = "menuitem",
    menuitemcheckbox = "menuitemcheckbox",
    menuitemradio = "menuitemradio",
}

export class MenuItem extends FASTElement {
    private menu: HTMLElement;

    @observable
    public slottedMenus: HTMLElement[];
    private slottedMenusChanged(): void {
        // if the menus change for some reason, grab the first one again
        if (isHTMLElement(this.slottedMenus[0])) {
            this.menu = this.slottedMenus[0];
        }
    }

    @attr({ mode: "boolean" })
    public disabled: boolean;
    private disabledChanged(): void {
        this.disabled
            ? this.classList.add("disabled")
            : this.classList.remove("disabled");
    }

    @attr({ attribute: "aria-expanded", mode: "reflect", converter: booleanConverter })
    public expanded: boolean = false;
    private expandedChanged(): void {
        this.expanded
            ? this.classList.add("expanded")
            : this.classList.remove("expanded");
    }

    @attr
    public role: MenuItemRole = MenuItemRole.menuitem;

    @attr
    public checked: boolean;

    public connectedCallback(): void {
        super.connectedCallback();

        console.log(this.menu, "menu");
    }

    public handleMenuItemKeyDown = (e: KeyboardEvent): boolean => {
        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeSpace:
                if (!!this.menu) {
                    this.expanded = !this.expanded;
                    this.menu.focus();
                }
                // this.$emit("click", e);
                break;
        }

        return true;
    };

    public handleMenuItemClick = (e: MouseEvent): void => {
        if (!!this.menu) {
            this.expanded = !this.expanded;
            console.log(this.expanded);
        }
        // this.$emit("click", e);
    };

    public start: HTMLSlotElement;
    public startContainer: HTMLSpanElement;
    public handleStartContentChange(): void {
        this.start.assignedNodes().length > 0
            ? this.startContainer.classList.add("start")
            : this.startContainer.classList.remove("start");
    }

    public end: HTMLSlotElement;
    public endContainer: HTMLSpanElement;
    public handleEndContentChange(): void {
        this.end.assignedNodes().length > 0
            ? this.endContainer.classList.add("end")
            : this.endContainer.classList.remove("end");
    }
}
