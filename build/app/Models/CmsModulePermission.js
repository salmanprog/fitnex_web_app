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
class CmsModulePermission extends RestModel_1.default {
    static fillable() {
        return ['user_group_id', 'user_id', 'cms_module_id', 'is_add', 'is_view', 'is_update', 'is_delete', 'status', 'created_at',
            'updated_at', 'deleted_at'];
    }
}
CmsModulePermission.table = 'cms_module_permissions';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], CmsModulePermission.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CmsModulePermission.prototype, "user_group_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CmsModulePermission.prototype, "user_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CmsModulePermission.prototype, "cms_module_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CmsModulePermission.prototype, "is_add", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CmsModulePermission.prototype, "is_view", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CmsModulePermission.prototype, "is_update", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CmsModulePermission.prototype, "is_delete", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CmsModulePermission.prototype, "status", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], CmsModulePermission.prototype, "created_at", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], CmsModulePermission.prototype, "updated_at", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], CmsModulePermission.prototype, "deleted_at", void 0);
exports.default = CmsModulePermission;
module.exports = CmsModulePermission;
//# sourceMappingURL=CmsModulePermission.js.map