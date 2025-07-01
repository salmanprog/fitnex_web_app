"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Encryption_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Encryption"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const ResetPassword_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ResetPassword"));
const UserApiToken_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserApiToken"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const luxon_1 = require("luxon");
const lodash_1 = __importDefault(require("lodash"));
const Controller_1 = __importDefault(require("./Controller"));
class UsersController extends Controller_1.default {
    async verifyEmail({ response, params, session }) {
        let email;
        try {
            email = Encryption_1.default.decrypt(params.email);
        }
        catch (error) {
            return 'Invalid signature';
        }
        let data = {
            is_email_verify: '1',
            email_verify_at: (0, Index_1.currentDateTime)()
        };
        await User_1.default.updateUser(data, { email: email });
        session.flash('success', 'Your email has been verified successfully');
        return response.redirect('/');
    }
    async resetPassword({ request, params, view, session, response }) {
        let resetPasswordToken = params.resetpasstoken;
        let getResetPassReq = await ResetPassword_1.default.getResetPassReq(resetPasswordToken);
        if (lodash_1.default.isEmpty(getResetPassReq)) {
            session.flash({ error: 'Reset password link has been expired or used' });
            response.redirect('/');
            return;
        }
        let expiry_link_date = luxon_1.DateTime.fromISO(getResetPassReq.created_at).plus({ hours: 1 }).toUnixInteger();
        if (expiry_link_date > (0, Index_1.currentUnixDateTime)()) {
            session.flash({ error: 'Reset password link has been expired' });
            response.redirect('/');
            return;
        }
        await UserApiToken_1.default.deleteApiToken(getResetPassReq.id);
        if (request.method() == 'POST')
            return this._submitResetPassword(request, response, session, getResetPassReq);
        return view.render('reset-password');
    }
    async _submitResetPassword(request, response, session, getResetPassReq) {
        const validationRules = Validator_1.schema.create({
            new_password: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(8),
                Validator_1.rules.maxLength(100),
                Validator_1.rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/)
            ]),
            confirm_password: Validator_1.schema.string({}, [
                Validator_1.rules.confirmed('new_password')
            ]),
        });
        try {
            await request.validate({ schema: validationRules });
        }
        catch (error) {
            let error_messges = this.setValidatorMessagesResponse(error.messages, 'web');
            session.flash({ errors: error_messges });
            return response.redirect('back');
        }
        let body_params = request.all();
        body_params.email = getResetPassReq.email;
        await User_1.default.updateResetPassword(body_params);
        session.flash({ success: 'Password has been updated successfully.' });
        return response.redirect('/');
    }
}
exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map