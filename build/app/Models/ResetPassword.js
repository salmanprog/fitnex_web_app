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
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
class ResetPassword extends Orm_1.BaseModel {
    static async forgotPassword(record) {
        let resetPasswordToken = record.id + Helpers_1.string.generateRandom(32);
        await Database_1.default.table('reset_passwords').insert({
            email: record.email,
            token: resetPasswordToken,
            created_at: (0, Index_1.currentDateTime)()
        });
        let mail_params = {
            name: record.name,
            link: (0, Index_1.baseUrl)() + 'user/reset-password/' + resetPasswordToken,
            app_name: Env_1.default.get('APP_NAME')
        };
        (0, Index_1.sendMail)('emails/forgot-password', record.email, 'Reset Password', mail_params);
    }
    static async getResetPassReq(token) {
        let record = await this.query()
            .select('u.*')
            .innerJoin('users AS u', 'u.email', '=', 'reset_passwords.email')
            .where('reset_passwords.token', token)
            .first();
        return record;
    }
}
ResetPassword.table = 'reset_passwords';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], ResetPassword.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ResetPassword.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ResetPassword.prototype, "token", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], ResetPassword.prototype, "created_at", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], ResetPassword.prototype, "updated_at", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], ResetPassword.prototype, "deleted_at", void 0);
exports.default = ResetPassword;
//# sourceMappingURL=ResetPassword.js.map