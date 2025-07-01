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
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const luxon_1 = require("luxon");
const lodash_1 = __importDefault(require("lodash"));
class ApplicationSetting extends Orm_1.BaseModel {
    static async getSetting(identifier) {
        let setting;
        let settings = await this.query().where('identifier', identifier);
        if (lodash_1.default.isEmpty(settings)) {
            setting = {
                'app_name': Env_1.default.get('APP_NAME'),
                'meta_keyword': null,
                'meta_description': null,
                'logo': (0, Index_1.baseUrl)() + '/images/logo.png',
                'favicon': (0, Index_1.baseUrl)() + '/images/logo.png',
            };
        }
        else {
            setting = {};
            for (var i = 0; i < settings.length; i++) {
                setting[settings[i].meta_key] = settings[i].value;
            }
        }
        return setting;
    }
}
ApplicationSetting.table = 'application_settings';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], ApplicationSetting.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ApplicationSetting.prototype, "identifier", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ApplicationSetting.prototype, "meta_key", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ApplicationSetting.prototype, "value", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ApplicationSetting.prototype, "is_file", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], ApplicationSetting.prototype, "created_at", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], ApplicationSetting.prototype, "updated_at", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], ApplicationSetting.prototype, "deleted_at", void 0);
exports.default = ApplicationSetting;
//# sourceMappingURL=ApplicationSetting.js.map