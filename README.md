# HashKey DID SDK - NPM

[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

TypeScript module to work with HashKey DID Protocol.

## Installation

`npm install hashkeydid`

## Usage

`hashkeydid` provides simple access to the [HashKey DID](https://hashkey.id) Contracts.

## Basic

### HashKeyDID

`HashKeyDID` is the Basic object to send transactions
with [HashKey DID](https://github.com/hashkeydid/hashkeydid-contracts) Contracts.

```typescript
import {NewHashKeyDID} from "hashkeydid";

HashKeyDIDOnlyRead = await NewHashKeyDID("rpc url");

HashKeyDIDByPrivateKey = await NewHashKeyDID("rpc url", {privateKey: "private_key"});

HashKeyDIDByMnemonic = await NewHashKeyDID("rpc url", {mnemonic: "mnemonic"});
```
