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
const luxon_1 = require("luxon");
const lodash_1 = __importDefault(require("lodash"));
const User_1 = __importDefault(require("./User"));
const RestModel_1 = __importDefault(require("./RestModel"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
var DeviceType;
(function (DeviceType) {
    DeviceType[DeviceType["web"] = 0] = "web";
    DeviceType[DeviceType["ios"] = 1] = "ios";
    DeviceType[DeviceType["android"] = 2] = "android";
})(DeviceType || (DeviceType = {}));
class UserApiToken extends RestModel_1.default {
    static async createApiToken(request, user_id) {
        let request_params = request.all();
        let api_token = User_1.default.generateApiToken(request_params.email);
        let record = await this.create({
            user_id: user_id,
            api_token: api_token,
            device_type: request_params.device_type,
            device_token: request_params.device_token,
            platform_type: lodash_1.default.isEmpty(request_params.platform_type) ? 'custom' : request_params.platform_type,
            platform_id: lodash_1.default.isEmpty(request_params.platform_id) ? null : request_params.platform_id,
            ip_address: request.ip(),
            user_agent: request.header('User-Agent'),
            created_at: (0, Index_1.currentDateTime)()
        });
        return record;
    }
    static async deleteApiToken(user_id) {
        await this.query().where('user_id', user_id).delete();
        return true;
    }
    static async deleteApiTokenExceptCurrentToken(user_id, api_token) {
        await this.query().where('user_id', user_id)
            .where('api_token', '<>', api_token).delete();
        return true;
    }
}
UserApiToken.table = 'user_api_tokens';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], UserApiToken.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], UserApiToken.prototype, "user_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserApiToken.prototype, "api_token", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], UserApiToken.prototype, "device_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserApiToken.prototype, "device_token", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserApiToken.prototype, "platform_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserApiToken.prototype, "platform_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserApiToken.prototype, "ip_address", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserApiToken.prototype, "user_agent", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], UserApiToken.prototype, "created_at", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], UserApiToken.prototype, "updated_at", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], UserApiToken.prototype, "deleted_at", void 0);
module.exports = UserApiToken;
exports.default = UserApiToken;
//# sourceMappingURL=UserApiToken.js.map