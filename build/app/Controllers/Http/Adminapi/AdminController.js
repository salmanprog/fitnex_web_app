"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const CrudController_1 = __importDefault(require("../Admin/CrudController"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const UserApiToken_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserApiToken"));
const ResetPassword_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ResetPassword"));
const lodash_1 = __importDefault(require("lodash"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Request = Application_1.default.container.use('Adonis/Core/Request');
class AdminController extends CrudController_1.default {
    constructor() {
        super("User");
        this.__resource = "User";
        this.__request;
        this.__response;
        this.__params = {};
    }
    async validation(action, slug) {
        switch (action) {
            case "store":
                await this.storeValidation();
                break;
            case "update":
                await this.updateValidation();
                break;
        }
    }
    async storeValidation() {
        let validator;
        let validationRules;
        validationRules = Validator_1.schema.create({});
        try {
            validator = await this.__request.validate({ schema: validationRules, messages: {}
            });
        }
        catch (error) {
            this.__is_error = true;
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        return validator;
    }
    async updateValidation() {
    }
    async beforeIndexLoadModel() {
        this.__resource = 'Admin';
    }
    async afterIndexLoadModel(records) {
    }
    async beforeStoreLoadModel() {
    }
    async afterStoreLoadModel() {
    }
    async beforeShowLoadModel() {
    }
    async afterShowLoadModel(record) {
    }
    async beforeUpdateLoadModel() {
    }
    async afterUpdateLoadModel() {
    }
    async beforeDestoryLoadModel() {
    }
    async afterDestoryLoadModel() {
    }
    async login(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let validationRules = Validator_1.schema.create({
            email: Validator_1.schema.string({}, [
                Validator_1.rules.email(),
            ]),
            password: Validator_1.schema.string(),
            device_type: Validator_1.schema.enum(['ios', 'android', 'web']),
            device_token: Validator_1.schema.string()
        });
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let body_params = this.__request.all();
        let user = await User_1.default.adminAuth(body_params.email);
        if (lodash_1.default.isEmpty(user)) {
            return this.sendError('Unauthorized', { message: 'Invalid Credentials' }, 401);
        }
        if (!await Hash_1.default.verify(user.password, body_params.password)) {
            return this.sendError('Unauthorized', { message: 'Invalid Credentials' }, 401);
        }
        if (user.status != 1) {
            return this.sendError('Unauthorized', { message: 'Your account has been disabled by the Admin' }, 401);
        }
        let api_token = await UserApiToken_1.default.createApiToken(this.__request, user.id);
        user.userApiToken = api_token;
        this.__resource = 'Admin';
        this.__is_paginate = false;
        await this.__sendResponse(200, 'You have logged in successfully', user);
        return;
    }
    async forgotPassword(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let validationRules = Validator_1.schema.create({
            email: Validator_1.schema.string({}, [
                Validator_1.rules.email(),
            ]),
        });
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            this.__is_error = true;
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let body_params = this.__request.all();
        let user = await User_1.default.getUserByEmail(body_params.email);
        if (lodash_1.default.isEmpty(user)) {
            return this.sendError('Validation Error', { message: 'Invalid email' }, 400);
        }
        if (user.is_email_verify != 1 && Env_1.default.get('MAIL_SANDBOX') == 0) {
            return this.sendError('Validation Error', { message: 'Invalid email' }, 400);
        }
        if (user.status != 1) {
            return this.sendError('Validation Error', { message: 'Your account has been disabled by the Admin' }, 400);
        }
        ResetPassword_1.default.forgotPassword(user).then(() => { });
        this.__is_paginate = false;
        this.__sendResponse(200, 'Reset password link has been sent to your email address', {});
        return;
    }
    async changePassword(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let validationRules = Validator_1.schema.create({
            current_password: Validator_1.schema.string(),
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
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let user = this.__request.user();
        let body_params = this.__request.all();
        if (!await Hash_1.default.verify(user.password, body_params.current_password)) {
            return this.sendError('Validation Message', { message: 'Your current password is not valid' }, 400);
        }
        else if (body_params.new_password == body_params.current_password) {
            return this.sendError('Validation Message', { message: 'The current password and new password must be different' }, 400);
        }
        else {
            let newPassword = await Hash_1.default.make(body_params.new_password);
            await User_1.default.updateUser({ password: newPassword }, { id: user.id });
            UserApiToken_1.default.deleteApiTokenExceptCurrentToken(user.id, this.__request.apiToken()).then();
            this.__is_paginate = false;
            this.__collection = false;
            this.__sendResponse(200, 'Password has been updated successfully', []);
            return;
        }
    }
    async userLogout(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let validationRules = Validator_1.schema.create({
            device_type: Validator_1.schema.enum(['android', 'ios', 'web']),
            device_token: Validator_1.schema.string(),
        });
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        await User_1.default.removeDeviceToken(this.__request);
        this.__is_paginate = false;
        this.__sendResponse(200, 'You have logged out successfully', []);
        return;
    }
}
exports.default = AdminController;
//# sourceMappingURL=AdminController.js.map