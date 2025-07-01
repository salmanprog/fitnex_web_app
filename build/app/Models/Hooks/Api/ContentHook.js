'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Content_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Content"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
class ContentHook {
    static async indexQueryHook(query, request, slug = '') {
    }
    static async beforeCreateHook(request, params) {
        let slug = await Content_1.default.generateSlug(params.title);
        params.slug = slug;
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
}
ContentHook.except_update_params = [];
module.exports = ContentHook;
//# sourceMappingURL=ContentHook.js.map