'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const PublicUser_1 = __importDefault(require("./PublicUser"));
const BuildingType_1 = __importDefault(require("./BuildingType"));
class AdminUsers {
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
        let created_by = await User_1.default.getUserById(record.parent_id);
        let user_status = '';
        if (record.user_status == '1') {
            user_status = 'Approved';
        }
        else if (record.user_status == '2') {
            user_status = 'Rejected';
        }
        else {
            user_status = 'Pending';
        }
        return {
            id: record.id,
            parent_id: record.parent_id,
            created_by: await PublicUser_1.default.initResponse(created_by, request),
            user_group_id: record.user_group_id,
            name: record.name,
            slug: record.slug,
            email: record.email,
            mobile_no: record.mobile_number,
            dob: record.dob,
            age: record.age,
            profile_type: record.profile_type,
            image_url: !lodash_1.default.isEmpty(record.image_url) ? await (0, Index_1.storageUrl)(record.image_url) : (0, Index_1.baseUrl)('/images/user-placeholder.jpg'),
            company_name: record.company_name,
            company_address: record.company_address,
            company_mobile_number: record.company_mobile_number,
            company_email_address: record.company_email_address,
            building_type_id: record.building_type_id,
            building_type: await BuildingType_1.default.initResponse(BuildingType_1.default, request),
            user_link: record.user_link,
            is_link: record.is_link,
            services: record.SelectedServices,
            is_email_verify: record.is_email_verify,
            platform_type: record.platform_type,
            user_status: user_status,
            user_status_number: parseInt(record.user_status),
            status_text: (record.status == 1) ? 'Active' : 'Deactive',
            status: record.status,
        };
    }
}
module.exports = AdminUsers;
//# sourceMappingURL=AdminUsers.js.map