"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RestController_1 = __importDefault(require(".././RestController"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Resource_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Resource"));
class ResourceController extends RestController_1.default {
    constructor() {
        super("Resource");
        this.__resource = "Resource";
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
        validationRules = Validator_1.schema.create({
            category_id: Validator_1.schema.string({}, [
                Validator_1.rules.regex(/^[0-9]*$/)
            ]),
            title: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(2)
            ]),
        });
        try {
            validator = await this.__request.validate({ schema: validationRules, messages: {
                    required: '{{ field }} is required to resource',
                    'category_id.regex': 'category id required'
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
    async importResources(ctx) {
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
        let record = await Resource_1.default.resourceImport(this.__request);
        this.__resource = 'Resource';
        this.__is_paginate = false;
        this.__collection = true;
        this.__sendResponse(200, 'All resources have been imported', record);
        return;
    }
}
exports.default = ResourceController;
//# sourceMappingURL=ResourceController.js.map