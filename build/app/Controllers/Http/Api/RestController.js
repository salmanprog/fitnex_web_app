"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("../Controller"));
const lodash_1 = __importDefault(require("lodash"));
class RestController extends Controller_1.default {
    constructor(model) {
        super();
        this.__model = this.loadModel(model);
        this.__success_listing_message = 'success_listing_message';
        this.__success_store_message = 'success_store_message';
        this.__success_show_message = 'success_show_message';
        this.__success_update_message = 'success_update_message';
        this.__success_delete_message = 'success_delete_message';
    }
    async index(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        if (lodash_1.default.isFunction(this.validation)) {
            let validator = await this.validation("index");
            if (this.__is_error == true)
                return validator;
        }
        if (lodash_1.default.isFunction(this.beforeIndexLoadModel)) {
            var hookResponse = await this.beforeIndexLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        let records = await this.__model.getRecords(this.__request, this.__request.all());
        if (lodash_1.default.isFunction(this.afterIndexLoadModel)) {
            var afterHookResponse = await this.afterIndexLoadModel(records);
            if (typeof afterHookResponse != 'undefined') {
                records = afterHookResponse;
            }
        }
        await this.__sendResponse(200, 'Record has been retrieved successfully', records);
        return;
    }
    async store(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        if (lodash_1.default.isFunction(this.validation)) {
            let validator = await this.validation("store");
            if (this.__is_error == true)
                return validator;
        }
        if (lodash_1.default.isFunction(this.beforeStoreLoadModel)) {
            var hookResponse = await this.beforeStoreLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        let record = await this.__model.createRecord(this.__request, this.__request.only(this.__model.fillable()));
        if (lodash_1.default.isFunction(this.afterStoreLoadModel)) {
            var afterHookResponse = await this.afterStoreLoadModel(record);
            if (typeof afterHookResponse != 'undefined') {
                record = afterHookResponse;
            }
        }
        this.__is_paginate = false;
        await this.__sendResponse(200, 'Record has been created successfully', record);
        return;
    }
    async show(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        this.__params = ctx.params;
        if (lodash_1.default.isFunction(this.beforeShowLoadModel)) {
            var hookResponse = this.beforeShowLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        let record = await this.__model.getRecordBySlug(this.__request, this.__params.id);
        if (lodash_1.default.isFunction(this.afterShowLoadModel)) {
            var afterHookResponse = await this.afterShowLoadModel(record);
            if (typeof afterHookResponse != 'undefined') {
                record = afterHookResponse;
            }
        }
        this.__is_paginate = false;
        await this.__sendResponse(200, 'Record has been created successfully', record);
        return;
    }
    async update(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        this.__params = ctx.params;
        if (lodash_1.default.isFunction(this.validation)) {
            let validator = await this.validation("update");
            if (this.__is_error == true)
                return validator;
        }
        if (lodash_1.default.isFunction(this.beforeUpdateLoadModel)) {
            var hookResponse = await this.beforeUpdateLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        let record = await this.__model.updateRecord(this.__request, this.__request.only(this.__model.fillable()), this.__params.id);
        if (lodash_1.default.isFunction(this.afterUpdateLoadModel)) {
            var afterHookResponse = await this.afterUpdateLoadModel(record);
            if (typeof afterHookResponse != 'undefined') {
                record = afterHookResponse;
            }
        }
        this.__is_paginate = false;
        await this.__sendResponse(200, 'Record has been updated successfully', record);
        return;
    }
    async destroy(ctx) {
        let record = [];
        this.__request = ctx.request;
        this.__response = ctx.response;
        this.__params = ctx.params;
        if (lodash_1.default.isFunction(this.beforeDestoryLoadModel)) {
            var hookResponse = await this.beforeDestoryLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        await this.__model.deleteRecord(this.__request, this.__request.all(), this.__params.id);
        if (lodash_1.default.isFunction(this.afterDestoryLoadModel)) {
            var afterHookResponse = await this.afterDestoryLoadModel();
            if (typeof afterHookResponse != 'undefined') {
                record = afterHookResponse;
            }
        }
        this.__is_paginate = false;
        await this.__sendResponse(200, 'Record has been deleted successfully', record);
        return;
    }
    loadModel(name) {
        return global[Symbol.for('ioc.use')](`App/Models/${name}`);
    }
}
exports.default = RestController;
//# sourceMappingURL=RestController.js.map