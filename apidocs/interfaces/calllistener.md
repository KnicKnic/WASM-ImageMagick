[wasm-imagemagick](../README.md) > [CallListener](../interfaces/calllistener.md)

# Interface: CallListener

## Hierarchy

**CallListener**

## Index

### Properties

* [onWorkerError](calllistener.md#onworkererror)

### Methods

* [afterCall](calllistener.md#aftercall)
* [beforeCall](calllistener.md#beforecall)
* [onStderr](calllistener.md#onstderr)
* [onStdout](calllistener.md#onstdout)

---

## Properties

<a id="onworkererror"></a>

### `<Optional>` onWorkerError

**● onWorkerError**: * `function` &#124; `null`
*

*Defined in [magickApi.ts:265](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L265)*

___

## Methods

<a id="aftercall"></a>

### `<Optional>` afterCall

▸ **afterCall**(event: *[CallEvent](callevent.md)*): `void`

*Defined in [magickApi.ts:261](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L261)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | [CallEvent](callevent.md) |

**Returns:** `void`

___
<a id="beforecall"></a>

### `<Optional>` beforeCall

▸ **beforeCall**(event: *[CallEvent](callevent.md)*): `void`

*Defined in [magickApi.ts:262](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L262)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | [CallEvent](callevent.md) |

**Returns:** `void`

___
<a id="onstderr"></a>

### `<Optional>` onStderr

▸ **onStderr**(text: *`string`*): `void`

*Defined in [magickApi.ts:264](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L264)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| text | `string` |

**Returns:** `void`

___
<a id="onstdout"></a>

### `<Optional>` onStdout

▸ **onStdout**(text: *`string`*): `void`

*Defined in [magickApi.ts:263](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/magickApi.ts#L263)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| text | `string` |

**Returns:** `void`

___

