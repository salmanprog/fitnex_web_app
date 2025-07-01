"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RestController_1 = __importDefault(require(".././RestController"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const lodash_1 = __importDefault(require("lodash"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const CmsModule_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CmsModule"));
const UserApiToken_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserApiToken"));
const UserGroup_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserGroup"));
const passwordHash = require('password-hash');
class AuthController extends RestController_1.default {
    constructor() {
        super("User");
        this.__resource = "AdminAuth";
        this.__request;
        this.__response;
        this.__params = {};
        this.__success_store_message = 'messages.account_created';
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
            validator = await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            this.__is_error = true;
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        return validator;
    }
    async updateValidation() {
        let validator;
        let validationRules;
        validationRules = Validator_1.schema.create({});
        try {
            validator = await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            this.__is_error = true;
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        return validator;
    }
    async beforeIndexLoadModel() {
        this.__resource = 'AdminAuth';
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
        let user = await User_1.default.getAdminByEmail(body_params.email);
        if (lodash_1.default.isEmpty(user)) {
            return this.sendError('Unauthorized', { message: 'Invalid Credentials' }, 401);
        }
        if (!(await passwordHash.verify(body_params.password, user.password))) {
            return this.sendError('Unauthorized', { message: 'Invalid Credentials' }, 401);
        }
        if (user.status != 1) {
            return this.sendError('Unauthorized', { message: 'Your account has been disabled by the Admin' }, 401);
        }
        if (user.is_email_verify != 1 && Env_1.default.get('MAIL_SANDBOX') == 0) {
            return this.sendError('Unauthorized', { message: 'Your email is not verified. Please check your email and verify your account' }, 401);
        }
        let api_token = await UserApiToken_1.default.createApiToken(this.__request, user.id);
        user.userApiToken = api_token;
        let get_role = await UserGroup_1.default.getById(user.user_group_id);
        user.cms_modules = await CmsModule_1.default.getCmsModules(get_role?.slug, [], { user_group_id: user.user_group_id });
        this.__is_paginate = false;
        await this.__sendResponse(200, 'You have logged in successfully', user);
        return;
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
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map