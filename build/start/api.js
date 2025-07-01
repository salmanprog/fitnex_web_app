"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default
    .group(() => {
    Route_1.default.post('generate-video-thumb', 'Api/GeneralController.generateVideoThumb').as('generate-video-thumb');
    Route_1.default.post('user/resend/code', 'Api/UsersController.resendCode').as('user.resent-code').middleware('apiAuth');
    Route_1.default.post('user/verify/code', 'Api/UsersController.verifyCode').as('user.verify-code').middleware('apiAuth');
    Route_1.default.post('user/social-login', 'Api/UsersController.socialLogin').as('user.social-login');
    Route_1.default.post('user/change-password', 'Api/UsersController.changePassword').as('user.change-password').middleware('apiAuth');
    Route_1.default.post('user/forgot-password', 'Api/UsersController.forgotPassword').as('user.forgot-password');
    Route_1.default.post('user/login', 'Api/UsersController.login').as('user.login');
    Route_1.default.resource('user', 'Api/UsersController')
        .except(['destroy'])
        .middleware({
        index: ['apiAuth'],
        show: ['apiAuth'],
        update: ['apiAuth'],
    });
})
    .prefix('api')
    .as('api')
    .middleware(['apiAuthorization']);
Route_1.default
    .group(() => {
    Route_1.default.post('user/logout', 'Api/UsersController.userLogout').as('user.logout');
    Route_1.default.resource('job', 'Api/JobController');
    Route_1.default.resource('media', 'Api/MediaController').except(['update', 'destroy']);
    Route_1.default.post('notification/test-notification', 'Api/NotificationController.sendTestNotification').as('test-notification');
})
    .prefix('api')
    .as('api')
    .middleware(['apiAuthorization', 'apiAuth']);
//# sourceMappingURL=api.js.map