"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminRedirectIfAuthentication {
    async handle({ auth, response }, next) {
        if (await auth.use('web').check()) {
            response.redirect().toRoute('admin.dashboard');
            return;
        }
        await next();
    }
}
exports.default = AdminRedirectIfAuthentication;
//# sourceMappingURL=AdminRedirectIfAuthentication.js.map