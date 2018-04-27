import * as React from "react";

export interface IObjectNoRequired {
    number?: number;
}

export interface IObjectWithRequired {
    boolean: boolean;
}

export interface IOptionalObjectWithRequired {
    string: string;
}

export interface IOptionalObjectNoRequired {
    boolean?: boolean;
}

export interface IObjectsProps {
    objectNoRequired: IObjectNoRequired;
    objectWithRequired: IObjectWithRequired;
    optionalObjectWithRequired: IOptionalObjectWithRequired;
    optionalObjectNoRequired: IOptionalObjectNoRequired;
}

export default class Objects extends React.Component<IObjectsProps, {}> {

    public render(): JSX.Element {
        return (
            <div>
                <div id="objectNoRequired">
                    {this.props.objectNoRequired.number ? this.props.objectNoRequired.number.toString() : null}
                </div>
                <div id="objectWithRequired">
                    {this.props.objectWithRequired.boolean ? this.props.objectWithRequired.boolean.toString() : null}
                </div>
                <div id="optionalObjectNoRequired">
                    {this.renderOptionalObjectNoRequired()}
                </div>
                <div id="optionalObjectWithRequired">
                    {this.renderOptionalObjectWithRequired()}
                </div>
            </div>
        );
    }

    private renderOptionalObjectNoRequired(): string {
        if (this.props.optionalObjectNoRequired && this.props.optionalObjectNoRequired.boolean) {
            return this.props.optionalObjectNoRequired.boolean.toString();
        }
    }

    private renderOptionalObjectWithRequired(): string {
        if (this.props.optionalObjectWithRequired && this.props.optionalObjectWithRequired.string) {
            return this.props.optionalObjectWithRequired.string;
        }
    }
}
