#!/usr/bin/env node
import { program } from 'commander'
import { findAllPackages } from './find-all-packages'
import { PackageInfo } from './parse-package-json'

program
  .name('pkgraph')
  .version(require('../package.json').version)
  .description(require('../package.json').description)
  .arguments('<roots...>')
  .action(async (roots: string[]) => {
    const pkgs: PackageInfo[] = []
    for (const root of roots) {
      pkgs.push(...await findAllPackages(root))
    }

    const modules = new Set<string>()
    for (const pkg of pkgs) {
      modules.add(pkg.moduleName)
    }

    for (const pkg of pkgs) {
      for (const module of pkg.dependencies.keys()) {
        if (!modules.has(module)) pkg.dependencies.delete(module)
      }
    }

    console.log(pkgs)
  })
  .parse()
