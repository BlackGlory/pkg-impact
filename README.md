# pkgraph

Generate a dependency graph for your local Node.js projects.

## Motivation

When you have dozens of interdependent Node.js projects,
upgrading one of them will cause a chain reaction.
It is very difficult to know which packages need to be upgraded,
especially when your packages are published in different registries.

## How it works?

pkgraph assumes that all your Node.js projects have one or more common root directories.
pkgraph traverses all the directories under the root directories,
finds all the directories containing the `package.json` file,
and excludes the directories under `node_modules`.
After pkgraph collects these `package.json` files,
it will generate a dependency graph for these projects.

## Install

```sh
npm install -g pkgraph
# or
yarn global add pkgraph
```

### Install from source

```sh
yarn install
yarn build
yarn global add "file:$(pwd)"
```

## Usage

```sh
pkgraph <root>
```
