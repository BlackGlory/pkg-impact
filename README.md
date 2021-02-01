# pkg-impact

Know which local packages need to be upgraded.

## Motivation

When you have dozens of interdependent Node.js projects,
upgrading one of them will cause a chain reaction.
It is very difficult to know which packages need to be upgraded,
especially when your packages are published in different registries.

## How does it work?

pkg-impact assumes that all your Node.js projects have one or more common root directories.
pkg-impact traverses all the directories under the root directories,
finds all the directories containing the `package.json` file,
and excludes the directories under `node_modules`, `.git`.
After pkg-impact collects these `package.json` files,
it will print a breadth first list showing the items that need to be upgraded.

## Why not show a dependency graph?

Tried, but I found it is completely unusable for me,
because several of my core packages have dozens of edges,
the dependency graph is not clearer than a list.

## Why not use Renovate/Depfu/Dependabot?

These services are not available for local/private/internal packages,
and they are noisy.

## Install

```sh
npm install -g pkg-impact
# or
yarn global add pkg-impact
```

### Install from source

```sh
yarn install
yarn build
yarn global add "file:$(pwd)"
```

## Usage

```sh
pkg-impact 'the-package-name-you-just-released' <roots...>
```
