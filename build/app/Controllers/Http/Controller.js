"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const ApplicationSetting_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ApplicationSetting"));
const moment_1 = __importDefault(require("moment"));
class Controller {
    constructor() {
        this.__is_error = false;
        this.__is_paginate = true;
        this.__collection = true;
    }
    setValidatorMessagesResponse(messages, type = 'api') {
        let error_messages = type == 'api' ? {} : '';
        messages = messages.errors;
        if (messages.length > 0) {
            for (var i = 0; i < messages.length; i++) {
                if (type == 'api')
                    error_messages[messages[i].field] = messages[i].message;
                else
                    error_messages += '<p>' + messages[i].message + '</p>';
            }
        }
        return error_messages;
    }
    async __sendResponse(code = 200, message = "success", data = {}) {
        let links = this.paginateLinks(data);
        let results = this.__is_paginate ? data.data : data;
        let obj = {};
        if (this.__collection) {
            let resource = this.loadResource();
            results = await resource.initResponse(results, this.__request);
            obj.code = code;
            obj.message = message;
            obj.data = results;
            obj.links = links;
        }
        else {
            obj.code = code;
            obj.message = message;
            obj.data = results;
            obj.links = links;
        }
        this.__response.status(code).send(obj);
        return;
    }
    paginateLinks(data) {
        let links = {};
        if (this.__is_paginate) {
            links = {
                total: data.meta.total,
                per_page: data.meta.per_page,
                current_page: data.meta.current_page,
                last_page: data.meta.last_page,
                prev: parseInt(data.meta.current_page) - 1,
                next: parseInt(data.meta.current_page) + 1,
            };
        }
        else {
            links = {
                first: null,
                last: null,
                prev: null,
                next: null,
            };
        }
        return links;
    }
    sendError(error = 'Validation Message', error_message = {}, http_status_code = 400) {
        let obj = {
            code: http_status_code,
            message: error,
            data: error_message,
        };
        this.__response.status(http_status_code).send(obj);
        return;
    }
    async loadAdminView(viewClass, viewPath, data = []) {
        let driveUrl = (0, Index_1.baseUrl)() + await Drive_1.default.getUrl('/');
        data.storage_url = function (path) {
            return driveUrl + path;
        };
        data.application_setting = await ApplicationSetting_1.default.getSetting('application-setting');
        data.current_year = (0, moment_1.default)().format('YYYY');
        return viewClass.render('admin.' + viewPath, data);
    }
    loadResource() {
        return global[Symbol.for('ioc.use')](`App/Controllers/Http/Resource/${this.__resource}`);
    }
}
exports.default = Controller;
//# sourceMappingURL=Controller.js.map