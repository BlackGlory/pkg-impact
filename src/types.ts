export interface PackageInfo {
  moduleName: string
  rootDir: string
  dependencies: Set<string>
}
