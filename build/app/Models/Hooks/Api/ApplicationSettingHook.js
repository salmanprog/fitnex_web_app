'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class ApplicationSettingHook {
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
}
ApplicationSettingHook.except_update_params = [];
module.exports = ApplicationSettingHook;
//# sourceMappingURL=ApplicationSettingHook.js.map