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
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const lodash_1 = __importDefault(require("lodash"));
const luxon_1 = require("luxon");
const RestModel_1 = __importDefault(require("./RestModel"));
class Media extends RestModel_1.default {
    static fillable() {
        return [
            'slug', 'user_id', 'module', 'module_id', 'filename', 'original_name', 'file_url', 'file_url_blur', 'thumbnail_url', 'mime_type', 'file_type', 'driver', 'media_type', 'meta', 'created_at', 'updated_at', 'deleted_at'
        ];
    }
    static async getMediaByType(module_id, module, file_type = null) {
        let query = this.query()
            .select('*')
            .whereNull("deleted_at");
        if (!lodash_1.default.isEmpty(file_type)) {
            query.where('file_type', file_type);
        }
        query = await query.where('module', module).where('module_id', module_id);
        return query;
    }
    static async getById(id) {
        let query = this.query()
            .select('*')
            .whereNull("deleted_at");
        query = await query.where('id', id).first();
        return query.toJSON();
    }
}
Media.table = 'media';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Media.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Media.prototype, "user_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Media.prototype, "slug", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Media.prototype, "module", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Media.prototype, "module_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Media.prototype, "filename", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Media.prototype, "original_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Media.prototype, "file_url", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Media.prototype, "file_url_blur", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Media.prototype, "thumbnail_url", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Media.prototype, "mime_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Media.prototype, "file_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Media.prototype, "driver", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Media.prototype, "media_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Media.prototype, "meta", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Media.prototype, "created_at", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Media.prototype, "updated_at", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Media.prototype, "deleted_at", void 0);
exports.default = Media;
module.exports = Media;
//# sourceMappingURL=Media.js.map