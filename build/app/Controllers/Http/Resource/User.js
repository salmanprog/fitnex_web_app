'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const UserApiToken_1 = __importDefault(require("./UserApiToken"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
class User {
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
            user_group_id: record.user_group_id,
            info: {
                name: record.name,
                nick_name: record.nick_name,
                slug: record.slug,
                email: record.email,
                mobile_no: record.mobile_no,
                dob: record.dob,
                age: record.age,
                is_notify: record.is_notify,
                user_link: record.user_link,
                is_link: record.is_link,
                image_url: !lodash_1.default.isEmpty(record.image_url) ? await (0, Index_1.storageUrl)(record.image_url) : (0, Index_1.baseUrl)('/images/user-placeholder.jpg'),
            },
            status: {
                is_email_verify: record.is_email_verify,
                platform_type: record.platform_type,
                status: record.status,
            },
            meta: await UserApiToken_1.default.initResponse(record.userApiToken, request),
            created_at: record.created_at
        };
    }
}
module.exports = User;
//# sourceMappingURL=User.js.map