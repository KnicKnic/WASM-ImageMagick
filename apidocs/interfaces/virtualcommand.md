[wasm-imagemagick](../README.md) > [VirtualCommand](../interfaces/virtualcommand.md)

# Interface: VirtualCommand

## Hierarchy

**VirtualCommand**

## Index

### Properties

* [name](virtualcommand.md#name)

### Methods

* [execute](virtualcommand.md#execute)
* [predicate](virtualcommand.md#predicate)

---

## Properties

<a id="name"></a>

###  name

**● name**: *`string`*

*Defined in [executeVirtualCommand/VirtualCommand.ts:13](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/executeVirtualCommand/VirtualCommand.ts#L13)*

___

## Methods

<a id="execute"></a>

###  execute

▸ **execute**(c: *[VirtualCommandContext](virtualcommandcontext.md)*): `Promise`<[ExecuteResult](executeresult.md)>

*Defined in [executeVirtualCommand/VirtualCommand.ts:14](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/executeVirtualCommand/VirtualCommand.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| c | [VirtualCommandContext](virtualcommandcontext.md) |

**Returns:** `Promise`<[ExecuteResult](executeresult.md)>

___
<a id="predicate"></a>

###  predicate

▸ **predicate**(c: *[VirtualCommandContext](virtualcommandcontext.md)*): `boolean`

*Defined in [executeVirtualCommand/VirtualCommand.ts:15](https://github.com/KnicKnic/WASM-ImageMagick/blob/2a709c4/src/executeVirtualCommand/VirtualCommand.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| c | [VirtualCommandContext](virtualcommandcontext.md) |

**Returns:** `boolean`

___

