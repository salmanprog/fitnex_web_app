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
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const lodash_1 = __importDefault(require("lodash"));
const luxon_1 = require("luxon");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RestModel_1 = __importDefault(require("./RestModel"));
const UserApiToken_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserApiToken"));
const Job_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Job"));
const JobAssignee_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/JobAssignee"));
const Order_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Order"));
const ProductCategory_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ProductCategory"));
const Services_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Services"));
const UserSelectedServices_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserSelectedServices"));
const BuildingType_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/BuildingType"));
const moment_1 = __importDefault(require("moment"));
const passwordHash = require('password-hash');
var UserType;
(function (UserType) {
    UserType[UserType["admin"] = 0] = "admin";
    UserType[UserType["user"] = 1] = "user";
})(UserType || (UserType = {}));
class User extends RestModel_1.default {
    static fillable() {
        return [
            'user_group_id', 'created_by', 'parent_id', 'user_type', 'name', 'nick_name', 'username', 'slug', 'email', 'mobile_number', 'dob', 'age', 'password', 'image_url', 'company_name', 'company_address', 'company_mobile_number', 'company_email_address', 'building_type_id', 'user_link', 'is_link',
            'gender', 'profile_type', 'total_no_user', 'total_no_request', 'is_email_verify', 'email_verify_at', 'user_status', 'status', 'platform_type', 'platform_id',
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
    static async getUserById(id) {
        let record = await this.query()
            .where('id', id)
            .where('user_type', 'user')
            .first();
        return record;
    }
    static async getUserByLinkToken(user_link) {
        let record = await this.query()
            .where('user_link', user_link)
            .where('user_type', 'user')
            .first();
        return record;
    }
    static async getUserLists() {
        let record = await this.query()
            .whereNotNull('user_link')
            .where('is_link', '1')
            .where('status', '0')
            .where('user_type', 'user')
            .whereNull('deleted_at');
        return record;
    }
    static async getUser(email) {
        let record = await this.query()
            .where('email', email)
            .where('user_type', 'user')
            .first();
        return record;
    }
    static async getUserNumber(mobile_number) {
        let record = await this.query()
            .where('mobile_number', mobile_number)
            .where('user_type', 'user')
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
        let record = await this.query().where('email', email).whereNull('deleted_at').first();
        return record;
    }
    static async getUserByIds(ids, user_group_id) {
        let record = await this.query().whereIn('id', ids).where('user_group_id', user_group_id).whereNull('deleted_at');
        return record;
    }
    static async getAdminByEmail(email) {
        let record = await this.query().where('email', email).whereNull('deleted_at').first();
        return record;
    }
    static async updateUser(data, condition) {
        await this.query().where(condition).update(data);
        return true;
    }
    static async updateResetPassword(params) {
        let new_password = await passwordHash.generate(params.new_password);
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
                password: await passwordHash.generate(password),
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
    static async gernateUser(request) {
        let record;
        let api_token;
        let params = request.all();
        let password = Helpers_1.string.generateRandom(32);
        let username = await this.generateSlug((0, Index_1.strSlug)('user_' + password));
        record = await this.create({
            name: params.name,
            user_group_id: params.user_group_id,
            user_type: 'user',
            email: params.email,
            created_by: params.created_by,
            parent_id: params.parent_id,
            image_url: lodash_1.default.isEmpty(params.image_url) ? null : params.image_url,
            password: await passwordHash.generate(password),
            username: username,
            slug: username,
            platform_type: 'google',
            platform_id: 'HFJHSJ4458KFJDH1101',
            is_email_verify: true,
            email_verify_at: (0, Index_1.currentDateTime)(),
            status: '0',
            created_at: (0, Index_1.currentDateTime)()
        });
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
    static async getUsersByIDArray(user_id) {
        let query = await this.query()
            .whereIn('id', user_id)
            .where('users.status', '1');
        return query;
    }
    static async getUserHierarchy(id) {
        try {
            const result = await Database_1.default.rawQuery(`
            WITH RECURSIVE user_tree AS (
              SELECT id, name, parent_id
              FROM users
              WHERE id = ?
              UNION ALL
              SELECT u.id, u.name, u.parent_id
              FROM users u
              INNER JOIN user_tree ut ON u.parent_id = ut.id
            )
            SELECT * FROM user_tree;
          `, [id]);
            let record = JSON.parse(JSON.stringify(result[0]));
            let ids = [];
            for (let i = 0; i < record.length; i++) {
                ids.push(record[i].id);
            }
            return ids;
        }
        catch (error) {
            console.error('Error fetching user hierarchy:', error);
            throw error;
        }
    }
    static async dashBoard(user_id, user_group_id) {
        let dashboard = {};
        if (user_group_id == 2) {
            let total_user = await this.query().whereNotIn('user_group_id', [1, 2]).whereNull('deleted_at').getCount();
            let total_contractor = await this.query().where('user_group_id', 3).whereNull('deleted_at').getCount();
            let total_customer = await this.query().where('user_group_id', 5).whereNull('deleted_at').getCount();
            let total_manager = await this.query().where('user_group_id', 4).whereNull('deleted_at').getCount();
            let total_crew = await this.query().where('user_group_id', 6).whereNull('deleted_at').getCount();
            let total_job = await Job_1.default.query().whereNull('deleted_at').getCount();
            let total_order = await Order_1.default.query().whereNull('deleted_at').getCount();
            let total_category = await ProductCategory_1.default.query().whereNull('deleted_at').getCount();
            let total_services = await Services_1.default.query().whereNull('deleted_at').getCount();
            dashboard.total_user = Number(total_user);
            dashboard.contractor = Number(total_contractor);
            dashboard.customer = Number(total_customer);
            dashboard.manager = Number(total_manager);
            dashboard.crew = Number(total_crew);
            dashboard.job = Number(total_job);
            dashboard.order = Number(total_order);
            dashboard.category = Number(total_category);
            dashboard.services = Number(total_services);
        }
        else if (user_group_id == 3) {
            let get_user = await this.getUserHierarchy(user_id);
            var remove_current_id = lodash_1.default.without(get_user, user_id);
            let total_order = await Order_1.default.query().where('created_by_id', user_id).whereNull('deleted_at').getCount();
            let total_customer = await this.query().where('user_group_id', 5).where('parent_id', user_id).whereNull('deleted_at');
            let totalCrew = await Database_1.default.from('jobs')
                .leftJoin('jobs_assigners', 'jobs_assigners.job_id', 'jobs.id')
                .where('jobs.created_by_id', user_id)
                .count('jobs_assigners.job_id as total_crew');
            let total_manager = [];
            for (let j = 0; j < total_customer.length; j++) {
                let get_manager = await this.query().where('user_group_id', 4).where('parent_id', total_customer[j].id).whereNull('deleted_at').getCount();
                if (get_manager > 0) {
                    total_manager.push(get_manager);
                }
            }
            let total_job = Job_1.default.query().whereNull('deleted_at');
            total_job.where(function (query) {
                query.whereIn('created_by_id', get_user)
                    .orWhereIn('parent_id', get_user);
            });
            let job = await total_job.count('* as count');
            let number_of_job = lodash_1.default.isEmpty(job) ? '0' : job[0].$extras.count;
            dashboard.total_user = Number(remove_current_id.length);
            dashboard.customer = Number(total_customer.length);
            dashboard.manager = Number(total_manager.length);
            dashboard.crew = Number(totalCrew[0].total_crew);
            dashboard.job = Number(number_of_job);
            dashboard.order = Number(total_order);
        }
        else if (user_group_id == 5) {
            let get_user = await this.getUserHierarchy(user_id);
            var remove_current_id = lodash_1.default.without(get_user, user_id);
            let total_order = await Order_1.default.query().where('created_by_id', user_id).whereNull('deleted_at').getCount();
            let manager = await this.query().where('user_group_id', 4).where('parent_id', user_id).whereNull('deleted_at');
            let totalCrew = await Database_1.default.from('jobs')
                .leftJoin('jobs_assigners', 'jobs_assigners.job_id', 'jobs.id')
                .where('jobs.target_id', user_id)
                .count('jobs_assigners.job_id as total_crew');
            let total_job = Job_1.default.query().whereNull('deleted_at');
            total_job.where(function (query) {
                query.whereIn('created_by_id', get_user)
                    .orWhereIn('parent_id', get_user);
            });
            let job = await total_job.count('* as count');
            let number_of_job = lodash_1.default.isEmpty(job) ? '0' : job[0].$extras.count;
            dashboard.total_user = Number(remove_current_id.length);
            dashboard.manager = Number(manager.length);
            dashboard.crew = Number(totalCrew[0].total_crew);
            dashboard.job = Number(number_of_job);
            dashboard.order = Number(total_order);
        }
        else if (user_group_id == 4) {
            let get_user = await this.getUserHierarchy(user_id);
            var remove_current_id = lodash_1.default.without(get_user, user_id);
            let total_order = await Order_1.default.query().where('created_by_id', user_id).whereNull('deleted_at').getCount();
            let total_job = Job_1.default.query().whereNull('deleted_at');
            total_job.where(function (query) {
                query.whereIn('created_by_id', get_user)
                    .orWhereIn('parent_id', get_user);
            });
            let job = await total_job.count('* as count');
            let number_of_job = lodash_1.default.isEmpty(job) ? '0' : job[0].$extras.count;
            dashboard.job = Number(number_of_job);
            dashboard.order = Number(total_order);
        }
        else if (user_group_id == 6) {
            var now = new Date();
            var dateString = (0, moment_1.default)(now).format('YYYY-MM-DD');
            let startOfDay = (0, moment_1.default)(dateString).startOf('day').toDate();
            let endOfDay = (0, moment_1.default)(dateString).endOf('day').toDate();
            let today_job = await JobAssignee_1.default.query()
                .where('crew_id', user_id)
                .whereBetween('created_at', [startOfDay, endOfDay])
                .whereNull('deleted_at')
                .getCount();
            let total_job = await JobAssignee_1.default.query().where('crew_id', user_id).whereNull('deleted_at').getCount();
            dashboard.today_job = Number(today_job);
            dashboard.total_job = Number(total_job);
        }
        return dashboard;
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
], User.prototype, "parent_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "created_by", void 0);
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
    __metadata("design:type", String)
], User.prototype, "mobile_number", void 0);
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
    __metadata("design:type", Object)
], User.prototype, "company_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "company_address", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "company_mobile_number", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "company_email_address", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "building_type_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "user_link", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "is_link", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "profile_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "user_status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "total_no_user", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], User.prototype, "total_no_request", void 0);
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
    (0, Orm_1.hasOne)(() => BuildingType_1.default, {
        foreignKey: 'id',
        localKey: 'building_type_id'
    }),
    __metadata("design:type", Object)
], User.prototype, "BuildingType", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => UserSelectedServices_1.default, {
        foreignKey: 'user_id',
        localKey: 'id'
    }),
    __metadata("design:type", Object)
], User.prototype, "SelectedServices", void 0);
exports.default = User;
module.exports = User;
//# sourceMappingURL=User.js.map