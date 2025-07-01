'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const FileUpload_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Libraries/FileUpload/FileUpload"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const passwordHash = require('password-hash');
const UserSelectedServices_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserSelectedServices"));
const Services_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Services"));
class UserHook {
    static async indexQueryHook(query, request, slug = '') {
        let params = request.all();
        query.select('users.*');
        if (typeof request.apiToken == 'function' && !lodash_1.default.isEmpty(slug)) {
            query.preload('userApiToken', (userApiTokenQuery) => {
                userApiTokenQuery.where('api_token', request.apiToken());
            });
        }
        if (!lodash_1.default.isEmpty(slug.parent_id)) {
            query.where('parent_id', slug.parent_id).where('user_group_id', slug.user_group_id);
        }
        if (!lodash_1.default.isEmpty(slug.created_by)) {
            let sub_users = await User_1.default.getUserHierarchy(slug.created_by);
            if (!lodash_1.default.isEmpty(slug.admin_id)) {
                sub_users.push(slug.admin_id);
            }
            query.whereIn('parent_id', sub_users).where('user_group_id', slug.user_group_id);
        }
        if (lodash_1.default.isEmpty(slug)) {
            query.where('users.user_type', 'user');
        }
        query.preload('SelectedServices').preload('BuildingType').orderBy('id', 'desc');
    }
    static async beforeCreateHook(request, params) {
        if (Env_1.default.get('OTP_DRIVER') == 'Telesign' && Env_1.default.get('OTP_SENDBOX') == 0) {
            params.mobile_otp = request.otpCode();
            params.mobile_otp_created_at = (0, Index_1.currentDateTime)();
        }
        if (!lodash_1.default.isEmpty(request.file('image_url'))) {
            params.image_url = await FileUpload_1.default.doUpload(request.file('image_url'), 'user');
        }
        let username = await User_1.default.generateSlug(params.name);
        params.user_group_id = lodash_1.default.isEmpty(params.user_group_id) ? 2 : params.user_group_id;
        params.parent_id = lodash_1.default.isEmpty(params.parent_id) ? request.user().id : params.parent_id;
        params.user_type = 'user';
        params.password = await passwordHash.generate(params.password);
        params.username = username;
        params.slug = username;
        params.is_email_verify = 1;
        params.created_at = (0, Index_1.currentDateTime)();
    }
    static async afterCreateHook(record, request, params) {
        let request_params = request.all();
        let api_token = User_1.default.generateApiToken(record.email);
        await Database_1.default.table('user_api_tokens').insert({
            user_id: record.id,
            api_token: api_token,
            device_type: request_params.device_type,
            device_token: request_params.device_token,
            platform_type: lodash_1.default.isEmpty(request_params.platform_type) ? 'custom' : request_params.platform_type,
            platform_id: lodash_1.default.isEmpty(request_params.platform_id) ? null : request_params.platform_id,
            ip_address: request.ip(),
            user_agent: request.header('User-Agent'),
            created_at: (0, Index_1.currentDateTime)()
        });
        const Request = Application_1.default.container.use('Adonis/Core/Request');
        Request.macro('apiToken', function () {
            return api_token;
        });
        if (!lodash_1.default.isEmpty(request_params.services_arr)) {
            for (let i = 0; i < request_params.services_arr.length; i++) {
                let slug = await UserSelectedServices_1.default.generateSlug('slctd_' + record.id + request_params.services_arr[i]);
                let get_service = await Services_1.default.query().where('id', request_params.services_arr[i]).first();
                let insert_services = await UserSelectedServices_1.default.create({
                    user_id: record.id,
                    service_id: request_params.services_arr[i],
                    slug: slug,
                    service_name: get_service.title,
                    service_amount: get_service.amount,
                    created_at: (0, Index_1.currentDateTime)()
                });
            }
        }
    }
    static async beforeEditHook(request, params, slug) {
        if (!lodash_1.default.isEmpty(request.file('image_url'))) {
            params.image_url = await FileUpload_1.default.doUpload(request.file('image_url'), 'user');
        }
        let request_params = request.all();
        if (!lodash_1.default.isEmpty(request_params.services_arr)) {
            let get_user = await User_1.default.query().where('slug', slug).first();
            let get_delete_services = await UserSelectedServices_1.default.query().whereNotIn('service_id', request_params.services_arr).where('user_id', get_user.id);
            if (!lodash_1.default.isEmpty(get_delete_services)) {
                for (let j = 0; j < get_delete_services.length; j++) {
                    let delete_services = await UserSelectedServices_1.default.query().where('service_id', get_delete_services[j].service_id).where('user_id', get_user.id).delete();
                }
            }
            let get_remaing_services = await UserSelectedServices_1.default.query().where('user_id', get_user.id);
            let remaing_service_ids = [];
            if (!lodash_1.default.isEmpty(get_remaing_services)) {
                for (let k = 0; k < get_remaing_services.length; k++) {
                    remaing_service_ids.push(get_remaing_services[k].service_id.toString());
                }
            }
            let new_services = lodash_1.default.xor(request_params.services_arr, remaing_service_ids);
            if (!lodash_1.default.isEmpty(new_services)) {
                for (let i = 0; i < new_services.length; i++) {
                    let slug = await UserSelectedServices_1.default.generateSlug('slctd_' + get_user.id + new_services[i]);
                    let get_service = await Services_1.default.query().where('id', new_services[i]).first();
                    let insert_services = await UserSelectedServices_1.default.create({
                        user_id: get_user.id,
                        service_id: new_services[i],
                        slug: slug,
                        service_name: get_service.title,
                        service_amount: get_service.amount,
                        created_at: (0, Index_1.currentDateTime)()
                    });
                }
            }
        }
    }
    static async afterEditHook(request, slug) {
    }
    static async beforeDeleteHook(request, params, slug) {
    }
    static async afterDeleteHook(request, params, slug) {
    }
}
module.exports = UserHook;
//# sourceMappingURL=UserHook.js.map