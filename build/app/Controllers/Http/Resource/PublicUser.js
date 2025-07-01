"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
class PublicUser {
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
            id: record.id,
            name: record.name,
            slug: record.slug,
            email: record.email,
            mobile_no: record.mobile_number,
            image_url: !lodash_1.default.isEmpty(record.image_url) ? await (0, Index_1.storageUrl)(record.image_url) : (0, Index_1.baseUrl)('/images/user-placeholder.jpg'),
            company_name: record.company_name,
            company_address: record.company_address,
            company_mobile_number: record.company_mobile_number,
            company_email_address: record.company_email_address,
            user_link: record.user_link,
            is_link: record.is_link,
            created_at: record.created_at
        };
    }
}
module.exports = PublicUser;
//# sourceMappingURL=PublicUser.js.map