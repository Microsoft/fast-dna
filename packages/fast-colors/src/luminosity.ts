import Chroma from "chroma-js";

/**
 * Type definition for a luminosity switch
 */
export type LuminositySwitch = (a: any, b: any) => any;

/**
 * Adjust a color to a specific luminosity. This function is almost a direct copy of
 * https://github.com/gka/chroma.js/blob/master/src/io/luminance.coffee, except that
 * it accepts a rounding function. This is necessary to prevent contrast ratios being slightly below
 * their target due to rounding RGB channel values the wrong direction.
 */
export function luminance(targetLuminance: number, sourceColor: Chroma, round?: (value: number) => number): number[] {
    const sourceLuminosity: number = sourceColor.luminance();
    let maxItterations: number = 20;
    let color: any = sourceLuminosity > targetLuminance
        ? adjustLuminance(Chroma("black"), sourceColor, targetLuminance, maxItterations)
        : adjustLuminance(sourceColor, Chroma("white"), targetLuminance, maxItterations);

    if (typeof round === "function") {
        color = Chroma(color.rgb(false).map(round));
    }

    return color.rgba();
}

/**
 * Recursive function to adjust the luminosity value of a color
 */
function adjustLuminance(low: Chroma, high: Chroma, targetLuminance: number, itterations: number): any {
    const middle: Chroma = low.interpolate(high, 0.5, "rgb");
    const fidelity: number = 1e-7;
    const middleLuminosity: number = middle.luminance();
    itterations -= 1;

    return (Math.abs(targetLuminance - middleLuminosity) < fidelity || itterations < 1)
        ? middle
        : middleLuminosity > targetLuminance
        ? adjustLuminance(low, middle, targetLuminance, itterations)
        : adjustLuminance(middle, high, targetLuminance, itterations);
}

/**
 * Returns a function that selects one of two arguments based on the value of luminance inputs.
 */
export function luminanceSwitch(foregroundLuminance: number, backgroundLuminance: number): LuminositySwitch {
    return (a: any, b: any): any => {
        const difference: number = foregroundLuminance - backgroundLuminance;

        return difference < 0 || (difference === 0 && foregroundLuminance > .5) ? b : a;
    };
}
