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

*Defined in [executeVirtualCommand.ts:28](https://github.com/KnicKnic/WASM-ImageMagick/blob/b63753c/src/executeVirtualCommand.ts#L28)*

___

## Methods

<a id="execute"></a>

###  execute

▸ **execute**(c: *[VirtualCommandContext](virtualcommandcontext.md)*): `Promise`<[ExecuteResult](executeresult.md)>

*Defined in [executeVirtualCommand.ts:29](https://github.com/KnicKnic/WASM-ImageMagick/blob/b63753c/src/executeVirtualCommand.ts#L29)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| c | [VirtualCommandContext](virtualcommandcontext.md) |

**Returns:** `Promise`<[ExecuteResult](executeresult.md)>

___
<a id="predicate"></a>

###  predicate

▸ **predicate**(c: *[VirtualCommandContext](virtualcommandcontext.md)*): `boolean`

*Defined in [executeVirtualCommand.ts:30](https://github.com/KnicKnic/WASM-ImageMagick/blob/b63753c/src/executeVirtualCommand.ts#L30)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| c | [VirtualCommandContext](virtualcommandcontext.md) |

**Returns:** `boolean`

___

