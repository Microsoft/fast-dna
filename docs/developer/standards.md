# Standards

The following standards are used by FAST-DNA contributors for consistency across this repository.

## Core principles

* Build for maintainability
* Build for scalability
* Build for performance

## Naming Conventions

* Avoid all abbreviations, except where common industry acronyms
* Use names that are clear and intuitive
* Use semantic names instead of presentational

## Code commenting

* For work to complete later use `// TODO <issue number>: <title>` and file new issue
* For work considered a hack use `// HACK <issue number>: <title>` and file new issue
* Be verbose and do explain what you're doing and why you're doing it
* Use `//` for single line comment blocks
* Use ` /* */` for multiple line comment blocks

## HTML

### Elements

* Use lower case HTML attributes excluding class names as described above
* Use Hungarian notation (e.g. frmShop) for unique identifiers

### JSS (JavaScript Style Sheets) usage

JSS class-name contracts follow a [BEM-like](http://getbem.com/naming/) convention.

BEM for FAST-DNA is slightly modified because dashes (the character used to delimit *modifiers*) cannot be used as JavaScript object keys without using string literals. So, underscores are used instead. A single underscore separates an element from a block while two underscores separate a modifier from a block or element.

FAST-DNA example

```html
block_element__modifier
```

Within a block, element, or modifier, words should be camelCased

```html
anotherBlock_anotherElement__anotherModifier
```