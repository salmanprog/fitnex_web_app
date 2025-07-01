'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const CrudController_1 = __importDefault(require("./CrudController"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const moment_1 = __importDefault(require("moment"));
class UserController extends CrudController_1.default {
    constructor() {
        super('User');
        this.__data['page_title'] = 'Users Listing';
        this.__indexView = 'user.index';
        this.__createView = 'user.add';
        this.__editView = 'user.edit';
        this.__routeName = 'admin.user';
        this.__request;
        this.__response;
        this.__params = {};
    }
    async storeValidation(cb) {
        let validationRules;
        validationRules = Validator_1.schema.create({
            status: Validator_1.schema.enum(['1', '0']),
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
            status: Validator_1.schema.enum(['1', '0']),
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
        let options = `<a href="${(0, Index_1.baseUrl)('/admin/user/' + record.slug + '/edit')}" title="edit" class="btn btn-sm btn-info"><i class="fa fa-edit"></i></a>`;
        return [
            record.name,
            record.email,
            record.mobile_no,
            record.is_email_verify == 1 ? '<span class="btn btn-xs btn-success">Verified</span>' : '<span class="btn btn-xs btn-danger">Not Verified</span>',
            record.status == 1 ? '<span class="btn btn-xs btn-success">Active</span>' : '<span class="btn btn-xs btn-danger">Disabled</span>',
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
module.exports = UserController;
//# sourceMappingURL=UserController.js.map