"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RestController_1 = __importDefault(require(".././RestController"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const lodash_1 = __importDefault(require("lodash"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
class UsersController extends RestController_1.default {
    constructor() {
        super("User");
        this.__resource = "AdminUsers";
        this.__request;
        this.__response;
        this.__params = {};
        this.__success_store_message = 'messages.success_store_message';
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
    }
    async afterIndexLoadModel(records) {
    }
    async beforeStoreLoadModel() {
        let body_params = this.__request.all();
        let check_email = await User_1.default.getUser(body_params.email);
        let check_number = await User_1.default.getUserNumber(body_params.mobile_number);
        if (!lodash_1.default.isEmpty(check_email)) {
            this.__is_error = true;
            return this.sendError('Validation Message', { message: 'Email already associated with another user' }, 400);
        }
        if (!lodash_1.default.isEmpty(check_number)) {
            this.__is_error = true;
            return this.sendError('Validation Message', { message: 'Phone number already associated with another user' }, 400);
        }
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
        let params = this.__request.all();
        let user = this.__request.user();
        let slug = this.__params.id;
        let get_user = await User_1.default.query().where('slug', slug).first();
        let get_child = await User_1.default.getUserHierarchy(get_user.id);
        let delete_all_childe = await User_1.default.query().whereIn('id', get_child).update({ 'deleted_at': (0, Index_1.currentDateTime)() });
    }
    async afterDestoryLoadModel() {
    }
    async userDashboard(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let validationRules = Validator_1.schema.create({});
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let record = await User_1.default.dashBoard(this.__request.user().id, this.__request.user().user_group_id);
        this.__is_paginate = false;
        this.__collection = false;
        this.__sendResponse(200, 'Get Dashboard data retrived successfully', record);
        return;
    }
    async getChildUser(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let validationRules = Validator_1.schema.create({});
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let params = this.__request.all();
        let get_ids = await User_1.default.getUserHierarchy(params.parent_id);
        let record = await User_1.default.getUserByIds(get_ids, params.user_group_id);
        this.__is_paginate = false;
        this.__sendResponse(200, 'User Hierarchy retrived successfully', record);
        return;
    }
}
exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map