import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import { IManagedClasses } from "../managed-classes";
import Button, {IButtonProps, IButtonClassNameContract} from "./Button";

export default {
    name: "button",
    component: Button,
    data: [
        {
            managedClasses: {
                button: "button"
            },
            children: "Button text"
        }
    ]
} as IGenericExample<IButtonProps & IManagedClasses<IButtonClassNameContract>>;
