
wasm-imagemagick reference API
==============================

Getting started
---------------

Let's consider the following [execute](https://github.com/KnicKnic/WASM-ImageMagick/tree/master/apidocs#execute) call:

```ts
const { outputFiles, exitCode, stderr} = await execute({
  inputFiles: [await buildInputFile('fn.png', 'image1.png')],
  commands: `
    convert image1.png -bordercolor #ffee44 -background #eeff55 +polaroid image2.png
    convert image2.png -fill #997711 -tint 55 image3.jpg
`
})
if (exitCode) {
  alert(`There was an error with the command: ${stderr.join('\n')}`)
}
else {
  await loadImageElement(outputFiles[1], document.querySelector('#outputImage'))
}
```

*   See [execute](https://github.com/KnicKnic/WASM-ImageMagick/tree/master/apidocs#execute) and [executeAndReturnOutputFile](#executeandreturnoutputfile) for information on how to execute commands. Also [ExecuteResult](interfaces/executeresult.md) and [ExecuteConfig](interfaces/executeconfig.md).
    
*   See [ExecuteCommand](#executecommand) for information about command syntaxes supported. Some utilities related to commands are [asCommand](#ascommand), [cliToArray](#clitoarray), [arrayToCli](#arraytocli)
    
*   See [MagickInputFile](interfaces/magickinputfile.md), [MagickOutputFile](interfaces/magickoutputfile.md) for information about image magick files.
    
    *   Some utilities related to files are [buildInputFile](#buildinputfile), [asInputFile](#asinputfile), [asOutputFile](#asoutputfile), [loadImageElement](#loadimageelement), [getInputFilesFromHtmlInputElement](#getinputfilesfromhtmlinputelement)
*   See [call](#call) for the low level command execution API
    
*   Some utilities related to images are: [compare](#compare), [extractInfo](#extractinfo), [getBuiltInImages](#getbuiltinimages)
    
*   Some utilities related to image and execution management are [ImageHome](interfaces/imagehome.md), [ExecutionContext](interfaces/executioncontext.md)

## Index

### Interfaces

* [CallEvent](interfaces/callevent.md)
* [CallListener](interfaces/calllistener.md)
* [CallResult](interfaces/callresult.md)
* [CommandPreprocessor](interfaces/commandpreprocessor.md)
* [ExecuteConfig](interfaces/executeconfig.md)
* [ExecuteResult](interfaces/executeresult.md)
* [ExecutionContext](interfaces/executioncontext.md)
* [ImageHome](interfaces/imagehome.md)
* [MagickFile](interfaces/magickfile.md)
* [MagickInputFile](interfaces/magickinputfile.md)
* [MagickOutputFile](interfaces/magickoutputfile.md)
* [VirtualCommand](interfaces/virtualcommand.md)
* [VirtualCommandContext](interfaces/virtualcommandcontext.md)

### Type aliases

* [CallCommand](#callcommand)
* [Command](#command)
* [ExecuteCommand](#executecommand)
* [VirtualCommandLogs](#virtualcommandlogs)

### Variables

* [_knownSupportedImageFormatsInFolderForTest](#_knownsupportedimageformatsinfolderfortest)
* [_variableDeclarations](#_variabledeclarations)
* [builtInImageNames](#builtinimagenames)
* [knownSupportedReadOnlyImageFormats](#knownsupportedreadonlyimageformats)
* [knownSupportedReadWriteImageFormats](#knownsupportedreadwriteimageformats)
* [knownSupportedWriteOnlyImageFormats](#knownsupportedwriteonlyimageformats)

### Functions

* [Call](#call)
* [_dispatchVirtualCommand](#_dispatchvirtualcommand)
* [_newExecuteResult](#_newexecuteresult)
* [_preprocessCommand](#_preprocesscommand)
* [addCallListener](#addcalllistener)
* [arrayToCli](#arraytocli)
* [asCallCommand](#ascallcommand)
* [asCommand](#ascommand)
* [asExecuteConfig](#asexecuteconfig)
* [asInputFile](#asinputfile)
* [asOutputFile](#asoutputfile)
* [blobToString](#blobtostring)
* [buildImageSrc](#buildimagesrc)
* [buildInputFile](#buildinputfile)
* [call](#call)
* [cliToArray](#clitoarray)
* [cliToArrayOne](#clitoarrayone)
* [compare](#compare)
* [compareNumber](#comparenumber)
* [createImageHome](#createimagehome)
* [execute](#execute)
* [executeAndReturnOutputFile](#executeandreturnoutputfile)
* [executeOne](#executeone)
* [extractInfo](#extractinfo)
* [getBuiltInImage](#getbuiltinimage)
* [getBuiltInImages](#getbuiltinimages)
* [getConfigureFolders](#getconfigurefolders)
* [getFileName](#getfilename)
* [getFileNameExtension](#getfilenameextension)
* [getFileNameWithoutExtension](#getfilenamewithoutextension)
* [getInputFilesFromHtmlInputElement](#getinputfilesfromhtmlinputelement)
* [getPixelColor](#getpixelcolor)
* [inputFileToUint8Array](#inputfiletouint8array)
* [isExecuteConfig](#isexecuteconfig)
* [isImage](#isimage)
* [isInputFile](#isinputfile)
* [isMagickFile](#ismagickfile)
* [isOutputFile](#isoutputfile)
* [isVirtualCommand](#isvirtualcommand)
* [loadImageElement](#loadimageelement)
* [newExecutionContext](#newexecutioncontext)
* [readFileAsText](#readfileastext)
* [registerCommandPreprocessor](#registercommandpreprocessor)
* [registerExecuteVirtualCommand](#registerexecutevirtualcommand)
* [removeAllCallListeners](#removeallcalllisteners)
* [resolveCommandSubstitution](#resolvecommandsubstitution)
* [unquote](#unquote)

---

## Type aliases

<a id="callcommand"></a>

###  CallCommand

**Ƭ CallCommand**: *`string`[]*

*Defined in [magickApi.ts:199](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L199)*

___
<a id="command"></a>

###  Command

**Ƭ Command**: *( `string` &#124; `number`)[]*

*Defined in [execute.ts:20](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/execute.ts#L20)*

___
<a id="executecommand"></a>

###  ExecuteCommand

**Ƭ ExecuteCommand**: * [Command](#command)[] &#124; [Command](#command) &#124; `string`
*

*Defined in [execute.ts:60](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/execute.ts#L60)*

Commands could have the following syntaxes:

*   array form like `[['convert', 'foo.png', 'bar.gif'], ['identify', 'bar.gif']]`
*   just one array: `['convert', 'foo.png', 'bar.gif']`
*   command line strings: `['convert foo.png bar.gif', 'idenfity bar.gif']`
*   just one string: `'convert foo.png bar.gif'`

Also, for command line strings, multiple commands can be specified in the same string separating with new lines:

```js
const result = await execute(`
  convert rose: -sharpen 0x1 reconstruct.jpg
  compare rose: reconstruct.jpg difference.png
  compare -compose src rose: reconstruct.jpg difference.png
`)
```

Also, command line strings support breaking the same command in multiple lines by using `\` and adding bash-shell like commands in lines that starts with `#`, like in:

```js
const result = await execute(`
  convert -size 250x100 xc: +noise Random -channel R -threshold .4% \\
    -negate -channel RG -separate +channel \\
    # heads up! this is a comment because the line started with #
    \( +clone \) -compose multiply -flatten \\
    -virtual-pixel Tile -background Black \\
    -blur 0x.6 -motion-blur 0x15-90 -normalize \\
    +distort Polar 0 +repage 'star inward.gif'
`)
```

If you need to escape arguments like file names with spaces, use single quotes `'`, like the output file in the previous example `'star inward.gif'`

___
<a id="virtualcommandlogs"></a>

###  VirtualCommandLogs

**Ƭ VirtualCommandLogs**: *`object`*

*Defined in [executeVirtualCommand/VirtualCommand.ts:18](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/executeVirtualCommand/VirtualCommand.ts#L18)*

#### Type declaration

[virtualCommandName: `string`]: `any`[]

___

## Variables

<a id="_knownsupportedimageformatsinfolderfortest"></a>

### `<Const>` _knownSupportedImageFormatsInFolderForTest

**● _knownSupportedImageFormatsInFolderForTest**: *`string`[]* =  [
  'mat',
]

*Defined in [util/support.ts:60](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/support.ts#L60)*

___
<a id="_variabledeclarations"></a>

### `<Const>` _variableDeclarations

**● _variableDeclarations**: *`object`*

*Defined in [executeVirtualCommand/variableDeclaration.ts:27](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/executeVirtualCommand/variableDeclaration.ts#L27)*

#### Type declaration

[key: `number`]: `object`

[varName: `string`]: `string`

___
<a id="builtinimagenames"></a>

### `<Const>` builtInImageNames

**● builtInImageNames**: *`string`[]* =  ['rose:', 'logo:', 'wizard:', 'granite:', 'netscape:']

*Defined in [util/imageBuiltIn.ts:5](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/imageBuiltIn.ts#L5)*

___
<a id="knownsupportedreadonlyimageformats"></a>

### `<Const>` knownSupportedReadOnlyImageFormats

**● knownSupportedReadOnlyImageFormats**: *`string`[]* =  [
  // 'pix',
  'mat',
]

*Defined in [util/support.ts:55](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/support.ts#L55)*

list of image formats that are known to be supported by wasm-imagemagick but only for read operation. See `spec/formatSpec.ts`

___
<a id="knownsupportedreadwriteimageformats"></a>

### `<Const>` knownSupportedReadWriteImageFormats

**● knownSupportedReadWriteImageFormats**: *`string`[]* =  [
  'jpg', 'png',
  'psd',
  // 'webp',// should be working but it's not : ImageMagick/coders/webp.c
  'tiff', 'xcf', 'gif', 'bmp', 'tga', 'miff', 'ico', 'dcm', 'xpm', 'pcx',
  'fits',
  'ppm',
  'pgm',
  'pfm',
  'mng',
  'hdr',
  'dds', // generated using convert -define "dds:compression={dxt1, dxt5, none}" to_rotate.png  to_rotate.dds
  'otb', // generated using convert to_rotate.png  to_rotate.otb

  'txt', // generated using convert to_rotate.png  to_rotate.txt
  'psb',

  // 'rgb', // fails because  MustSpecifyImageSize `to_rotate.rgb'
]

*Defined in [util/support.ts:22](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/support.ts#L22)*

list of image formats that are known to be supported by wasm-imagemagick both for read and write. See `spec/formatSpec.ts`

___
<a id="knownsupportedwriteonlyimageformats"></a>

### `<Const>` knownSupportedWriteOnlyImageFormats

**● knownSupportedWriteOnlyImageFormats**: *`string`[]* =  [
  'ps', 'pdf',
  'epdf', // generated using convert to_rotate.png  to_rotate.epdf
  'svg',
  'djvu', // converted from png using online tool
]

*Defined in [util/support.ts:45](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/support.ts#L45)*

list of image formats that are known to be supported by wasm-imagemagick but only for write operation. See `spec/formatSpec.ts`

___

## Functions

<a id="call"></a>

###  Call

▸ **Call**(inputFiles: *[MagickInputFile](interfaces/magickinputfile.md)[]*, command: *`string`[]*): `Promise`<[MagickOutputFile](interfaces/magickoutputfile.md)[]>

*Defined in [magickApi.ts:245](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L245)*

[call](#call) shortcut that only returns the output files.

**Parameters:**

| Name | Type |
| ------ | ------ |
| inputFiles | [MagickInputFile](interfaces/magickinputfile.md)[] |
| command | `string`[] |

**Returns:** `Promise`<[MagickOutputFile](interfaces/magickoutputfile.md)[]>

___
<a id="_dispatchvirtualcommand"></a>

###  _dispatchVirtualCommand

▸ **_dispatchVirtualCommand**(context: *[VirtualCommandContext](interfaces/virtualcommandcontext.md)*): `Promise`<[ExecuteResult](interfaces/executeresult.md)>

*Defined in [executeVirtualCommand/VirtualCommand.ts:32](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/executeVirtualCommand/VirtualCommand.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| context | [VirtualCommandContext](interfaces/virtualcommandcontext.md) |

**Returns:** `Promise`<[ExecuteResult](interfaces/executeresult.md)>

___
<a id="_newexecuteresult"></a>

###  _newExecuteResult

▸ **_newExecuteResult**(c: *[VirtualCommandContext](interfaces/virtualcommandcontext.md)*, result?: *`Partial`<[ExecuteResult](interfaces/executeresult.md)>*): [ExecuteResult](interfaces/executeresult.md)

*Defined in [executeVirtualCommand/VirtualCommand.ts:54](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/executeVirtualCommand/VirtualCommand.ts#L54)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| c | [VirtualCommandContext](interfaces/virtualcommandcontext.md) | - |
| `Default value` result | `Partial`<[ExecuteResult](interfaces/executeresult.md)> |  {} |

**Returns:** [ExecuteResult](interfaces/executeresult.md)

___
<a id="_preprocesscommand"></a>

###  _preprocessCommand

▸ **_preprocessCommand**(config: *[ExecuteConfig](interfaces/executeconfig.md)*): [ExecuteConfig](interfaces/executeconfig.md)

*Defined in [executeCommandPreprocessor.ts:12](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/executeCommandPreprocessor.ts#L12)*

internal - executes all registered preprocessors on given config

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [ExecuteConfig](interfaces/executeconfig.md) |

**Returns:** [ExecuteConfig](interfaces/executeconfig.md)

___
<a id="addcalllistener"></a>

###  addCallListener

▸ **addCallListener**(l: *[CallListener](interfaces/calllistener.md)*): `void`

*Defined in [magickApi.ts:273](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L273)*

Register a global `call()` listener that will be notified on any command call and when any stdout/stderr occurs

**Parameters:**

| Name | Type |
| ------ | ------ |
| l | [CallListener](interfaces/calllistener.md) |

**Returns:** `void`

___
<a id="arraytocli"></a>

###  arrayToCli

▸ **arrayToCli**(command: * [Command](#command) &#124; [Command](#command)[]*): `string`

*Defined in [util/cli.ts:26](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/cli.ts#L26)*

Generates a valid command line string from given `string[]` that is compatible with [call](#call). Works with multiple commands by separating them with new lines and support comand splitting in new lines using `\`. See [ExecuteCommand](#executecommand) for more information.

**Parameters:**

| Name | Type |
| ------ | ------ |
| command |  [Command](#command) &#124; [Command](#command)[]|

**Returns:** `string`

___
<a id="ascallcommand"></a>

###  asCallCommand

▸ **asCallCommand**(c: *[ExecuteCommand](#executecommand)*): [CallCommand](#callcommand)

*Defined in [execute.ts:22](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/execute.ts#L22)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| c | [ExecuteCommand](#executecommand) |

**Returns:** [CallCommand](#callcommand)

___
<a id="ascommand"></a>

###  asCommand

▸ **asCommand**(c: *[ExecuteCommand](#executecommand)*): [Command](#command)[]

*Defined in [util/cli.ts:98](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/cli.ts#L98)*

TODO: move to execute.ts Makes sure that given [ExecuteCommand](#executecommand), in whatever syntax, is transformed to the form `string[][]` that is compatible with [call](#call)

**Parameters:**

| Name | Type |
| ------ | ------ |
| c | [ExecuteCommand](#executecommand) |

**Returns:** [Command](#command)[]

___
<a id="asexecuteconfig"></a>

###  asExecuteConfig

▸ **asExecuteConfig**(configOrCommandOrFiles: * [ExecuteConfig](interfaces/executeconfig.md) &#124; [ExecuteCommand](#executecommand) &#124; [MagickInputFile](interfaces/magickinputfile.md)[]*, command?: *[ExecuteCommand](#executecommand)*): [ExecuteConfig](interfaces/executeconfig.md)

*Defined in [execute.ts:95](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/execute.ts#L95)*

Transform `configOrCommand: ExecuteConfig | ExecuteCommand` to a valid ExecuteConfig object

**Parameters:**

| Name | Type |
| ------ | ------ |
| configOrCommandOrFiles |  [ExecuteConfig](interfaces/executeconfig.md) &#124; [ExecuteCommand](#executecommand) &#124; [MagickInputFile](interfaces/magickinputfile.md)[]|
| `Optional` command | [ExecuteCommand](#executecommand) |

**Returns:** [ExecuteConfig](interfaces/executeconfig.md)

___
<a id="asinputfile"></a>

###  asInputFile

▸ **asInputFile**(f: *[MagickFile](interfaces/magickfile.md)*, name?: *`string`*): `Promise`<[MagickInputFile](interfaces/magickinputfile.md)>

*Defined in [util/file.ts:96](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/file.ts#L96)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| f | [MagickFile](interfaces/magickfile.md) | - |
| `Default value` name | `string` |  f.name |

**Returns:** `Promise`<[MagickInputFile](interfaces/magickinputfile.md)>

___
<a id="asoutputfile"></a>

###  asOutputFile

▸ **asOutputFile**(f: *[MagickFile](interfaces/magickfile.md)*, name?: *`string`*): `Promise`<[MagickOutputFile](interfaces/magickoutputfile.md)>

*Defined in [util/file.ts:108](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/file.ts#L108)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| f | [MagickFile](interfaces/magickfile.md) | - |
| `Default value` name | `string` |  f.name |

**Returns:** `Promise`<[MagickOutputFile](interfaces/magickoutputfile.md)>

___
<a id="blobtostring"></a>

###  blobToString

▸ **blobToString**(blb: *`Blob`*): `Promise`<`string`>

*Defined in [util/file.ts:15](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/file.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blb | `Blob` |

**Returns:** `Promise`<`string`>

___
<a id="buildimagesrc"></a>

###  buildImageSrc

▸ **buildImageSrc**(image: *[MagickFile](interfaces/magickfile.md)*, forceBrowserSupport?: *`boolean`*): `Promise`<`string`>

*Defined in [util/html.ts:23](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/html.ts#L23)*

Return a string with the inline image content, suitable to be used to assign to an html img src attribute. See [loadImageElement](#loadimageelement).

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| image | [MagickFile](interfaces/magickfile.md) | - |
| `Default value` forceBrowserSupport | `boolean` | false |  if true and the image extension is not supported by browsers, it will convert the image to png and return that src so it can be shown in browsers |

**Returns:** `Promise`<`string`>

___
<a id="buildinputfile"></a>

###  buildInputFile

▸ **buildInputFile**(url: *`string`*, name?: *`string`*): `Promise`<[MagickInputFile](interfaces/magickinputfile.md)>

*Defined in [util/file.ts:66](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/file.ts#L66)*

Builds a new [MagickInputFile](interfaces/magickinputfile.md) by fetching the content of given url and optionally naming the file using given name or extracting the file name from the url otherwise. It will throw the response object in case there's an error,

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| url | `string` | - |
| `Default value` name | `string` |  getFileName(url) |

**Returns:** `Promise`<[MagickInputFile](interfaces/magickinputfile.md)>

___
<a id="call"></a>

###  call

▸ **call**(inputFiles: *[MagickInputFile](interfaces/magickinputfile.md)[]*, command: *[CallCommand](#callcommand)*): `Promise`<[CallResult](interfaces/callresult.md)>

*Defined in [magickApi.ts:206](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L206)*

Low level, core, IM command execution function. All the other functions like [execute](https://github.com/KnicKnic/WASM-ImageMagick/tree/master/apidocs#execute) ends up calling this one. It accept only one command and only in the form of array of strings.

**Parameters:**

| Name | Type |
| ------ | ------ |
| inputFiles | [MagickInputFile](interfaces/magickinputfile.md)[] |
| command | [CallCommand](#callcommand) |

**Returns:** `Promise`<[CallResult](interfaces/callresult.md)>

___
<a id="clitoarray"></a>

###  cliToArray

▸ **cliToArray**(cliCommand: *`string`*): [Command](#command)[]

*Defined in [util/cli.ts:73](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/cli.ts#L73)*

Generates a command in the form of `string[][]` that is compatible with [call](#call) from given command line string. This works for strings containing multiple commands in different lines. and also respect `\` character for continue the same command in a new line. See [ExecuteCommand](#executecommand) for more information.

**Parameters:**

| Name | Type |
| ------ | ------ |
| cliCommand | `string` |

**Returns:** [Command](#command)[]

___
<a id="clitoarrayone"></a>

###  cliToArrayOne

▸ **cliToArrayOne**(cliCommand: *`string`*): [Command](#command)

*Defined in [util/cli.ts:34](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/cli.ts#L34)*

Generates a command in the form of array of strings, compatible with [call](#call) from given command line string . The string must contain only one command (no newlines).

**Parameters:**

| Name | Type |
| ------ | ------ |
| cliCommand | `string` |

**Returns:** [Command](#command)

___
<a id="compare"></a>

###  compare

▸ **compare**(img1: * [MagickFile](interfaces/magickfile.md) &#124; [MagickFile](interfaces/magickfile.md)[] &#124; `string`*, img2?: * [MagickFile](interfaces/magickfile.md) &#124; `string`*, fuzz?: *`number`*): `Promise`<`boolean`>

*Defined in [util/imageCompare.ts:6](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/imageCompare.ts#L6)*

Compare the two images and return true if they are equal visually. Optionally, a margin of error can be provided using `fuzz`

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| img1 |  [MagickFile](interfaces/magickfile.md) &#124; [MagickFile](interfaces/magickfile.md)[] &#124; `string`| - |
| `Optional` img2 |  [MagickFile](interfaces/magickfile.md) &#124; `string`| - |
| `Default value` fuzz | `number` | 0.015 |

**Returns:** `Promise`<`boolean`>

___
<a id="comparenumber"></a>

###  compareNumber

▸ **compareNumber**(img1: * [MagickFile](interfaces/magickfile.md) &#124; `string`*, img2: * [MagickFile](interfaces/magickfile.md) &#124; `string`*): `Promise`<`number`>

*Defined in [util/imageCompare.ts:15](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/imageCompare.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| img1 |  [MagickFile](interfaces/magickfile.md) &#124; `string`|
| img2 |  [MagickFile](interfaces/magickfile.md) &#124; `string`|

**Returns:** `Promise`<`number`>

___
<a id="createimagehome"></a>

###  createImageHome

▸ **createImageHome**(): `ImageHomeImpl`

*Defined in [imageHome.ts:81](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/imageHome.ts#L81)*

**Returns:** `ImageHomeImpl`

___
<a id="execute"></a>

###  execute

▸ **execute**(configOrCommandOrFiles: * [ExecuteConfig](interfaces/executeconfig.md) &#124; [ExecuteCommand](#executecommand) &#124; [MagickInputFile](interfaces/magickinputfile.md)[]*, command?: *[ExecuteCommand](#executecommand)*): `Promise`<[ExecuteResult](interfaces/executeresult.md)>

*Defined in [execute.ts:176](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/execute.ts#L176)*

Execute all commands in given config serially in order. Output files from a command become available as input files in next commands. In the following example we execute two commands. Notice how the second one uses `image2.png` which was the output file of the first one:

```ts
const { outputFiles, exitCode, stderr} = await execute({
  inputFiles: [await buildInputFile('fn.png', 'image1.png')],
  commands: `
    convert image1.png -bordercolor #ffee44 -background #eeff55 +polaroid image2.png
    convert image2.png -fill #997711 -tint 55 image3.jpg
`
})
if (exitCode) {
  alert(`There was an error with the command: ${stderr.join('\n')}`)
}
else {
  await loadImageElement(outputFiles.find(f => f.name==='image3.jpg'), document.getElementById('outputImage'))
}
```

Another varlid signature is passing input files and commands as parameters:

```ts
const { outputFiles, exitCode, stderr} = await execute([await buildInputFile('foo.png'], 'convert foo.png foo.jpg')
```

Another valid signature is just providing the command when there there is no need for input files:

```ts
const { outputFiles, exitCode, stderr} = await execute('identify rose:')
```

See [ExecuteCommand](#executecommand) for different command syntax supported.

See [ExecuteResult](interfaces/executeresult.md) for details on the object returned

**Parameters:**

| Name | Type |
| ------ | ------ |
| configOrCommandOrFiles |  [ExecuteConfig](interfaces/executeconfig.md) &#124; [ExecuteCommand](#executecommand) &#124; [MagickInputFile](interfaces/magickinputfile.md)[]|
| `Optional` command | [ExecuteCommand](#executecommand) |

**Returns:** `Promise`<[ExecuteResult](interfaces/executeresult.md)>

___
<a id="executeandreturnoutputfile"></a>

###  executeAndReturnOutputFile

▸ **executeAndReturnOutputFile**(configOrCommand: * [ExecuteConfig](interfaces/executeconfig.md) &#124; [ExecuteCommand](#executecommand) &#124; [MagickInputFile](interfaces/magickinputfile.md)[]*, command?: *[ExecuteCommand](#executecommand)*): `Promise`< [MagickOutputFile](interfaces/magickoutputfile.md) &#124; `undefined`>

*Defined in [execute.ts:121](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/execute.ts#L121)*

`execute()` shortcut that return directly the first output file or undefined if none or error occur

**Parameters:**

| Name | Type |
| ------ | ------ |
| configOrCommand |  [ExecuteConfig](interfaces/executeconfig.md) &#124; [ExecuteCommand](#executecommand) &#124; [MagickInputFile](interfaces/magickinputfile.md)[]|
| `Optional` command | [ExecuteCommand](#executecommand) |

**Returns:** `Promise`< [MagickOutputFile](interfaces/magickoutputfile.md) &#124; `undefined`>

___
<a id="executeone"></a>

###  executeOne

▸ **executeOne**(configOrCommand: * [ExecuteConfig](interfaces/executeconfig.md) &#124; [ExecuteCommand](#executecommand) &#124; [MagickInputFile](interfaces/magickinputfile.md)[]*, execCommand?: *[ExecuteCommand](#executecommand)*): `Promise`<[CallResult](interfaces/callresult.md)>

*Defined in [execute.ts:67](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/execute.ts#L67)*

Execute first command in given config.
*__see__*: [execute](https://github.com/KnicKnic/WASM-ImageMagick/tree/master/apidocs#execute) for full documentation on accepted signatures

**Parameters:**

| Name | Type |
| ------ | ------ |
| configOrCommand |  [ExecuteConfig](interfaces/executeconfig.md) &#124; [ExecuteCommand](#executecommand) &#124; [MagickInputFile](interfaces/magickinputfile.md)[]|
| `Optional` execCommand | [ExecuteCommand](#executecommand) |

**Returns:** `Promise`<[CallResult](interfaces/callresult.md)>

___
<a id="extractinfo"></a>

###  extractInfo

▸ **extractInfo**(img: * [MagickFile](interfaces/magickfile.md) &#124; `string`*): `Promise`<`ExtractInfoResult`[]>

*Defined in [util/imageExtractInfo.ts:8](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/imageExtractInfo.ts#L8)*

Execute `convert $IMG info.json` to extract image metadata. Returns the parsed info.json file contents

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| img |  [MagickFile](interfaces/magickfile.md) &#124; `string`|  could be a string in case you want to extract information about built in images like \`rose:\` |

**Returns:** `Promise`<`ExtractInfoResult`[]>

___
<a id="getbuiltinimage"></a>

###  getBuiltInImage

▸ **getBuiltInImage**(name: *`string`*): `Promise`<[MagickInputFile](interfaces/magickinputfile.md)>

*Defined in [util/imageBuiltIn.ts:25](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/imageBuiltIn.ts#L25)*

shortcut of [getBuiltInImages](#getbuiltinimages) to get a single image by name

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |

**Returns:** `Promise`<[MagickInputFile](interfaces/magickinputfile.md)>

___
<a id="getbuiltinimages"></a>

###  getBuiltInImages

▸ **getBuiltInImages**(): `Promise`<[MagickInputFile](interfaces/magickinputfile.md)[]>

*Defined in [util/imageBuiltIn.ts:10](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/imageBuiltIn.ts#L10)*

Gets ImageMagick built-in images like `rose:`, `logo:`, etc in the form of [MagickInputFile](interfaces/magickinputfile.md)s

**Returns:** `Promise`<[MagickInputFile](interfaces/magickinputfile.md)[]>

___
<a id="getconfigurefolders"></a>

###  getConfigureFolders

▸ **getConfigureFolders**(): `Promise`<`string`[]>

*Defined in [util/support.ts:3](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/support.ts#L3)*

**Returns:** `Promise`<`string`[]>

___
<a id="getfilename"></a>

###  getFileName

▸ **getFileName**(url: *`string`*): `string`

*Defined in [util/file.ts:120](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/file.ts#L120)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| url | `string` |

**Returns:** `string`

___
<a id="getfilenameextension"></a>

###  getFileNameExtension

▸ **getFileNameExtension**(filePathOrUrlOrFile: * `string` &#124; [MagickFile](interfaces/magickfile.md)*): `string`

*Defined in [util/file.ts:133](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/file.ts#L133)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| filePathOrUrlOrFile |  `string` &#124; [MagickFile](interfaces/magickfile.md)|

**Returns:** `string`

___
<a id="getfilenamewithoutextension"></a>

###  getFileNameWithoutExtension

▸ **getFileNameWithoutExtension**(filePathOrUrlOrFile: * `string` &#124; [MagickFile](interfaces/magickfile.md)*): `string`

*Defined in [util/file.ts:138](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/file.ts#L138)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| filePathOrUrlOrFile |  `string` &#124; [MagickFile](interfaces/magickfile.md)|

**Returns:** `string`

___
<a id="getinputfilesfromhtmlinputelement"></a>

###  getInputFilesFromHtmlInputElement

▸ **getInputFilesFromHtmlInputElement**(el: *`HTMLInputElement`*): `Promise`<[MagickInputFile](interfaces/magickinputfile.md)[]>

*Defined in [util/html.ts:37](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/html.ts#L37)*

Build `MagickInputFile[]` from given HTMLInputElement of type=file that user may used to select several files

**Parameters:**

| Name | Type |
| ------ | ------ |
| el | `HTMLInputElement` |

**Returns:** `Promise`<[MagickInputFile](interfaces/magickinputfile.md)[]>

___
<a id="getpixelcolor"></a>

###  getPixelColor

▸ **getPixelColor**(img: *[MagickFile](interfaces/magickfile.md)*, x: *`number`*, y: *`number`*): `Promise`<`string`>

*Defined in [util/image.ts:4](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/image.ts#L4)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| img | [MagickFile](interfaces/magickfile.md) |
| x | `number` |
| y | `number` |

**Returns:** `Promise`<`string`>

___
<a id="inputfiletouint8array"></a>

###  inputFileToUint8Array

▸ **inputFileToUint8Array**(el: *`HTMLInputElement`*): `Promise`<`object`[]>

*Defined in [util/html.ts:53](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/html.ts#L53)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| el | `HTMLInputElement` |

**Returns:** `Promise`<`object`[]>

___
<a id="isexecuteconfig"></a>

###  isExecuteConfig

▸ **isExecuteConfig**(arg: *`any`*): `boolean`

*Defined in [execute.ts:88](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/execute.ts#L88)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| arg | `any` |

**Returns:** `boolean`

___
<a id="isimage"></a>

###  isImage

▸ **isImage**(file: *[MagickFile](interfaces/magickfile.md)*): `Promise`<`boolean`>

*Defined in [util/file.ts:54](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/file.ts#L54)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| file | [MagickFile](interfaces/magickfile.md) |

**Returns:** `Promise`<`boolean`>

___
<a id="isinputfile"></a>

###  isInputFile

▸ **isInputFile**(file: *`any`*): `boolean`

*Defined in [util/file.ts:26](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/file.ts#L26)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| file | `any` |

**Returns:** `boolean`

___
<a id="ismagickfile"></a>

###  isMagickFile

▸ **isMagickFile**(file: *`any`*): `boolean`

*Defined in [util/file.ts:34](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/file.ts#L34)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| file | `any` |

**Returns:** `boolean`

___
<a id="isoutputfile"></a>

###  isOutputFile

▸ **isOutputFile**(file: *`any`*): `boolean`

*Defined in [util/file.ts:30](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/file.ts#L30)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| file | `any` |

**Returns:** `boolean`

___
<a id="isvirtualcommand"></a>

###  isVirtualCommand

▸ **isVirtualCommand**(context: *[VirtualCommandContext](interfaces/virtualcommandcontext.md)*): `boolean`

*Defined in [executeVirtualCommand/VirtualCommand.ts:28](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/executeVirtualCommand/VirtualCommand.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| context | [VirtualCommandContext](interfaces/virtualcommandcontext.md) |

**Returns:** `boolean`

___
<a id="loadimageelement"></a>

###  loadImageElement

▸ **loadImageElement**(image: *[MagickFile](interfaces/magickfile.md)*, el: *`HTMLImageElement`*, forceBrowserSupport?: *`boolean`*): `Promise`<`HTMLImageElement`>

*Defined in [util/html.ts:13](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/html.ts#L13)*

Will load given html img element src with the inline image content.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| image | [MagickFile](interfaces/magickfile.md) | - |  the image to be loaded |
| el | `HTMLImageElement` | - |  the html image element in which to load the image |
| `Default value` forceBrowserSupport | `boolean` | false |  if true and the image extension is not supported by browsers, it will convert the image to png and return that src so it can be shown in browsers |

**Returns:** `Promise`<`HTMLImageElement`>

___
<a id="newexecutioncontext"></a>

###  newExecutionContext

▸ **newExecutionContext**(inheritFrom?: *[ExecutionContext](interfaces/executioncontext.md)*): [ExecutionContext](interfaces/executioncontext.md)

*Defined in [executionContext.ts:88](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/executionContext.ts#L88)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` inheritFrom | [ExecutionContext](interfaces/executioncontext.md) |

**Returns:** [ExecutionContext](interfaces/executioncontext.md)

___
<a id="readfileastext"></a>

###  readFileAsText

▸ **readFileAsText**(file: *[MagickFile](interfaces/magickfile.md)*): `Promise`<`string`>

*Defined in [util/file.ts:45](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/file.ts#L45)*

Read files as string. Useful when files contains plain text like in the output file info.txt of `convert logo: -format '%[pixel:p{0,0}]' info:info.txt`

**Parameters:**

| Name | Type |
| ------ | ------ |
| file | [MagickFile](interfaces/magickfile.md) |

**Returns:** `Promise`<`string`>

___
<a id="registercommandpreprocessor"></a>

###  registerCommandPreprocessor

▸ **registerCommandPreprocessor**(p: *[CommandPreprocessor](interfaces/commandpreprocessor.md)*): `void`

*Defined in [executeCommandPreprocessor.ts:22](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/executeCommandPreprocessor.ts#L22)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| p | [CommandPreprocessor](interfaces/commandpreprocessor.md) |

**Returns:** `void`

___
<a id="registerexecutevirtualcommand"></a>

###  registerExecuteVirtualCommand

▸ **registerExecuteVirtualCommand**(c: *[VirtualCommand](interfaces/virtualcommand.md)*): `void`

*Defined in [executeVirtualCommand/VirtualCommand.ts:38](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/executeVirtualCommand/VirtualCommand.ts#L38)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| c | [VirtualCommand](interfaces/virtualcommand.md) |

**Returns:** `void`

___
<a id="removeallcalllisteners"></a>

###  removeAllCallListeners

▸ **removeAllCallListeners**(): `void`

*Defined in [magickApi.ts:277](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L277)*

**Returns:** `void`

___
<a id="resolvecommandsubstitution"></a>

###  resolveCommandSubstitution

▸ **resolveCommandSubstitution**(command: *`string`[]*): `object`

*Defined in [executeVirtualCommand/substitution.ts:42](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/executeVirtualCommand/substitution.ts#L42)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| command | `string`[] |

**Returns:** `object`

___
<a id="unquote"></a>

###  unquote

▸ **unquote**(s: *`string`*): `string`

*Defined in [util/cli.ts:112](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/util/cli.ts#L112)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| s | `string` |

**Returns:** `string`

___

