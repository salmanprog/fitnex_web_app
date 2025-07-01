"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@adonisjs/limiter/build/config");
exports.default = (0, config_1.limiterConfig)({
    default: 'redis',
    stores: {
        redis: {
            client: 'redis',
            connectionName: 'local',
        },
    },
});
//# sourceMappingURL=limiter.js.map