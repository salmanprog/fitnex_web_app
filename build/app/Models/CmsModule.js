"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const RestModel_1 = __importDefault(require("./RestModel"));
const CmsModulePermission_1 = __importDefault(require("./CmsModulePermission"));
const lodash_1 = __importDefault(require("lodash"));
class CmsModule extends RestModel_1.default {
    static fillable() {
        return ['parent_id', 'name', 'route_name', 'icon', 'is_parent', 'status', 'sort_order', 'created_at',
            'updated_at', 'deleted_at'];
    }
    static async getCmsModules(role_slug = 'super-admin', module_permission = [], params = {}) {
        let modules = [];
        let query = this.query();
        let records = await this.query().where({ status: true }).where('parent_id', 0);
        records = lodash_1.default.isEmpty(records) ? [] : records;
        let role_modules = await CmsModulePermission_1.default.query().where('user_group_id', params.user_group_id);
        role_modules = lodash_1.default.isEmpty(role_modules) ? [] : role_modules;
        if (role_slug != 'super-admin') {
            if (role_modules) {
                for (let m = 0; m < role_modules.length; m++) {
                    const matchingRecord = records.find(record => record.id === role_modules[m].cms_module_id);
                    if (matchingRecord) {
                        let record = matchingRecord.toJSON();
                        record.is_add = role_modules[m].is_add;
                        record.is_view = role_modules[m].is_view;
                        record.is_update = role_modules[m].is_update;
                        record.is_delete = role_modules[m].is_delete;
                        let child_records = await this.query().where({ 'parent_id': record.id }).where({ status: true });
                        child_records = lodash_1.default.isEmpty(child_records) ? [] : child_records;
                        record.submodules = child_records;
                        modules.push(record);
                    }
                }
                return modules;
            }
            else {
                return modules;
            }
        }
        else {
            for (var j = 0; j < records.length; j++) {
                if (records[j].is_parent == 1) {
                    let child_records = await this.query().where({ 'parent_id': records[j].id }).where({ status: true });
                    child_records = lodash_1.default.isEmpty(child_records) ? [] : child_records;
                    records[j].child_menu = child_records;
                }
            }
            return records;
        }
    }
}
CmsModule.table = 'cms_modules';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], CmsModule.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CmsModule.prototype, "parent_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CmsModule.prototype, "name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CmsModule.prototype, "route_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CmsModule.prototype, "icon", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CmsModule.prototype, "is_parent", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CmsModule.prototype, "status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CmsModule.prototype, "sort_order", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], CmsModule.prototype, "created_at", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], CmsModule.prototype, "updated_at", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], CmsModule.prototype, "deleted_at", void 0);
exports.default = CmsModule;
module.exports = CmsModule;
//# sourceMappingURL=CmsModule.js.map