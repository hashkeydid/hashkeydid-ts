# HashKey DID SDK - NPM

[//]: # ([![Tag]&#40;https://img.shields.io/badge/tags-v0.0.2-blue&#41;]&#40;https://github.com/hashkeydid/hashkeydid-js/tags&#41;)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

TypeScript module to work with HashKey DID Protocol.

## Installation

`npm install hashkeydid`

## Usage

`hashkeydid` provides simple access to the [HashKey DID](https://hashkey.id) Contracts.

## Basic

### 1.HashKeyDID

`HashKeyDID` is the Basic object to send transactions
with [HashKey DID](https://github.com/hashkeydid/hashkeydid-contracts) Contracts.

```typescript
import {NewHashKeyDID} from "hashkeydid";

HashKeyDIDOnlyRead = await NewHashKeyDID("rpc url");

HashKeyDIDByPrivateKey = await NewHashKeyDID("rpc url", {privateKey: "private_key"});

HashKeyDIDByMnemonic = await NewHashKeyDID("rpc url", {mnemonic: "mnemonic"});
```

### 2.Resolver

`Resolver` is the Basic object to send transactions
with [HashKey_DID_Resolver](https://github.com/hashkeydid/hashkeydid-resolver) Contracts.

```typescript
import {NewHashKeyDIDResolver} from "hashkeydid";

ResolverOnlyRead = await NewHashKeyDIDResolver("rpc url");

ResolverByPrivateKey = await NewHashKeyDIDResolver("rpc url", {privateKey: "private_key"});

ResolverByMnemonic = await NewHashKeyDIDResolver("rpc url", {mnemonic: "mnemonic"});
```

