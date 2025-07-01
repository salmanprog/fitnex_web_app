'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const Controller_1 = __importDefault(require("../Controller"));
const ApplicationSetting_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ApplicationSetting"));
const FileUpload_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Libraries/FileUpload/FileUpload"));
const Index_2 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const I18n_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/I18n"));
const lodash_1 = __importDefault(require("lodash"));
class ApplicationSettingController extends Controller_1.default {
    async setting({ request, response, session, view }) {
        if (request.method() == 'POST') {
            return await this._submitSetting(request, response, session);
        }
        return await this.loadAdminView(view, 'application-setting.index');
    }
    async _submitSetting(request, response, session) {
        let validationRules, params;
        validationRules = Validator_1.schema.create({
            app_name: Validator_1.schema.string([
                Validator_1.rules.minLength(3),
                Validator_1.rules.maxLength(50),
            ]),
            meta_keyword: Validator_1.schema.string.optional({}, [
                Validator_1.rules.minLength(5),
                Validator_1.rules.maxLength(1000),
            ]),
            meta_description: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(5),
                Validator_1.rules.maxLength(1000),
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
        if (!lodash_1.default.isEmpty(request.file('logo'))) {
            let fileValidate = (0, Index_1.fileValidation)(request.file('logo'), 6000000);
            if (fileValidate.error) {
                session.flash({ error: fileValidate.message });
                response.redirect('back');
                return;
            }
        }
        if (!lodash_1.default.isEmpty(request.file('favicon'))) {
            let fileValidate = (0, Index_1.fileValidation)(request.file('favicon'), 6000000);
            if (fileValidate.error) {
                session.flash({ error: fileValidate.message });
                response.redirect('back');
                return;
            }
        }
        params = request.all();
        if (!lodash_1.default.isEmpty(request.file('logo'))) {
            params.logo = await FileUpload_1.default.doUpload(request.file('logo'), 'application-setting');
        }
        else {
            params.logo = params.old_logo;
        }
        if (!lodash_1.default.isEmpty(request.file('favicon'))) {
            params.favicon = await FileUpload_1.default.doUpload(request.file('favicon'), 'application-setting');
        }
        else {
            params.favicon = params.old_favicon;
        }
        delete params._csrf;
        delete params.old_logo;
        delete params.old_favicon;
        await ApplicationSetting_1.default.query().where('identifier', 'application-setting').delete();
        let ApplicationSettingData = [];
        for (const [key, value] of Object.entries(params)) {
            ApplicationSettingData.push({
                identifier: 'application-setting',
                meta_key: key,
                value: value,
                is_file: key == 'logo' || key == 'favicon' ? '1' : '0',
                created_at: (0, Index_2.currentDateTime)(),
            });
        }
        await ApplicationSetting_1.default.createMany(ApplicationSettingData);
        session.flash({ success: I18n_1.default.locale('en').formatMessage(`messages.success_update_message`) });
        return response.redirect().back();
    }
}
module.exports = ApplicationSettingController;
//# sourceMappingURL=ApplicationSettingController.js.map