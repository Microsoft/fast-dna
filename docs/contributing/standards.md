---
id: standards
title: Contributing
sidebar_label: Standards
---

# Standards

The following standards are used by FAST-DNA contributors for consistency across this repository.

## Naming Conventions

* Avoid all abbreviations, except where common industry acronyms
* Use names that are clear and intuitive
* Use semantic names instead of presentational

## Accessibility

FAST-DNA has worked diligently from the ground up to enable accessibility in collaboration with legal, accessibility, and marketing teams at Microsoft. As an ecosystem to accelerate the building of Web sites and apps we ensure you have the tools to build accessible user exerpiences.

To learn more about Microsoft's commitment visit their [accessibility](https://www.microsoft.com/en-us/accessibility) website.

### Animation

* End users should have a mechanism to reduce or remove animations from their experience. The Safari devs have proposed a media query for reduced animation. ("prefers-reduced-motion")
* Some users with vestibular disorders or other cognitive disabilities have problems with movement. A safe fallback for nearly all users is fade animations.
* Flashing animations can cause seizures and should be avoided. Good data on the accessibility of animation is scarce.

## JSS (JavaScript Style Sheets) usage

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