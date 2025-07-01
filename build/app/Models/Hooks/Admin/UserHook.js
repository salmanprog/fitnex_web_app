'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
class UserHook {
    static async indexQueryHook(query, request, slug = '') {
    }
    static async beforeCreateHook(request, params) {
    }
    static async afterCreateHook(record, request, params) {
    }
    static async beforeEditHook(request, params, slug) {
    }
    static async afterEditHook(request, slug) {
    }
    static async beforeDeleteHook(request, params, slug) {
    }
    static async afterDeleteHook(request, params, slug) {
    }
    static async datatable_query_hook(query, request) {
        let urlParams = new URLSearchParams(request.input('keyword'));
        if (!lodash_1.default.isEmpty(urlParams.get('keyword'))) {
            let keyword = urlParams.get('keyword');
            query.where(function (query) {
                query.where('name', 'like', `${keyword}%`)
                    .orWhere('email', 'like', `${keyword}%`)
                    .orWhere('mobile_no', 'like', `${keyword}%`);
            });
        }
        query.where('users.user_group_id', 3);
    }
}
module.exports = UserHook;
//# sourceMappingURL=UserHook.js.map