"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const RestController_1 = __importDefault(require("./RestController"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const UserApiToken_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserApiToken"));
const ResetPassword_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ResetPassword"));
const lodash_1 = __importDefault(require("lodash"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Twillio_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Libraries/OtpVerification/Twillio"));
const Telesign_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Libraries/OtpVerification/Telesign"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const Request = Application_1.default.container.use('Adonis/Core/Request');
const passwordHash = require('password-hash');
class UsersController extends RestController_1.default {
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
        validationRules = Validator_1.schema.create({
            name: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(2),
                Validator_1.rules.maxLength(20),
                Validator_1.rules.regex(/^[A-Za-z0-9\s]+$/)
            ]),
            nick_name: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(2),
                Validator_1.rules.maxLength(20),
                Validator_1.rules.regex(/^[A-Za-z0-9\s]+$/)
            ]),
            email: Validator_1.schema.string({}, [
                Validator_1.rules.email(),
                Validator_1.rules.maxLength(50),
                Validator_1.rules.unique({
                    table: 'users',
                    column: 'email',
                    where: {
                        deleted_at: null,
                    },
                })
            ]),
            martial_status: Validator_1.schema.string({}, [
                Validator_1.rules.regex(/^[0-9]*$/)
            ]),
            password: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(8),
                Validator_1.rules.maxLength(100),
                Validator_1.rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/)
            ]),
            confirm_password: Validator_1.schema.string({}, [
                Validator_1.rules.confirmed('password')
            ]),
            device_type: Validator_1.schema.enum(['ios', 'android', 'web']),
            device_token: Validator_1.schema.string()
        });
        try {
            validator = await this.__request.validate({ schema: validationRules, messages: {
                    required: '{{ field }} is required to sign up',
                    'email.unique': 'email already exist in our recorde',
                    'martial_status.regex': 'only number allowed'
                }
            });
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
        validationRules = Validator_1.schema.create({
            name: Validator_1.schema.string.optional({}, [
                Validator_1.rules.minLength(2),
                Validator_1.rules.maxLength(20),
                Validator_1.rules.regex(/^[A-Za-z0-9\s]+$/)
            ]),
            device_type: Validator_1.schema.enum.optional(['ios', 'android', 'web']),
            device_token: Validator_1.schema.string.optional()
        });
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
        this.__resource = 'PublicUser';
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
        let user = this.__request.user();
        if (user.slug != this.__params.id) {
            this.__is_error = true;
            return this.sendError('Validation Message', { message: 'invalid request' }, 400);
        }
        if (!lodash_1.default.isEmpty(this.__request.file('image_url'))) {
            let fileValidate = (0, Index_1.fileValidation)(this.__request.file('image_url'), 6000000);
            if (fileValidate.error) {
                this.__is_error = true;
                return this.sendError('Validation Message', { message: fileValidate.message }, 400);
            }
        }
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
        let user = await User_1.default.getUserByEmail(body_params.email);
        if (lodash_1.default.isEmpty(user)) {
            return this.sendError('Unauthorized', { message: 'Invalid Credentials' }, 400);
        }
        if (!(await passwordHash.verify(body_params.password, user.password))) {
            return this.sendError('Unauthorized', { message: 'Invalid Credentials' }, 400);
        }
        if (user.status != 1) {
            return this.sendError('Unauthorized', { message: 'Your account has been disabled by the Admin' }, 400);
        }
        if (user.is_email_verify != 1 && Env_1.default.get('MAIL_SANDBOX') == 0) {
            return this.sendError('Unauthorized', { message: 'Your email is not verified. Please check your email and verify your account' }, 400);
        }
        let api_token = await UserApiToken_1.default.createApiToken(this.__request, user.id);
        user.userApiToken = api_token;
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
        if (!(await passwordHash.verify(body_params.current_password, user.password))) {
            return this.sendError('Validation Message', { message: 'Your current password is not valid' }, 400);
        }
        else if (body_params.new_password == body_params.current_password) {
            return this.sendError('Validation Message', { message: 'The current password and new password must be different' }, 400);
        }
        else {
            let newPassword = await passwordHash.generate(body_params.new_password);
            await User_1.default.updateUser({ password: newPassword }, { id: user.id });
            UserApiToken_1.default.deleteApiTokenExceptCurrentToken(user.id, this.__request.apiToken()).then();
            this.__is_paginate = false;
            this.__collection = false;
            this.__sendResponse(200, 'Password has been updated successfully', []);
            return;
        }
    }
    async socialLogin(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let validationRules = Validator_1.schema.create({
            platform_id: Validator_1.schema.string({}, [
                Validator_1.rules.maxLength(200),
            ]),
            platform_type: Validator_1.schema.enum(['facebook', 'google', 'apple']),
            device_type: Validator_1.schema.enum(['android', 'ios', 'web']),
            device_token: Validator_1.schema.string(),
        });
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let record = await User_1.default.socialLogin(this.__request);
        this.__is_paginate = false;
        this.__sendResponse(200, 'You have logged in successfully', record);
        return;
    }
    async verifyCode(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let params = this.__request.all();
        let validationRules = Validator_1.schema.create({
            code: Validator_1.schema.string({}, [
                Validator_1.rules.maxLength(6),
            ]),
        });
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let user = this.__request.user();
        if (Env_1.default.get('OTP_SENDBOX') == 0) {
            let twillio_response = await Twillio_1.default.verifyOtp(user.mobile_no, params.code);
            if (twillio_response.code != 200) {
                return this.sendError('SMS gateway error', { message: twillio_response.message }, 400);
            }
        }
        if (Env_1.default.get('OTP_SENDBOX') == 0) {
            if (user.mobile_otp != params.code) {
                return this.sendError('SMS gateway error', { message: 'OTP is invalid' }, 400);
            }
        }
        let data = {
            mobile_otp: null,
            is_mobile_verify: '1',
            mobile_verify_at: new Date()
        };
        User_1.default.updateUser(data, { id: user.id }).then();
        user.is_mobile_verify = data.is_mobile_verify;
        user.mobile_verify_at = data.mobile_verify_at;
        this.__is_paginate = false;
        this.__sendResponse(200, 'Mobile number has been verified successfully', user);
        return;
    }
    async resendCode(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let user = this.__request.user();
        if (Env_1.default.get('OTP_SENDBOX') == 0) {
            let twillio_response = await Twillio_1.default.sendOtp(user.mobile_no);
            if (twillio_response.code != 200) {
                this.__is_error = true;
                return this.sendError('SMS gateway Error', { message: twillio_response.message }, 400);
            }
        }
        if (Env_1.default.get('OTP_SENDBOX') == 0) {
            let otp_code = (0, Index_1.rand)(1111, 9999);
            let telesignResponse = await Telesign_1.default.sendOtp(user.mobile_no, otp_code);
            if (telesignResponse.code != 200) {
                return this.sendError('SMS gateway Error', { message: telesignResponse.message }, 400);
            }
            let data = {
                mobile_otp: otp_code,
                mobile_otp_created_at: new Date()
            };
            User_1.default.updateUser(data, { id: user.id }).then();
        }
        this.__is_paginate = false;
        this.__sendResponse(200, 'OTP has been send successfully', user);
        return;
    }
    async getUserLogs(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let user = this.__request.user();
        let validationRules = Validator_1.schema.create({});
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let params = this.__request.all();
        let record = await UserQuickLog.getLogsByMonthYear(params.month, params.year, user.id, params.is_by_date, params.log_date, params.log_type, params.created_at);
        this.__resource = 'UserQuickLogByCalender';
        this.__is_paginate = false;
        await this.__sendResponse(200, 'get all record of curren month and year', record);
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
    async userGeneratedLink(ctx) {
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
        if (!lodash_1.default.isEmpty(user)) {
            return this.sendError('Validation Error', { message: 'Email already exits' }, 400);
        }
        let record = await User_1.default.gernateUser(this.__request);
        let generateLinkToken = record.id + Helpers_1.string.generateRandom(32);
        let update_user = await User_1.default.updateUser({ 'user_link': generateLinkToken, 'is_link': '1' }, { 'id': record.id });
        let get_user = await User_1.default.getUserById(record.id);
        this.__is_paginate = false;
        this.__sendResponse(200, 'Link generated by user', get_user);
        return;
    }
    async userVerifyLink(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let validationRules = Validator_1.schema.create({
            name: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(2),
                Validator_1.rules.maxLength(20),
                Validator_1.rules.regex(/^[A-Za-z0-9\s]+$/)
            ]),
            password: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(8),
                Validator_1.rules.maxLength(100),
                Validator_1.rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/)
            ]),
            confirm_password: Validator_1.schema.string({}, [
                Validator_1.rules.confirmed('password')
            ]),
            user_link: Validator_1.schema.string()
        });
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            this.__is_error = true;
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let body_params = this.__request.all();
        let user = await User_1.default.getUserByLinkToken(body_params.user_link);
        if (lodash_1.default.isEmpty(user)) {
            return this.sendError('Validation Error', { message: 'Link has been expire' }, 400);
        }
        let update_user = await User_1.default.updateUser({ 'name': body_params.name, 'mobile_number': body_params.mobile_number, 'password': await passwordHash.generate(body_params.password), 'dob': body_params.dob, 'user_link': null, 'is_link': '0', 'status': '1' }, { 'id': user.id });
        let get_user = await User_1.default.getUserById(user.id);
        this.__is_paginate = false;
        this.__sendResponse(200, 'User has been created successfully', get_user);
        return;
    }
    async getUserByLink(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        this.__params = ctx.params;
        let validationRules = Validator_1.schema.create({});
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            this.__is_error = true;
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let body_params = this.__request.all();
        let linkToken = this.__params.slug;
        let user = await User_1.default.getUserByLinkToken(linkToken);
        if (lodash_1.default.isEmpty(user)) {
            return this.sendError('Validation Error', { message: 'Link has been expire' }, 400);
        }
        this.__is_paginate = false;
        this.__sendResponse(200, 'User has been retrived successfully', user);
        return;
    }
    async getUserListLink(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let validationRules = Validator_1.schema.create({});
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            this.__is_error = true;
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let body_params = this.__request.all();
        let users = await User_1.default.getUserLists();
        this.__resource = "InviteUsers";
        this.__is_paginate = false;
        this.__sendResponse(200, 'User has been retrived successfully', users);
        return;
    }
}
exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map