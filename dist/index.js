"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewHashKeyDIDResolver = exports.NewHashKeyDID = exports.Resolver = exports.HashKeyDID = exports.DIDMateData = exports.DIDImage = exports.Error = void 0;
var did_1 = require("./package/did/did");
Object.defineProperty(exports, "HashKeyDID", { enumerable: true, get: function () { return did_1.HashKeyDID; } });
Object.defineProperty(exports, "NewHashKeyDID", { enumerable: true, get: function () { return did_1.NewHashKeyDID; } });
var resolver_1 = require("./package/resolver/resolver");
Object.defineProperty(exports, "Resolver", { enumerable: true, get: function () { return resolver_1.Resolver; } });
Object.defineProperty(exports, "DIDImage", { enumerable: true, get: function () { return resolver_1.DIDImage; } });
Object.defineProperty(exports, "DIDMateData", { enumerable: true, get: function () { return resolver_1.DIDMateData; } });
Object.defineProperty(exports, "NewHashKeyDIDResolver", { enumerable: true, get: function () { return resolver_1.NewHashKeyDIDResolver; } });
var errors_1 = require("./error/errors");
Object.defineProperty(exports, "Error", { enumerable: true, get: function () { return errors_1.Error; } });
//# sourceMappingURL=index.js.map