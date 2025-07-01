"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
class ApplicationSetting {
    static async initResponse(data, request) {
        if (lodash_1.default.isEmpty(data))
            return [];
        let response;
        if (Array.isArray(data)) {
            response = [];
            for (var i = 0; i < data.length; i++) {
                response.push(await this.jsonSchema(data[i], request));
            }
        }
        else {
            response = await this.jsonSchema(data, request);
        }
        return response;
    }
    static async jsonSchema(record, request) {
        return {
            favicon: (0, Index_1.baseUrl)() + '/uploads/' + record.favicon,
            logo: (0, Index_1.baseUrl)() + '/uploads/' + record.logo,
            application_name: record.app_name,
            meta_keyword: record.meta_keyword,
            meta_description: record.meta_description,
        };
    }
}
module.exports = ApplicationSetting;
//# sourceMappingURL=ApplicationSetting.js.map