[wasm-imagemagick](../README.md) > [MagickInputFile](../interfaces/magickinputfile.md)

# Interface: MagickInputFile

Represents input files that need to be provided to [call](../#call) or [execute](https://github.com/KnicKnic/WASM-ImageMagick/tree/master/apidocs#execute).

Can be builded using [buildInputFile](../#buildinputfile)

## Hierarchy

 [MagickFile](magickfile.md)

**↳ MagickInputFile**

## Index

### Properties

* [content](magickinputfile.md#content)
* [ignore](magickinputfile.md#ignore)
* [name](magickinputfile.md#name)

---

## Properties

<a id="content"></a>

###  content

**● content**: *`Uint8Array`*

*Defined in [magickApi.ts:163](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L163)*

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

