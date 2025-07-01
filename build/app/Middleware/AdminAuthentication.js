"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Config"));
class AdminAuthentication {
    async handle({ auth, response }, next) {
        await auth.use('web').authenticate();
        if (!await auth.use('web').check()) {
            response.redirect().withQs({ auth_token: Config_1.default.get('constants.ADMIN_LOGIN_TOKEN') }).toRoute('admin.login');
            return;
        }
        await next();
    }
}
exports.default = AdminAuthentication;
//# sourceMappingURL=AdminAuthentication.js.map