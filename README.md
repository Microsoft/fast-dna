# FAST-DNA
Fast, adaptive, secure, and timeless design network architecture.

## Policies
### Contributions
Details including getting start can be found [here](https://github.com/Microsoft/fast-dna/blob/master/CONTRIBUTING.md).

### Code of conduct
Details are located [here](https://github.com/Microsoft/fast-dna/blob/master/CODE_OF_CONDUCT.md).

### Guiding principles and governance
Details around process, expectations, and quality [visit](https://fluentweb.com/prototyping/contribution-policy).

## Getting started
First, clone the repository and `cd` into the project.

Install [lerna](https://github.com/lerna/lerna):
```shell
npm install --global lerna
```

Bootstrap lerna to install all dependencies:
```shell
lerna bootstrap
```

## Commit/merge messages
FAST-DNA takes inspiration from [conventional commits](https://conventionalcommits.org/) and has been modified to meet requirements.

**Accepted title format**: "`<type>(<scope>): <description>`"

Optionally, include more detail in the message with a single blank line between formatted as:
```
<detail>

<attributes>
```

### Types
The following types are supported:
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to the continuous integration configuration files and/or scripts
- **docs**: Documentation only changes
- **feat**: Adding or changing a feature
- **fix**: Fixing an issue / bug
- **perf**: Performance related changes
- **refactor**: Changes that do not address a bug or feature
- **format**: Changes that do not affect the meaning of code
- **test**: Adding or changing tests

### Scopes
This should optionally be used when changes impact an area, feature, or package name. 
- Use component name (e.g.: button, hyperlink)
- Use pattern name (e.g.: banner, additional-information)
- Use page name (e.g.: variable-font)
- Use package name (e.g.: fast-development-site)

### Description
Describe what feature or fix the user gets from this PR.
- Use single line
- Use lowercase
- Use imperative, present tense (e.g.: fix, not fixes)
- Use single sentence without sentence casing and no period at the end

### Detail
Optional detail should be used to provide clarity and context to the description.

### Attributes
Optional attributes should be used to provide additional metadata about the pull request such as issue fixing (fix #19, close #19, resolve #19).

### Pull request commenting
Add a comment with the issue number per the [github closing issue keywords](https://help.github.com/articles/closing-issues-using-keywords/).

Example title
```
feat(button): add a border radius to button
```

Example message detail
```
Sequence indicators markup was moved from being located after the slider markup to at the top for improved accessibility because the screen reader can read all of the slide options individually before interacting with the slider.

fix 915,920
close 213
resolve 429
```