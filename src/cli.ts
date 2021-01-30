#!/usr/bin/env node
import { program } from 'commander'
import { findAllPackages } from './find-all-packages'
import { serve } from './serve'

program
  .name('pkgraph')
  .version(require('../package.json').version)
  .description(require('../package.json').description)
  .arguments('<roots...>')
  .action(async (roots: string[]) => {
    const pkgList: PackageInfo[] = []
    for (const root of roots) {
      pkgList.push(...await findAllPackages(root))
    }

    serve(pkgList)
  })
  .parse()
