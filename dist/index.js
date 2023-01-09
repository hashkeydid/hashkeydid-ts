"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolver = exports.HashKeyDID = exports.Avatar = exports.DIDMateData = exports.DIDImage = exports.Error = void 0;
var avatar_1 = require("./package/avatar/avatar");
Object.defineProperty(exports, "Avatar", { enumerable: true, get: function () { return avatar_1.Avatar; } });
Object.defineProperty(exports, "DIDImage", { enumerable: true, get: function () { return avatar_1.DIDImage; } });
Object.defineProperty(exports, "DIDMateData", { enumerable: true, get: function () { return avatar_1.DIDMateData; } });
var did_1 = require("./package/did/did");
Object.defineProperty(exports, "HashKeyDID", { enumerable: true, get: function () { return did_1.HashKeyDID; } });
var resolver_1 = require("./package/resolver/resolver");
Object.defineProperty(exports, "Resolver", { enumerable: true, get: function () { return resolver_1.Resolver; } });
var errors_1 = require("./error/errors");
Object.defineProperty(exports, "Error", { enumerable: true, get: function () { return errors_1.Error; } });
//# sourceMappingURL=index.js.map