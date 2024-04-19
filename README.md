![npm](https://img.shields.io/npm/dm/sitecore-cdp-serializer)
[![npm version](https://badge.fury.io/js/sitecore-cdp-serializer.svg)](https://badge.fury.io/js/sitecore-cdp-serializer)

# Installation

Sitecore CDP serializer requires [Node.js](https://nodejs.org) version 16.17 or above. To install, run the following commands from any directory in your terminal:

```bash
npm install sitecore-cdp-serializer -g
```

When using the CLI in a CI environment we recommend installing it locally as a development dependency, instead of globally. To install locally, run the following command from the root directory of your project:

```bash
npx install --save-dev sitecore-cdp-serializer
```

**Important:** Running `npm install sitecore-cdp-serializer -g` in CI means you're always installing the latest version of the tool, including breaking changes. When you install locally and use a [lock file](https://docs.npmjs.com/cli/v7/commands/npm-ci) you guarantee reproducible builds.

<br />

# Commands

## [api](/docs/commands/api.md)

Run Sitecore CDP/Personalize API's.

## [deploy](/docs/commands/deploy.md)

Commands to pick up local artifacts and deploy to a Sitecore CDP/Personalize tenant.

<br />

# Local Development

You can get setup for local development by cloning the repository and running the following commands:

```bash
npm install

npm run dev
```

This will start the app in the current terminal window, where changes to the current files, will be reflected immediately in the app using `tsup`. You can then start a separate terminal to run commands using the local version of the app. For example:

```bash
node dist/index.js auth status
```
