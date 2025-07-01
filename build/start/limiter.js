"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLimiters = void 0;
const services_1 = require("@adonisjs/limiter/build/services");
exports.httpLimiters = services_1.Limiter.define('api', () => {
    return services_1.Limiter.allowRequests(100).every('1 min');
}).httpLimiters;
//# sourceMappingURL=limiter.js.map