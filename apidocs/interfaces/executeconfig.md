[wasm-imagemagick](../README.md) > [ExecuteConfig](../interfaces/executeconfig.md)

# Interface: ExecuteConfig

## Hierarchy

**ExecuteConfig**

## Index

### Properties

* [commands](executeconfig.md#commands)
* [executionId](executeconfig.md#executionid)
* [inputFiles](executeconfig.md#inputfiles)
* [skipCommandPreprocessors](executeconfig.md#skipcommandpreprocessors)
* [skipVirtualCommands](executeconfig.md#skipvirtualcommands)

---

## Properties

<a id="commands"></a>

###  commands

**● commands**: *[ExecuteCommand](../#executecommand)*

*Defined in [execute.ts:11](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/execute.ts#L11)*

___
<a id="executionid"></a>

### `<Optional>` executionId

**● executionId**: *`number`*

*Defined in [execute.ts:13](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/execute.ts#L13)*

internal id for execution calls so execute() extensions like virtual commands have a chance to identify each call if they also invoke execute() internally

___
<a id="inputfiles"></a>

### `<Optional>` inputFiles

**● inputFiles**: *[MagickInputFile](magickinputfile.md)[]*

*Defined in [execute.ts:10](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/execute.ts#L10)*

___
<a id="skipcommandpreprocessors"></a>

### `<Optional>` skipCommandPreprocessors

**● skipCommandPreprocessors**: *`boolean`*

*Defined in [execute.ts:17](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/execute.ts#L17)*

if true command string preprocessor (aka templates) won't be executed

___
<a id="skipvirtualcommands"></a>

### `<Optional>` skipVirtualCommands

**● skipVirtualCommands**: *`boolean`*

*Defined in [execute.ts:15](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/execute.ts#L15)*

if true, virtual commands like command substitution, ls, cat, etc won't be executed

___

