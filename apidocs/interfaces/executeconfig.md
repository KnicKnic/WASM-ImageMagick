[wasm-imagemagick](../README.md) > [ExecuteConfig](../interfaces/executeconfig.md)

# Interface: ExecuteConfig

## Hierarchy

**ExecuteConfig**

## Index

### Properties

* [commands](executeconfig.md#commands)
* [executionId](executeconfig.md#executionid)
* [inputFiles](executeconfig.md#inputfiles)

---

## Properties

<a id="commands"></a>

###  commands

**● commands**: *[ExecuteCommand](../#executecommand)*

*Defined in [execute.ts:12](https://github.com/KnicKnic/WASM-ImageMagick/blob/940c9be/src/execute.ts#L12)*

___
<a id="executionid"></a>

### `<Optional>` executionId

**● executionId**: *`number`*

*Defined in [execute.ts:14](https://github.com/KnicKnic/WASM-ImageMagick/blob/940c9be/src/execute.ts#L14)*

internal id for execution calls so execute() extensions like virtual commands have a chance to identify each call if they also invoke execute() internally

___
<a id="inputfiles"></a>

### `<Optional>` inputFiles

**● inputFiles**: *[MagickInputFile](magickinputfile.md)[]*

*Defined in [execute.ts:11](https://github.com/KnicKnic/WASM-ImageMagick/blob/940c9be/src/execute.ts#L11)*

___

