'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("../Controller"));
const Config_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Config"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const FileUpload_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Libraries/FileUpload/FileUpload"));
const I18n_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/I18n"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const lodash_1 = __importDefault(require("lodash"));
class AdminController extends Controller_1.default {
    constructor() {
        super();
        this.__data = [];
    }
    async profile({ auth, request, response, session, view }) {
        if (request.method() == 'POST') {
            return await this._submitProfile(auth, request, response, session);
        }
        return await this.loadAdminView(view, 'auth.profile', this.__data);
    }
    async _submitProfile(auth, request, response, session) {
        let user, validationRules, params;
        user = auth.use('web').user;
        validationRules = Validator_1.schema.create({
            name: Validator_1.schema.string.optional({}, [
                Validator_1.rules.minLength(2),
                Validator_1.rules.maxLength(20),
                Validator_1.rules.regex(/^[A-Za-z0-9\s]+$/)
            ]),
            email: Validator_1.schema.string.optional({}, [
                Validator_1.rules.minLength(5),
                Validator_1.rules.maxLength(50),
                Validator_1.rules.email(),
                Validator_1.rules.unique({
                    table: 'users',
                    column: 'email',
                    where: {
                        deleted_at: null
                    },
                    whereNot: {
                        slug: user.slug
                    }
                })
            ]),
            mobile_no: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(10),
                Validator_1.rules.maxLength(15),
                Validator_1.rules.regex(/^(\+?\d{1,3}[-])\d{9,12}$/),
                Validator_1.rules.unique({
                    table: 'users',
                    column: 'mobile_no',
                    where: {
                        deleted_at: null
                    },
                    whereNot: {
                        slug: user.slug
                    }
                })
            ])
        });
        try {
            await request.validate({ schema: validationRules });
        }
        catch (error) {
            let errors = this.setValidatorMessagesResponse(error.messages, 'admin');
            session.flash({ errors: errors });
            response.redirect('back');
            return;
        }
        if (!lodash_1.default.isEmpty(request.file('image_url'))) {
            let fileValidate = (0, Index_1.fileValidation)(request.file('image_url'), 6000000);
            if (fileValidate.error) {
                session.flash({ error: fileValidate.message });
                response.redirect('back');
                return;
            }
        }
        params = request.all();
        if (!lodash_1.default.isEmpty(request.file('image_url'))) {
            params.image_url = await FileUpload_1.default.doUpload(request.file('image_url'), 'user');
        }
        else {
            params.image_url = params.old_file;
        }
        delete params._csrf;
        delete params.old_file;
        await User_1.default.updateUser(params, { id: user.id });
        session.flash({ success: I18n_1.default.locale('en').formatMessage(`messages.success_update_message`) });
        return response.redirect().back();
    }
    async changePassword({ auth, request, response, session, view }) {
        if (request.method() == 'POST') {
            return await this._submitChangePassword(auth, request, response, session);
        }
        return await this.loadAdminView(view, 'auth.change-password', this.__data);
    }
    async _submitChangePassword(auth, request, response, session) {
        let user, validationRules, params;
        params = request.all();
        user = auth.use('web').user;
        validationRules = Validator_1.schema.create({
            current_password: Validator_1.schema.string([
                Validator_1.rules.minLength(2),
                Validator_1.rules.maxLength(50),
            ]),
            new_password: Validator_1.schema.string([
                Validator_1.rules.minLength(8),
                Validator_1.rules.maxLength(50),
                Validator_1.rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/),
                Validator_1.rules.confirmed('confirm_password')
            ]),
            confirm_password: Validator_1.schema.string([
                Validator_1.rules.maxLength(50),
            ])
        });
        try {
            await request.validate({ schema: validationRules });
        }
        catch (error) {
            let errors = this.setValidatorMessagesResponse(error.messages, 'admin');
            session.flash({ errors: errors });
            response.redirect('back');
            return;
        }
        if (!await Hash_1.default.verify(user.password, params.current_password)) {
            session.flash({ errors: 'Current password is not valid' });
            response.redirect('back');
            return;
        }
        await User_1.default.updateUser({ password: await Hash_1.default.make(params.new_password) }, { id: user.id });
        session.flash({ success: I18n_1.default.locale('en').formatMessage(`messages.success_update_message`) });
        return response.redirect().back();
    }
    async logout({ auth, response }) {
        await auth.use('web').logout();
        response.redirect().withQs({ auth_token: Config_1.default.get('constants.ADMIN_LOGIN_TOKEN') }).toRoute('admin.login');
        return;
    }
}
exports.default = AdminController;
//# sourceMappingURL=AdminController.js.map