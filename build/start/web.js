"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.get('encrypt-data', async ({ view }) => {
    return view.render('encrypt-data');
});
Route_1.default.get('user/verify/:email', 'UsersController.verifyEmail').as('verifyEmail');
Route_1.default.route('user/reset-password/:resetpasstoken', ['GET', 'POST'], 'UsersController.resetPassword');
Route_1.default.get('media_read/:name', 'Api/MediaController.readMedia').as('mediaread.readMedia');
Route_1.default.on("/:module?/:action?/:slug?").render("index");
//# sourceMappingURL=web.js.map