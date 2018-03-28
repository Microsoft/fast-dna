 export type ClassNames<T> = {
    /**
     * A given class name generated by JSS
     */
    [className in keyof T]: string;
};

/**
 * The interface for class names passed as props
 */
export interface IManagedClasses<T> {
    managedClasses: ClassNames<T>;
}