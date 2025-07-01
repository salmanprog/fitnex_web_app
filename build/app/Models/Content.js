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
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
class Content extends RestModel_1.default {
    static fillable() {
        return ['title', 'slug', 'content', 'api_url', 'status', 'created_at', 'updated_at', 'deleted_at'];
    }
    static async generateSlug(name) {
        let slug = (0, Index_1.strSlug)(name);
        let query = await this.query().where('slug', slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + (0, Index_1.rand)(111, 999);
    }
}
Content.table = 'content_managements';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Content.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Content.prototype, "title", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Content.prototype, "slug", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Content.prototype, "content", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Content.prototype, "api_url", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Content.prototype, "status", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Content.prototype, "created_at", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Content.prototype, "updated_at", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Content.prototype, "deleted_at", void 0);
exports.default = Content;
module.exports = Content;
//# sourceMappingURL=Content.js.map