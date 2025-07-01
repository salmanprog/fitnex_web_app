"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.post('login', 'Api/Admin/AuthController.login').as('login');
    Route_1.default.resource('application-content', 'Api/Admin/ContentController')
        .middleware({
        index: ['apiAuth'],
    });
}).prefix('api/admin').middleware(['apiAuthorization']);
Route_1.default
    .group(() => {
    Route_1.default.resource('user', 'Api/Admin/AuthController')
        .middleware({
        index: ['apiAuth'],
    });
    Route_1.default.resource('users', 'Api/Admin/UsersController')
        .middleware({
        index: ['apiAuth'],
        update: ['apiAuth'],
    });
    Route_1.default.get('dashboard', 'Api/Admin/UsersController.userDashboard').as('dashboard').middleware('apiAuth');
    Route_1.default.get('user-hierarchy', 'Api/Admin/UsersController.getChildUser').as('user-hierarchy').middleware('apiAuth');
    Route_1.default.post('user/change-password', 'Api/UsersController.changePassword').as('user.change-password').middleware('apiAuth');
    Route_1.default.post('logout', 'Api/Admin/AuthController.userLogout').as('logout');
    Route_1.default.route('application/setting', ['GET', 'POST'], 'Api/Admin/ApplicationSettingController.getSetting').as('application.setting');
})
    .prefix('api/admin')
    .as('api/admin')
    .middleware(['apiAuthorization', 'apiAuth']);
Route_1.default.on('/admin/:module?/:action?/:slug?').render('admin.index');
//# sourceMappingURL=admin.js.map