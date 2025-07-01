"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
class Content {
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
            title: record.title,
            slug: record.slug,
            content: record.content,
            api_url: record.api_url,
            url: (0, Index_1.baseUrl)() + '/content/' + record.slug,
            created_at: record.created_at
        };
    }
}
module.exports = Content;
//# sourceMappingURL=Content.js.map