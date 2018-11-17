[wasm-imagemagick](../README.md) > [ImageHome](../interfaces/imagehome.md)

# Interface: ImageHome

Manager for `MagickFiles`.

## Hierarchy

**ImageHome**

## Index

### Methods

* [addBuiltInImages](imagehome.md#addbuiltinimages)
* [get](imagehome.md#get)
* [getAll](imagehome.md#getall)
* [isRegistered](imagehome.md#isregistered)
* [register](imagehome.md#register)
* [remove](imagehome.md#remove)

---

## Methods

<a id="addbuiltinimages"></a>

###  addBuiltInImages

▸ **addBuiltInImages**(): `Promise`<`void`>

*Defined in [imageHome.ts:26](https://github.com/KnicKnic/WASM-ImageMagick/blob/a680377/src/imageHome.ts#L26)*

Add ImageMagick built-in images like `rose:`, `logo:`, etc to this execution context so they are present in `getAll()`.

**Returns:** `Promise`<`void`>

___
<a id="get"></a>

###  get

▸ **get**(name: *`string`*): `Promise`<[MagickInputFile](magickinputfile.md)>

*Defined in [imageHome.ts:12](https://github.com/KnicKnic/WASM-ImageMagick/blob/a680377/src/imageHome.ts#L12)*

Get a file by name.

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |

**Returns:** `Promise`<[MagickInputFile](magickinputfile.md)>

___
<a id="getall"></a>

###  getAll

▸ **getAll**(): `Promise`<[MagickInputFile](magickinputfile.md)[]>

*Defined in [imageHome.ts:22](https://github.com/KnicKnic/WASM-ImageMagick/blob/a680377/src/imageHome.ts#L22)*

Get all the files currently available in this context.

**Returns:** `Promise`<[MagickInputFile](magickinputfile.md)[]>

___
<a id="isregistered"></a>

###  isRegistered

▸ **isRegistered**(name: *`string`*): `boolean`

*Defined in [imageHome.ts:18](https://github.com/KnicKnic/WASM-ImageMagick/blob/a680377/src/imageHome.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |

**Returns:** `boolean`

___
<a id="register"></a>

###  register

▸ **register**(file: *[MagickFile](magickfile.md)*, name?: *`string`*): `void`

*Defined in [imageHome.ts:17](https://github.com/KnicKnic/WASM-ImageMagick/blob/a680377/src/imageHome.ts#L17)*

Programmatically add new files.

**Parameters:**

| Name | Type |
| ------ | ------ |
| file | [MagickFile](magickfile.md) |
| `Optional` name | `string` |

**Returns:** `void`

___
<a id="remove"></a>

###  remove

▸ **remove**(names: *`string`[]*): [MagickInputFile](magickinputfile.md)[]

*Defined in [imageHome.ts:31](https://github.com/KnicKnic/WASM-ImageMagick/blob/a680377/src/imageHome.ts#L31)*

Remove files by name.

**Parameters:**

| Name | Type |
| ------ | ------ |
| names | `string`[] |

**Returns:** [MagickInputFile](magickinputfile.md)[]
the files actually removed.

___

