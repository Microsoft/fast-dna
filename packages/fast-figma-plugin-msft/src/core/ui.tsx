import React from "react";
import { RecipeData, PluginNodeData } from "./node";

export interface PluginUIEditableRecipeData {
    name: keyof PluginNodeData;
    label: string;
    options: RecipeData[];
}

export interface PluginUISelectedNodeData extends Partial<PluginNodeData> {
    id: string;
    type: string;
}

export type PluginUIEditablePropertyData = PluginUIEditableRecipeData;

export interface PluginUIProps extends Omit<PluginNodeData, "designSystem"> {
    selectedNodes: PluginUISelectedNodeData[];
}

export class PluginUI extends React.Component<PluginUIProps> {
    public static defaultProps: PluginUIProps = {
        selectedNodes: [],
        backgroundFills: [],
        strokeFills: [],
        textFills: [],
    };

    public render(): JSX.Element {
        return <pre>{JSON.stringify(this.props, null, 2)}</pre>;
    }
}
