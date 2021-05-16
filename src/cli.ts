#!/usr/bin/env node
import { program } from 'commander'
import { findAllLocalPackages } from './find-all-local-packages'
import { findImpactedPackages } from './find-impacted-packages'
import { IPackageInfo } from './types'
import { HashSet } from '@blackglory/structures'
import { toArray } from 'iterable-operator'

program
  .name(require('../package.json').name)
  .version(require('../package.json').version)
  .description(require('../package.json').description)
  .option('--include-dev', 'check devDependencies')
  .arguments('<releasedPackage> <roots...>')
  .action(async (releasedPackage, roots: string[]) => {
    const opts = program.opts()
    const includeDev: boolean = opts.includeDev

    const localPkgs = new HashSet<IPackageInfo>(x => x.moduleName + x.rootDir)
    for (const root of roots) {
      for (const pkg of await findAllLocalPackages(root)) {
        localPkgs.add(pkg)
      }
    }

    const pkgs = findImpactedPackages(
      toArray(localPkgs)
    , releasedPackage
    , { includeDev }
    )
    pkgs.forEach(x => console.log(x.moduleName))
  })
  .parse()
