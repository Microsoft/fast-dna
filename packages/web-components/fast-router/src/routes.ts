import {
    RouteRecognizer,
    RecognizedRoute,
    Endpoint,
    ConfigurableRoute,
    RouteParameterConverter,
} from "./recognizer";
import { NavigationCommand, Redirect, Render, Ignore } from "./commands";
import { ViewTemplate, FASTElement, Constructable } from "@microsoft/fast-element";
import { Transition } from "./transition";
import { RouterConfiguration } from "./configuration";
import { Router } from "./router";
import { LayoutDefinition } from "./layout";
import { QueryString } from "./query-string";
import { Route } from "./navigation";

export const childRouteParameter = "fast-child-route";

export type SupportsSettings<TSettings = any> = {
    settings?: TSettings;
};

export type PathedRouteDefinition<TSettings = any> = SupportsSettings<TSettings> & Route;

export type IgnorableRouteDefinition<TSettings = any> = PathedRouteDefinition<TSettings>;

export type LayoutAndTransitionRouteDefinition = {
    layout?: LayoutDefinition | ViewTemplate;
    transition?: Transition;
};

export type RedirectRouteDefinition<TSettings = any> = PathedRouteDefinition<
    TSettings
> & {
    redirect: string;
};

export type HasTitle = {
    title?: string;
};

export type NavigableRouteDefinition<TSettings = any> = PathedRouteDefinition<TSettings> &
    LayoutAndTransitionRouteDefinition &
    HasTitle & {
        childRouters?: boolean;
    };

export type FASTElementConstructor = new () => FASTElement;

export type HasElement = {
    element:
        | string
        | FASTElementConstructor
        | HTMLElement
        | (() => Promise<string | FASTElementConstructor | HTMLElement>);
};

export type ElementFallbackRouteDefinition<
    TSettings = any
> = LayoutAndTransitionRouteDefinition &
    HasElement &
    SupportsSettings<TSettings> &
    HasTitle;

export type ElementRouteDefinition<TSettings = any> = NavigableRouteDefinition<
    TSettings
> &
    HasElement;

export type HasTemplate = {
    template: ViewTemplate | (() => Promise<ViewTemplate>);
};

export type TemplateFallbackRouteDefinition<
    TSettings = any
> = LayoutAndTransitionRouteDefinition &
    HasTemplate &
    SupportsSettings<TSettings> &
    HasTitle;

export type TemplateRouteDefinition<TSettings = any> = NavigableRouteDefinition<
    TSettings
> &
    HasTemplate;

export type HasCommand = {
    command: NavigationCommand;
};

export type CommandRouteDefinition<TSettings = any> = PathedRouteDefinition<TSettings> &
    HasCommand &
    HasTitle;

export type CommandFallbackRouteDefinition<TSettings = any> = HasCommand &
    SupportsSettings<TSettings> &
    HasTitle;

export type FallbackRouteDefinition<TSettings = any> =
    | ElementFallbackRouteDefinition<TSettings>
    | TemplateFallbackRouteDefinition<TSettings>
    | Pick<RedirectRouteDefinition<TSettings>, "redirect">
    | CommandFallbackRouteDefinition<TSettings>;

export type DefinitionCallback = () =>
    | Promise<FallbackRouteDefinition>
    | FallbackRouteDefinition;

export type RenderableRouteDefinition<TSettings = any> =
    | ElementRouteDefinition<TSettings>
    | TemplateRouteDefinition<TSettings>;

export type MappableRouteDefinition<TSettings = any> =
    | RenderableRouteDefinition<TSettings>
    | RedirectRouteDefinition<TSettings>
    | CommandRouteDefinition<TSettings>
    | ParentRouteDefinition<TSettings>;

export type ParentRouteDefinition<TSettings = any> = PathedRouteDefinition<TSettings> &
    LayoutAndTransitionRouteDefinition & {
        children: MappableRouteDefinition<TSettings>[];
    };

export type RouteMatch<TSettings = any> = {
    route: RecognizedRoute<TSettings>;
    command: NavigationCommand;
};

function getFallbackCommand(
    config: RouterConfiguration,
    definition: FallbackRouteDefinition
): NavigationCommand {
    if ("command" in definition) {
        return definition.command;
    } else if ("redirect" in definition) {
        return new Redirect(definition.redirect);
    } else {
        return Render.fromDefinition(config, definition);
    }
}

export type ConverterObject = {
    convert: RouteParameterConverter;
};

export type ParameterConverter =
    | RouteParameterConverter
    | ConverterObject
    | Constructable<ConverterObject>;

const booleanConverter = value => {
    if (value === void 0 || value === null) {
        return false;
    }

    switch (value.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
            return true;
        default:
            return false;
    }
};

const defaultConverters = {
    number: value => (value === void 0 ? NaN : parseFloat(value)),
    float: value => (value === void 0 ? NaN : parseFloat(value)),
    int: value => (value === void 0 ? NaN : parseInt(value)),
    integer: value => (value === void 0 ? NaN : parseInt(value)),
    Date: value => (value === void 0 ? new Date(Date.now()) : new Date(value)),
    boolean: booleanConverter,
    bool: booleanConverter,
};

export class RouteCollection<TSettings = any> {
    private _recognizer: RouteRecognizer<TSettings> | null = null;
    private pathToCommand = new Map<string, NavigationCommand>();
    private fallbackCommand: NavigationCommand | null = null;
    private fallbackSettings: TSettings | null = null;
    private converters: Record<string, RouteParameterConverter> = {};

    public constructor(private owner: RouterConfiguration) {}

    private get recognizer() {
        if (this._recognizer === null) {
            this._recognizer = this.owner.createRouteRecognizer();
        }

        return this._recognizer;
    }

    public ignore(definitionOrString: IgnorableRouteDefinition<TSettings> | string) {
        if (typeof definitionOrString === "string") {
            definitionOrString = { path: definitionOrString };
        }

        this.pathToCommand.set(definitionOrString.path, new Ignore());
        this.recognizer.add(definitionOrString, definitionOrString.settings);
    }

    public map(...routes: MappableRouteDefinition<TSettings>[]) {
        for (const route of routes) {
            if ("children" in route) {
                const titleBuilder = this.owner.createTitleBuilder();
                const childRoutes = route.children.map(x => {
                    const childRoute = {
                        ...route,
                        ...x,
                        path: `${route.path}/${x.path}`,
                    };

                    if ("title" in route || "title" in x) {
                        const parentTitle = (route as HasTitle).title || "";
                        const childTitle = (x as HasTitle).title || "";
                        (childRoute as HasTitle).title = titleBuilder.joinTitles(
                            parentTitle,
                            childTitle
                        );
                    }

                    if ("name" in x) {
                        const parentName = route.name ? route.name + "/" : "";
                        childRoute.name = parentName + x.name;
                    }

                    if (childRoute.children === route.children) {
                        delete (childRoute as any).children;
                    }

                    return childRoute;
                });

                this.map(...childRoutes);
                continue;
            }

            let command: NavigationCommand;

            if ("command" in route) {
                command = route.command;
            } else if ("redirect" in route) {
                command = new Redirect(route.redirect);
            } else {
                command = Render.fromDefinition(this.owner, route);
            }

            this.pathToCommand.set(route.path, command);
            this.recognizer.add(route, route.settings);

            if ("childRouters" in route && route.childRouters) {
                const childRouterRoute = {
                    ...route,
                    path: route.path + `/*${childRouteParameter}`,
                };

                this.pathToCommand.set(childRouterRoute.path, command);
                this.recognizer.add(childRouterRoute, childRouterRoute.settings);
            }
        }
    }

    public fallback(
        definitionOrCallback: FallbackRouteDefinition<TSettings> | DefinitionCallback
    ) {
        const owner = this.owner;

        if (typeof definitionOrCallback === "function") {
            this.fallbackCommand = {
                async createContributor(router: Router, route: RecognizedRoute) {
                    const input = await definitionOrCallback();
                    const command = getFallbackCommand(owner, input);
                    return command.createContributor(router, route);
                },
            };
        } else {
            this.fallbackCommand = getFallbackCommand(owner, definitionOrCallback);
        }
    }

    public converter(name: string, converter: ParameterConverter) {
        let normalizedConverter: RouteParameterConverter;

        if ("convert" in converter) {
            normalizedConverter = converter.convert.bind(converter);
        } else if (converter.prototype && "convert" in converter.prototype) {
            normalizedConverter = (value: string | undefined) => {
                const obj = this.owner.construct(
                    converter as Constructable<ConverterObject>
                );
                return obj.convert(value);
            };
        } else {
            normalizedConverter = converter as RouteParameterConverter;
        }

        this.converters[name] = normalizedConverter;
    }

    public async recognize(path: string): Promise<RouteMatch<TSettings> | null> {
        const result = await this.recognizer.recognize(path, this.aggregateConverters());

        if (result !== null) {
            return {
                route: result,
                command: this.pathToCommand.get(result.endpoint.path)!,
            };
        }

        if (this.fallbackCommand !== null) {
            const separated = QueryString.separate(path);
            const queryParams = QueryString.parse(separated.queryString);

            return {
                route: new RecognizedRoute<TSettings>(
                    new Endpoint<TSettings>(
                        new ConfigurableRoute("*", "", false),
                        [],
                        [],
                        this.fallbackSettings
                    ),
                    {},
                    {},
                    queryParams
                ),
                command: this.fallbackCommand,
            };
        }

        return null;
    }

    /**
     * Generate a path and query string from a route name and params object.
     *
     * @param name The name of the route to generate from.
     * @param params The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    public generateFromName(name: string, params: object): string | null {
        return this.recognizer.generateFromName(name, params);
    }

    /**
     * Generate a path and query string from a route path and params object.
     *
     * @param path The path of the route to generate from.
     * @param params The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    public generateFromPath(path: string, params: object): string | null {
        return this.recognizer.generateFromPath(path, params);
    }

    private aggregateConverters() {
        if (this.owner.parent === null) {
            return {
                ...defaultConverters,
                ...this.converters,
            };
        }

        return {
            ...this.owner.parent.routes.aggregateConverters(),
            ...this.converters,
        };
    }
}
