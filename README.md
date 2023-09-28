# ABOUT ICON-BUTTON-GENERATOR

This is a AWS Lambda function for generating square PNG file from some popular open source icon packages including Feather, Font Awesome, FluentUI, and Material.

## INSTALLATION

1. `yarn install` or `npm install`.
2. `yarn build`. It will export the icon packages to JS module files in the `/assets` directory.
3. Create a Lambda function, and prepare a layer the the "sharp" package.
4. Update the `deploy.sh` with the correct ARN of your Lambda function.
5. Run `./deploy.sh`.

## CUSTOM ICON PACKAGES

If you want to add or remove icon packages, please first `yarn add` to install, then add the package name to the array in `build.config.json`. Note that the program is built with [@svg-icons](https://www.npmjs.com/org/svg-icons).
