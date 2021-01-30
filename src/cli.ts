#!/usr/bin/env node
import { program } from 'commander'
import { findAllLocalPackages } from './find-all-local-packages'
import { findAllImpactedLocalPackages } from './find-all-impacted-packages'
import { PackageInfo } from './types'
import { HashSet } from '@blackglory/structures'

program
  .name(require('../package.json').name)
  .version(require('../package.json').version)
  .description(require('../package.json').description)
  .arguments('<releasedPackage> <roots...>')
  .action(async (releasedPackage, roots: string[]) => {
    const localPkgs = new HashSet<PackageInfo>(x => x.moduleName + x.rootDir)
    for (const root of roots) {
      for (const pkg of await findAllLocalPackages(root)) {
        localPkgs.add(pkg)
      }
    }

    const pkgs = findAllImpactedLocalPackages(releasedPackage, Array.from(localPkgs))
    pkgs.forEach(x => console.log(x.moduleName))
  })
  .parse()
