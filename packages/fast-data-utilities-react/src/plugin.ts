import { ChildOptionItem } from "./";

export interface PluginProps {
    /**
     * The string(s) associated by the plugin
     */
    id: string | string[];
}

export default abstract class Plugin<C extends PluginProps> {
    private config: C;

    constructor(config: C) {
        this.config = config;

        this.config.id = Array.isArray(this.config.id)
            ? this.config.id
            : [this.config.id];
    }

    /**
     * Determines if there is a match for the IDs set for the plugin
     * and a provided ID
     */
    public resolvesForId(id: string): boolean {
        return this.config.id.indexOf(id) !== -1;
    }

    /**
     * Resolves the data given
     */
    /* tslint:disable-next-line */
    public resolver(data: any, childOption?: ChildOptionItem): any {}
}
