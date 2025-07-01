"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Config_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Config"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const Controller_1 = __importDefault(require("../Controller"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Encryption_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Encryption"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const lodash_1 = __importDefault(require("lodash"));
class AuthController extends Controller_1.default {
    async login({ request, response, session, auth, view }) {
        let params = request.all();
        console.log('check==========>>', params);
        if (params.auth_token != Config_1.default.get('constants.ADMIN_LOGIN_TOKEN')) {
            response.redirect('/');
            return;
        }
        if (request.method() == 'POST')
            return this._submitLogin(request, response, session, auth);
        return await this.loadAdminView(view, 'auth.login');
    }
    async _submitLogin(request, response, session, auth) {
        let validator;
        let validationRules;
        validationRules = Validator_1.schema.create({
            email: Validator_1.schema.string({}, [
                Validator_1.rules.email(),
                Validator_1.rules.maxLength(100),
            ]),
            password: Validator_1.schema.string({}, [
                Validator_1.rules.maxLength(10),
            ])
        });
        try {
            validator = await request.validate({ schema: validationRules });
        }
        catch (error) {
            let error_messges = this.setValidatorMessagesResponse(error.messages, 'web');
            session.flash({ errors: error_messges });
            return response.redirect().withQs().back();
        }
        let params = request.all();
        let user = await User_1.default.adminAuth(params.email);
        if (lodash_1.default.isEmpty(user)) {
            session.flash({ errors: 'Invalid credentials' });
            return response.redirect().withQs().back();
        }
        if (!await Hash_1.default.verify(user.password, params.password)) {
            session.flash({ errors: 'Invalid credentials' });
            return response.redirect().withQs().back();
        }
        if (user.status == 0) {
            session.flash({ errors: 'Your account has been disabled by the administrator' });
            return response.redirect().withQs().back();
        }
        await auth.use('web').loginViaId(user.id);
        response.redirect().toRoute('admin.dashboard');
        return;
    }
    async forgotPassword({ request, response, session, view }) {
        if (request.method() == 'POST')
            return this._submitForgotPassword(request, response, session);
        return await this.loadAdminView(view, 'auth.forgot-password');
    }
    async _submitForgotPassword(request, response, session) {
        let validator;
        let validationRules;
        validationRules = Validator_1.schema.create({
            email: Validator_1.schema.string({}, [
                Validator_1.rules.email(),
                Validator_1.rules.maxLength(100),
            ])
        });
        try {
            validator = await request.validate({ schema: validationRules });
        }
        catch (error) {
            let error_messges = this.setValidatorMessagesResponse(error.messages, 'web');
            session.flash({ errors: error_messges });
            return response.redirect().withQs().back();
        }
        let params = request.all();
        let user = await User_1.default.adminAuth(params.email);
        if (lodash_1.default.isEmpty(user)) {
            session.flash({ errors: 'Invalid Email' });
            return response.redirect().withQs().back();
        }
        let email_params = {
            name: user.name,
            app_name: Env_1.default.get('APP_NAME'),
            link: Env_1.default.get('APP_URL') + '/admin/reset-pass/' + Encryption_1.default.encrypt(user.email)
        };
        try {
            if (Env_1.default.get('MAIL_SANDBOX') == 0)
                (0, Index_1.sendMail)('emails/forgot-password', user.email, `Reset Password`, email_params);
        }
        catch (error) {
            console.log(error);
        }
        session.flash({ success: 'Reset password link has been sent to your email address' });
        response.redirect().withQs({ auth_token: Config_1.default.get('constants.ADMIN_LOGIN_TOKEN') }).toRoute('admin.login');
        return;
    }
    async resetPassword({ request, response, session, view, params }) {
        if (request.method() == 'POST')
            return this._submitResetPassword(request, response, session, params);
        return await this.loadAdminView(view, 'auth.reset-password');
    }
    async _submitResetPassword(request, response, session, params) {
        let validator;
        let validationRules;
        validationRules = Validator_1.schema.create({
            new_password: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(8),
                Validator_1.rules.maxLength(100),
                Validator_1.rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/)
            ]),
            confirm_password: Validator_1.schema.string({}, [
                Validator_1.rules.confirmed('new_password')
            ])
        });
        try {
            validator = await request.validate({ schema: validationRules });
        }
        catch (error) {
            let error_messges = this.setValidatorMessagesResponse(error.messages, 'web');
            session.flash({ errors: error_messges });
            return response.redirect().withQs().back();
        }
        let newPassword = await Hash_1.default.make(request.input('new_password'));
        await User_1.default.updateUser({ password: newPassword }, { email: Encryption_1.default.decrypt(params.email) });
        session.flash({ success: 'Password has been updated successfully' });
        response.redirect().withQs({ auth_token: Config_1.default.get('constants.ADMIN_LOGIN_TOKEN') }).toRoute('admin.login');
        return;
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map