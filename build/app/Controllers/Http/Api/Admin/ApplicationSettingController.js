"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RestController_1 = __importDefault(require(".././RestController"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const lodash_1 = __importDefault(require("lodash"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const ApplicationSetting_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ApplicationSetting"));
const FileUpload_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Libraries/FileUpload/FileUpload"));
class ApplicationSettingController extends RestController_1.default {
    constructor() {
        super("ApplicationSetting");
        this.__resource = "ApplicationSetting";
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
    async getSetting(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let validationRules = Validator_1.schema.create({});
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let record = [];
        let identifier = 'application_setting';
        let params = this.__request.all();
        if (this.__request.method() == 'POST') {
            let get_setting = await ApplicationSetting_1.default.getSetting(identifier);
            if (!lodash_1.default.isEmpty(this.__request.file('logo'))) {
                params.logo = await FileUpload_1.default.doUpload(this.__request.file('logo'), identifier);
            }
            else {
                params.logo = get_setting.logo;
            }
            if (!lodash_1.default.isEmpty(this.__request.file('favicon'))) {
                params.favicon = await FileUpload_1.default.doUpload(this.__request.file('favicon'), identifier);
            }
            else {
                params.favicon = get_setting.favicon;
            }
            await ApplicationSetting_1.default.query().where('identifier', identifier).delete();
            let ApplicationSettingData = [];
            for (const [key, value] of Object.entries(params)) {
                ApplicationSettingData.push({
                    identifier: identifier,
                    meta_key: key,
                    value: value,
                    is_file: key == 'logo' || key == 'favicon' ? '1' : '0',
                    created_at: (0, Index_1.currentDateTime)(),
                });
            }
            await ApplicationSetting_1.default.createMany(ApplicationSettingData);
            record = await ApplicationSetting_1.default.getSetting(identifier);
        }
        else {
            record = await ApplicationSetting_1.default.getSetting(identifier);
        }
        this.__is_paginate = false;
        this.__resource = 'ApplicationSetting';
        this.__sendResponse(200, 'Validation Message', record);
        return;
    }
}
exports.default = ApplicationSettingController;
//# sourceMappingURL=ApplicationSettingController.js.map