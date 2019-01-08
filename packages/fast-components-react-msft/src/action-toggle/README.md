# Action Toggle
*Action toggle* should be used as control on or around an interactive region of the page that affects the region or items within the region. It usually represents a switch between one of two states.

## Usage
Use *action toggle* for specific control around a functional state. Labeling can be done using a glyph and text, but could also contain just a glyph or just text. Make sure the text and glyph clearly represent the expected function. When only a glyph is used to label the button, include a tooltip in a span element following the button element.

The "selectedGlyph" and "unselectedGlyph" props take a function that returns a ReactNode to render the glyph (ie. a [render prop](https://reactjs.org/docs/render-props.html)).  Note that the function should accept a string parameter that is applied as a classname to the top level element of the resulting node.  This classname  will be populated by the *action toggle* component to use an internally generated class ("actionToggle_selectedGlyph" & "actionToggle_unselectedGlyph") to apply to the glyphs for styling. 

## Style guidance
Multiple related *action toggle* controls should be grouped together visually to reinforce their associated functionality. Place the toggle where it is not hidden or obscured in the clutter of the page.

## Accessibility
The *action toggle* utilizes the text found in the "selectedARIALabel" and "unselectedARIALabel" properties to populate an aria-label with the toggled state. This is important when the *action toggle* is configured as glyph-only. Otherwise, a non-sighted user would not have context to the toggle change. If a more verbose description is needed, tooltip is always an option to provide additional context.