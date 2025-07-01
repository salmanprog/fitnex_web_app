'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
class FaqHook {
    static async indexQueryHook(query, request, slug = '') {
    }
    static async beforeCreateHook(request, params) {
        params.slug = (0, moment_1.default)().valueOf();
        params.created_at = (0, Index_1.currentDateTime)();
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
        if (!_.isEmpty(urlParams.get('keyword'))) {
            let keyword = urlParams.get('keyword');
            query.where(function (query) {
                query.where('question', 'like', `${keyword}%`)
                    .orWhere('created_at', 'like', `${keyword}%`);
            });
        }
    }
}
module.exports = FaqHook;
//# sourceMappingURL=FaqHook.js.map