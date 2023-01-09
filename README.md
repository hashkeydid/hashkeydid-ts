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
import {HashKeyDID} from "hashkeydid";

HashKeyDIDOnlyRead = new HashKeyDID();

HashKeyDIDByPrivateKey = new HashKeyDID({privateKey: "private_key"});

HashKeyDIDByMnemonic = new HashKeyDID({mnemonic: "mnemonic"});
```

### 2.Resolver

`Resolver` is the Basic object to send transactions
with [HashKey_DID_Resolver](https://github.com/hashkeydid/hashkeydid-resolver) Contracts.

```typescript
import {Resolver} from "hashkeydid";

ResolverOnlyRead = new Resolver();

ResolverByPrivateKey = new Resolver({privateKey: "private_key"});

ResolverByMnemonic = new Resolver({mnemonic: "mnemonic"});
```

## Advanced

### 1.Avatar

`Avatar` is an advanced object for the Avatar module in the HashKey DID project, 
used to obtain and parse DID Avatar URI.

```typescript
import {Avatar} from "hashkeydid";

Avatar = new Avatar();
```

