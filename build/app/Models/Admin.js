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
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Config_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Config"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const lodash_1 = __importDefault(require("lodash"));
const luxon_1 = require("luxon");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RestModel_1 = __importDefault(require("./RestModel"));
const UserApiToken_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserApiToken"));
const Gender_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Gender"));
const Sex_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Sex"));
const SexOrientation_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/SexOrientation"));
var UserType;
(function (UserType) {
    UserType[UserType["admin"] = 0] = "admin";
    UserType[UserType["user"] = 1] = "user";
})(UserType || (UserType = {}));
class User extends RestModel_1.default {
    static fillable() {
        return [
            'user_group_id', 'user_type', 'name', 'nick_name', 'username', 'slug', 'email', 'dob', 'age', 'password', 'image_url',
            'gender', 'sex', 'sex_orientation', 'is_email_verify', 'email_verify_at', 'status', 'platform_type', 'platform_id',
            'email_otp', 'email_otp_created_at', 'created_at', 'updated_at', 'deleted_at'
        ];
    }
    static async adminAuth(email) {
        let record = await this.query()
            .where('email', email)
            .where('user_type', 'admin')
            .first();
        return record;
    }
    static generateApiToken(email) {
        let jwt_options = {
            algorithm: 'HS256',
            expiresIn: Config_1.default.get('constants.JWT_EXPIRY'),
            issuer: Config_1.default.get('constants.CLIENT_ID'),
            subject: Config_1.default.get('constants.CLIENT_ID'),
            jwtid: email
        };
        var token = jsonwebtoken_1.default.sign({ email: email }, Config_1.default.get('constants.JWT_SECRET'), jwt_options);
        return token;
    }
    static async generateSlug(name) {
        let slug = (0, Index_1.strSlug)(name);
        let query = await this.query().where('slug', slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + (0, Index_1.rand)(111, 999);
    }
    static async getUserByEmail(email) {
        let record = await this.query().preload('Gender').preload('Sex').preload('SexOrientation').where('email', email).whereNull('deleted_at').first();
        return record;
    }
    static async updateUser(data, condition) {
        await this.query().where(condition).update(data);
        return true;
    }
    static async updateResetPassword(params) {
        let new_password = await Hash_1.default.make(params.new_password);
        await Database_1.default.query().from('users').where('email', params.email).update({
            password: new_password
        });
        await Database_1.default.query().from('reset_passwords').where('email', params.email).delete();
        return true;
    }
    static async getUserByApiToken(api_token) {
        let query = this.query()
            .select('users.*', 'uat.device_type', 'uat.device_token', 'uat.platform_type')
            .innerJoin('user_api_tokens AS uat', 'uat.user_id', '=', 'users.id')
            .where('api_token', api_token)
            .first();
        return query;
    }
    static async socialLogin(request) {
        let record;
        let api_token;
        let params = request.all();
        if (!lodash_1.default.isEmpty(params.email)) {
            record = await this.getUserByEmail(params.email);
        }
        if (lodash_1.default.isEmpty(record)) {
            record = await this.getSocialUser(params.platform_id, params.platform_type);
        }
        if (lodash_1.default.isEmpty(record)) {
            let password = Helpers_1.string.generateRandom(32);
            let username = await this.generateSlug((0, Index_1.strSlug)(params.name));
            record = await this.create({
                name: params.name,
                user_group_id: 2,
                user_type: 'user',
                email: params.email,
                image_url: lodash_1.default.isEmpty(params.image_url) ? null : params.image_url,
                password: await Hash_1.default.make(password),
                username: username,
                slug: username,
                platform_type: params.platform_type,
                platform_id: params.platform_id,
                is_email_verify: true,
                email_verify_at: (0, Index_1.currentDateTime)(),
                created_at: (0, Index_1.currentDateTime)()
            });
        }
        api_token = await UserApiToken_1.default.createApiToken(request, record.id);
        record.userApiToken = api_token;
        return record;
    }
    static async getSocialUser(platform_id, platform_type) {
        let record = await this.query()
            .from('user_api_tokens AS uat')
            .select('u.*', 'uat.api_token')
            .innerJoin('users AS u', 'u.id', '=', 'uat.user_id')
            .where('uat.platform_id', platform_id)
            .where('uat.platform_type', platform_type)
            .first();
        return record;
    }
    static async removeDeviceToken(request) {
        let params = request.all();
        let user = request.user();
        await UserApiToken_1.default.query()
            .where('user_id', user.id)
            .where('device_type', params.device_type)
            .where('device_token', params.device_token)
            .delete();
        return true;
    }
    static async getTargetUsersByID(user_id) {
        let query = await this.query()
            .join('user_api_tokens AS uat', 'uat.user_id', '=', 'users.id')
            .select('users.*', 'uat.device_token', 'uat.device_type')
            .where('users.id', user_id)
            .where('users.status', '1');
        return query;
    }
}
User.table = 'users';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "user_group_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "user_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "nick_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "slug", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "dob", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "image_url", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "gender", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "sex", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "sex_orientation", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "is_email_verify", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "email_verify_at", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "email_otp", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "email_otp_created_at", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], User.prototype, "created_at", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "deleted_at", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "device_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "device_token", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "platform_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "platform_id", void 0);
__decorate([
    (0, Orm_1.hasOne)(() => UserApiToken_1.default, {
        foreignKey: 'user_id',
        localKey: 'id'
    }),
    __metadata("design:type", Object)
], User.prototype, "userApiToken", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Gender_1.default, {
        foreignKey: 'gender'
    }),
    __metadata("design:type", Object)
], User.prototype, "Gender", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Sex_1.default, {
        foreignKey: 'sex'
    }),
    __metadata("design:type", Object)
], User.prototype, "Sex", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => SexOrientation_1.default, {
        foreignKey: 'sex_orientation'
    }),
    __metadata("design:type", Object)
], User.prototype, "SexOrientation", void 0);
exports.default = User;
module.exports = User;
//# sourceMappingURL=Admin.js.map