"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Config_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Config"));
const lodash_1 = __importDefault(require("lodash"));
class RestModels extends Orm_1.BaseModel {
    static async createRecord(request, params) {
        if (lodash_1.default.isFunction(this.loadHook(request).beforeCreateHook)) {
            await this.loadHook(request).beforeCreateHook(request, params);
        }
        var record = await this.create(params);
        if (lodash_1.default.isFunction(this.loadHook(request).afterCreateHook)) {
            await this.loadHook(request).afterCreateHook(record, request, params);
        }
        var record = await this.getRecordBySlug(request, record.slug);
        return record;
    }
    static async getRecords(request, params = {}) {
        let query = this.query()
            .select()
            .whereNull("deleted_at");
        if (lodash_1.default.isFunction(this.loadHook(request).indexQueryHook)) {
            await this.loadHook(request).indexQueryHook(query, request, params);
        }
        let record_limit = lodash_1.default.isEmpty(params.limit) ? Config_1.default.get("constants.PAGINATION_LIMIT") : parseInt(params.limit);
        query = await query.paginate(lodash_1.default.isEmpty(params.page) ? 1 : params.page, record_limit);
        return query.toJSON();
    }
    static async getRecordBySlug(request, slug) {
        let record;
        let query = this.query()
            .select()
            .whereNull("deleted_at");
        if (lodash_1.default.isFunction(this.loadHook(request).indexQueryHook)) {
            await this.loadHook(request).indexQueryHook(query, request, slug);
        }
        record = await query.where("slug", slug).first();
        if (!lodash_1.default.isEmpty(record)) {
            record = record.toJSON();
        }
        else {
            record = {};
        }
        return record;
    }
    static async updateRecord(request, params, slug) {
        let record;
        if (lodash_1.default.isFunction(this.loadHook(request).beforeEditHook)) {
            await this.loadHook(request).beforeEditHook(request, params, slug);
        }
        if (!lodash_1.default.isEmpty(params)) {
            record = await this.query().where("slug", slug).update(params);
        }
        if (lodash_1.default.isFunction(this.loadHook(request).afterEditHook)) {
            await this.loadHook(request).afterEditHook(record, request, params);
        }
        record = await this.getRecordBySlug(request, slug);
        return record;
    }
    static async deleteRecord(request, params, slug) {
        let slug_arr = [];
        if (slug == 'delete-record') {
            slug_arr = params.slug;
        }
        else {
            slug_arr.push(slug);
        }
        if (lodash_1.default.isFunction(this.loadHook(request).beforeDeleteHook)) {
            await this.loadHook(request).beforeDeleteHook(request, params, slug_arr);
        }
        if (this.__softDelete) {
            await this.query()
                .whereIn("slug", slug_arr)
                .update({ deleted_at: new Date() });
        }
        else {
            await this.query().whereIn("slug", slug_arr).delete();
        }
        if (lodash_1.default.isFunction(this.loadHook(request).afterDeleteHook)) {
            await this.loadHook(request).afterDeleteHook(request, params, slug_arr);
        }
        return true;
    }
    static async dataTableRecords(request) {
        let data = [];
        let params = request.all();
        let query = this.query()
            .select('*')
            .whereNull(this.table + ".deleted_at");
        if (lodash_1.default.isFunction(this.loadHook(request).datatable_query_hook))
            await this.loadHook(request).datatable_query_hook(query, request);
        let total_record = query;
        query = await query.limit(parseInt(params['length'])).offset(parseInt(params['start'])).orderBy(this.table + '.id', 'desc');
        data['records'] = !lodash_1.default.isEmpty(query) ? query : [];
        data['total_record'] = await total_record.getCount();
        return data;
    }
    static loadHook(request) {
        let hookName = this.prototype.constructor.name + 'Hook';
        let url = request.url();
        if (url.includes('api')) {
            return global[Symbol.for('ioc.use')](`App/Models/Hooks/Api/${hookName}`);
        }
        else {
            return global[Symbol.for('ioc.use')](`App/Models/Hooks/Admin/${hookName}`);
        }
    }
}
exports.default = RestModels;
RestModels.__softDelete = true;
//# sourceMappingURL=RestModel.js.map