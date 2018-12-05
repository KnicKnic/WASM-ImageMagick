[wasm-imagemagick](../README.md) > [ExecutionContext](../interfaces/executioncontext.md)

# Interface: ExecutionContext

Allow multiple execute() calls remembering previous execute() generated output files and previous given input files that can be used as input files in next calls.

## Hierarchy

**ExecutionContext**

## Index

### Methods

* [addBuiltInImages](executioncontext.md#addbuiltinimages)
* [addFiles](executioncontext.md#addfiles)
* [execute](executioncontext.md#execute)
* [getAllFiles](executioncontext.md#getallfiles)
* [getFile](executioncontext.md#getfile)
* [removeFiles](executioncontext.md#removefiles)

---

## Methods

<a id="addbuiltinimages"></a>

###  addBuiltInImages

▸ **addBuiltInImages**(): `Promise`<`void`>

*Defined in [executionContext.ts:27](https://github.com/KnicKnic/WASM-ImageMagick/blob/940c9be/src/executionContext.ts#L27)*

Add ImageMagick built-in images like `rose:`, `logo:`, etc to this execution context so they are present in `getAllFiles()`.

**Returns:** `Promise`<`void`>

___
<a id="addfiles"></a>

###  addFiles

▸ **addFiles**(files: *[MagickFile](magickfile.md)[]*): `void`

*Defined in [executionContext.ts:17](https://github.com/KnicKnic/WASM-ImageMagick/blob/940c9be/src/executionContext.ts#L17)*

Programmatically add new files so they are available if following `execute()` calls.

**Parameters:**

| Name | Type |
| ------ | ------ |
| files | [MagickFile](magickfile.md)[] |

**Returns:** `void`

___
<a id="execute"></a>

###  execute

▸ **execute**(configOrCommands: * [ExecuteConfig](executeconfig.md) &#124; [ExecuteCommand](../#executecommand) &#124; `string`*): `Promise`<[ExecuteResult](executeresult.md)>

*Defined in [executionContext.ts:12](https://github.com/KnicKnic/WASM-ImageMagick/blob/940c9be/src/executionContext.ts#L12)*

This behaves almost the same as [execute](https://github.com/KnicKnic/WASM-ImageMagick/tree/master/apidocs#execute).

**Parameters:**

| Name | Type |
| ------ | ------ |
| configOrCommands |  [ExecuteConfig](executeconfig.md) &#124; [ExecuteCommand](../#executecommand) &#124; `string`|

**Returns:** `Promise`<[ExecuteResult](executeresult.md)>

___
<a id="getallfiles"></a>

###  getAllFiles

▸ **getAllFiles**(): `Promise`<[MagickInputFile](magickinputfile.md)[]>

*Defined in [executionContext.ts:22](https://github.com/KnicKnic/WASM-ImageMagick/blob/940c9be/src/executionContext.ts#L22)*

Get all the files currently available in this context.

**Returns:** `Promise`<[MagickInputFile](magickinputfile.md)[]>

___
<a id="getfile"></a>

###  getFile

▸ **getFile**(name: *`string`*): `Promise`< [MagickInputFile](magickinputfile.md) &#124; `undefined`>

*Defined in [executionContext.ts:32](https://github.com/KnicKnic/WASM-ImageMagick/blob/940c9be/src/executionContext.ts#L32)*

Get a file by name or undefined if none.

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |

**Returns:** `Promise`< [MagickInputFile](magickinputfile.md) &#124; `undefined`>

___
<a id="removefiles"></a>

###  removeFiles

▸ **removeFiles**(names: *`string`[]*): [MagickInputFile](magickinputfile.md)[]

*Defined in [executionContext.ts:38](https://github.com/KnicKnic/WASM-ImageMagick/blob/940c9be/src/executionContext.ts#L38)*

Remove files by name.

**Parameters:**

| Name | Type |
| ------ | ------ |
| names | `string`[] |

**Returns:** [MagickInputFile](magickinputfile.md)[]
the files actually removed.

___

