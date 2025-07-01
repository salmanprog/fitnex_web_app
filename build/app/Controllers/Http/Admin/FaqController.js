'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const CrudController_1 = __importDefault(require("./CrudController"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const moment_1 = __importDefault(require("moment"));
class FaqController extends CrudController_1.default {
    constructor() {
        super('Faq');
        this.__data['page_title'] = 'FAQ';
        this.__indexView = 'faq.index';
        this.__createView = 'faq.add';
        this.__editView = 'faq.edit';
        this.__routeName = 'admin.faq';
        this.__request;
        this.__response;
        this.__params = {};
    }
    async storeValidation(cb) {
        let validationRules;
        validationRules = Validator_1.schema.create({
            question: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(2),
                Validator_1.rules.maxLength(200),
            ]),
            answer: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(2),
                Validator_1.rules.maxLength(1000),
            ]),
        });
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            this.__is_error = true;
            let messages = this.setValidatorMessagesResponse(error.messages, 'admin');
            cb(messages);
        }
        return true;
    }
    async updateValidation(slug, cb) {
        let validationRules;
        validationRules = Validator_1.schema.create({
            question: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(2),
                Validator_1.rules.maxLength(200),
            ]),
            answer: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(2),
                Validator_1.rules.maxLength(1000),
            ]),
        });
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            this.__is_error = true;
            let messages = this.setValidatorMessagesResponse(error.messages, 'admin');
            cb(messages);
        }
        return true;
    }
    async beforeIndexLoadModel() {
    }
    async afterIndexLoadModel(records) {
    }
    async dataTableRecords(record) {
        let options = `<a href="${(0, Index_1.baseUrl)('/admin/faq/' + record.slug + '/edit')}" title="edit" class="btn btn-sm btn-info"><i class="fa fa-edit"></i></a>`;
        options += '<a title="Delete" class="btn btn-sm btn-danger _delete_record"><i class="fa fa-trash"></i></a>';
        return [
            `<input type="checkbox" name="record_id[]" class="record_id" value="${record.slug}"></input>`,
            record.question,
            (0, moment_1.default)(record.created_at).format('MM-DD-YYYY hh:mm A'),
            options
        ];
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
module.exports = FaqController;
//# sourceMappingURL=FaqController.js.map