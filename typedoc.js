module.exports = {
  src: ['./src/'],
  mode: 'file',
  out: './apidocs',
  exclude: ['**/src/list/**', '**/src/util/imageExtractInfoTypes.ts', '**/src/util/misc.ts'],
  excludeExternals: true,
  excludeNotExported: true,
  excludeProtected: true,
  excludePrivate: true, 
  readme: 'src/README.md',
}