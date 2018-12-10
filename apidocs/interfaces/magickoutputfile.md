[wasm-imagemagick](../README.md) > [MagickOutputFile](../interfaces/magickoutputfile.md)

# Interface: MagickOutputFile

Represents output files generated when an ImageMagick command executes.

## Hierarchy

 [MagickFile](magickfile.md)

**↳ MagickOutputFile**

## Index

### Properties

* [blob](magickoutputfile.md#blob)
* [ignore](magickoutputfile.md#ignore)
* [name](magickoutputfile.md#name)

---

## Properties

<a id="blob"></a>

###  blob

**● blob**: *`Blob`*

*Defined in [magickApi.ts:154](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L154)*

___
<a id="ignore"></a>

### `<Optional>` ignore

**● ignore**: *`boolean`*

*Inherited from [MagickFile](magickfile.md).[ignore](magickfile.md#ignore)*

*Defined in [magickApi.ts:147](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L147)*

Internal flag so some commands (virtual) can flag an (output) to be ignored by manager / UI

___
<a id="name"></a>

###  name

**● name**: *`string`*

*Inherited from [MagickFile](magickfile.md).[name](magickfile.md#name)*

*Defined in [magickApi.ts:145](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L145)*

___

