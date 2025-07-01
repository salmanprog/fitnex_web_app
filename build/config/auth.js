"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authConfig = {
    guard: 'web',
    guards: {
        web: {
            driver: 'session',
            provider: {
                driver: 'database',
                identifierKey: 'id',
                uids: ['email'],
                usersTable: 'users',
            },
        },
    },
};
exports.default = authConfig;
//# sourceMappingURL=auth.js.map