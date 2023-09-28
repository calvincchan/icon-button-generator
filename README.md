# Icon Button Generator

This is a AWS Lambda function for generating square PNG file from some popular open source icon packages such as Feather, Font Awesome, FluentUI, and Material.

## Getting Started

1. `yarn install` or `npm install`.
2. `yarn build`. It will export the icon packages to JS module files in the `/assets` directory.
3. Create a Lambda function, and prepare a layer the the "sharp" package.
4. Update the `deploy.sh` with the correct ARN of your Lambda function.
5. Run `./deploy.sh`.

## Usage

For example, assuming you deployed the function to `https://somewhere.on.aws`.

Invoke the function with a HTTP GET
https://somewhere.on.aws?package=material-outlined&icon=star to get a PNG file of "material-outlined" package "star" icon.

The following are a list of all parameters:

#### `package`

Name of the icon package. Default packages:

- `fa-regular`
- `feather`
- `fluentui-system-regular`
- `material-outlined`

To add other icon packages, see [Customize Icon Packages](#customize-icon-packages) section below.

#### `icon`

Name of the icon.

#### `size`

Number of pixel for the width and height. Default 400.

#### `zoom`

Default is 1. To make the icon smaller, you can use decimal numbers such as 0.8 or 0.5.

#### `background`

Background color in hex color code (RRGGBB) with optional alpha channel (RRGGBBAA).

#### `color`

Foreground color in hex color code (RRGGBB) with optional alpha channel (RRGGBBAA).

## Customize Icon Packages

To add or remove icon packages:

1. First `yarn add` to install them. Note that this program only accepts packages from [@svg-icons](https://www.npmjs.com/org/svg-icons).
2. Add the package names to the array in `build.config.json`.
3. Run `yarn build` then deploy to Lambda.
