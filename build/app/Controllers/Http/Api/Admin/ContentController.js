"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RestController_1 = __importDefault(require(".././RestController"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class ContentController extends RestController_1.default {
    constructor() {
        super("Content");
        this.__resource = "Content";
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
            title: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(2),
                Validator_1.rules.maxLength(20)
            ]),
            content: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(2),
                Validator_1.rules.maxLength(20)
            ])
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
}
exports.default = ContentController;
//# sourceMappingURL=ContentController.js.map