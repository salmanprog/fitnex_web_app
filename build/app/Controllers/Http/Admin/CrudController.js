'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const I18n_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/I18n"));
const Controller_1 = __importDefault(require("../Controller"));
const lodash_1 = __importDefault(require("lodash"));
class CrudController extends Controller_1.default {
    constructor(modal) {
        super();
        this.__model = this.loadModal(modal);
        this.__indexView = '';
        this.__createView = '';
        this.__editView = '';
        this.__detailView = '';
        this.__routeName = '';
        this.__is_error = false;
        this.__success_listing_message = 'success_listing_message';
        this.__success_store_message = 'success_store_message';
        this.__success_show_message = 'success_show_message';
        this.__success_update_message = 'success_update_message';
        this.__success_delete_message = 'success_delete_message';
        this.__data = [];
    }
    async index({ request, response, view }) {
        this.__request = request;
        this.__response = response;
        if (lodash_1.default.isFunction(this.beforeRenderIndexView)) {
            let hookResponse = await this.beforeRenderIndexView();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        return await this.loadAdminView(view, this.__indexView, this.__data);
    }
    async ajaxListing(ctx) {
        let params = ctx.request.all();
        let records = {};
        let record_data = [];
        records.data = [];
        let dataTableRecord = await this.__model.dataTableRecords(ctx.request);
        records.draw = parseInt(params['draw']);
        records.recordsTotal = lodash_1.default.isEmpty(dataTableRecord['total_record']) ? 0 : dataTableRecord['total_record'];
        records.recordsFiltered = lodash_1.default.isEmpty(dataTableRecord['total_record']) ? 0 : dataTableRecord['total_record'];
        if (dataTableRecord['records'].length > 0) {
            for (var i = 0; i < dataTableRecord['records'].length; i++) {
                if (lodash_1.default.isFunction(this.dataTableRecords)) {
                    let datatable_data = await this.dataTableRecords(dataTableRecord['records'][i]);
                    record_data.push(datatable_data);
                }
            }
            records.data = record_data;
        }
        return ctx.response.json(records);
    }
    async create({ request, response, view }) {
        this.__request = request;
        this.__response = response;
        if (lodash_1.default.isFunction(this.beforeRenderCreateView)) {
            let hookResponse = await this.beforeRenderCreateView();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        return await this.loadAdminView(view, this.__createView, this.__data);
    }
    async store({ request, response, session }) {
        this.__request = request;
        this.__response = response;
        if (lodash_1.default.isFunction(this.storeValidation)) {
            await this.storeValidation((errors) => {
                session.flash({ errors: errors });
                response.redirect('back');
                return;
            });
        }
        if (lodash_1.default.isFunction(this.beforeStoreLoadModel)) {
            let hookResponse = await this.beforeStoreLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        let record = await this.__model.createRecord(request, request.only(this.__model.fillable()));
        if (lodash_1.default.isFunction(this.afterStoreLoadModel)) {
            var afterHookResponse = await this.afterStoreLoadModel(record);
            if (typeof afterHookResponse != 'undefined') {
                record = afterHookResponse;
            }
        }
        session.flash({ success: I18n_1.default.locale('en').formatMessage(`messages.${this.__success_store_message}`) });
        response.redirect().toRoute(this.__routeName + '.index');
        return;
    }
    async edit({ request, response, params, view, session }) {
        this.__request = request;
        this.__response = response;
        this.__params = params;
        let record = await this.__model.getRecordBySlug(request, params.id);
        if (lodash_1.default.isEmpty(record)) {
            session.withErrors({ error: Antl.formatMessage('messages.invalid_request') }).flashAll();
            response.route(this.__routeName + '.index');
        }
        if (lodash_1.default.isFunction(this.beforeRenderEditView)) {
            let hookResponse = await this.beforeRenderEditView(record);
            if (this.__is_error) {
                return hookResponse;
            }
        }
        this.__data['record'] = record;
        return await this.loadAdminView(view, this.__editView, this.__data);
    }
    async update({ params, request, response, session }) {
        this.__request = request;
        this.__response = response;
        if (lodash_1.default.isFunction(this.updateValidation)) {
            await this.updateValidation(params.id, (errors) => {
                session.flash({ errors: errors });
                response.redirect('back');
                return;
            });
        }
        if (lodash_1.default.isFunction(this.beforeUpdateLoadModel)) {
            let hookResponse = await this.beforeUpdateLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        let record = await this.__model.updateRecord(request, request.only(this.__model.fillable()), params.id);
        if (lodash_1.default.isFunction(this.afterUpdateLoadModel)) {
            var afterHookResponse = await this.afterUpdateLoadModel(record);
            if (typeof afterHookResponse != 'undefined') {
                record = afterHookResponse;
            }
        }
        session.flash({ success: I18n_1.default.locale('en').formatMessage(`messages.${this.__success_update_message}`) });
        response.redirect().toRoute(this.__routeName + '.index');
        return;
    }
    async destroy({ request, response, params }) {
        this.__request = request;
        this.__response = response;
        this.__params = params;
        let body = request.all();
        if (lodash_1.default.isFunction(this.beforeDeleteLoadModel)) {
            let hookResponse = await this.beforeDeleteLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        await this.__model.deleteRecord(request, request.all(), params.id);
        let message = body.length > 1 ? I18n_1.default.locale('en').formatMessage(`messages.success_delete_messages`) : I18n_1.default.locale('en').formatMessage(`messages.success_delete_message`);
        return response.json({ message: message });
    }
    loadModal(name) {
        return global[Symbol.for('ioc.use')](`App/Models/${name}`);
    }
}
exports.default = CrudController;
module.exports = CrudController;
//# sourceMappingURL=CrudController.js.map