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
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const crypto_1 = __importDefault(require("crypto"));
const PushNotification_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Libraries/PushNotification"));
const lodash_1 = __importDefault(require("lodash"));
class Notification extends Orm_1.BaseModel {
    static async sendNotification(identifier, notification_data, custom_data = {}) {
        let ios_device_token = [];
        let android_device_token = [];
        let target_user_id = [];
        let target_users = notification_data.target;
        for (var i = 0; i < target_users.length; i++) {
            target_user_id.push(target_users[i].id);
            if (!lodash_1.default.isEmpty(target_users[i].device_token)) {
                if (target_users[i].device_type == 'ios') {
                    ios_device_token.push(target_users[i].device_token);
                }
                else {
                    android_device_token.push(target_users[i].device_token);
                }
            }
        }
        ios_device_token = lodash_1.default.uniq(ios_device_token);
        android_device_token = lodash_1.default.uniq(android_device_token);
        target_user_id = lodash_1.default.uniq(target_user_id);
        let unique_id = crypto_1.default.randomBytes(16).toString("hex");
        custom_data.unique_id = unique_id;
        if (android_device_token.length > 0) {
            PushNotification_1.default.notification(android_device_token, 'android', notification_data.title, notification_data.message, notification_data.badge, notification_data.redirect_link, custom_data);
        }
        if (ios_device_token.length > 0) {
            PushNotification_1.default.notification(ios_device_token, 'ios', notification_data.title, notification_data.message, notification_data.badge, notification_data.redirect_link, custom_data);
        }
        let notification_param = [];
        for (var u = 0; u < target_user_id.length; u++) {
            notification_param.push({
                unique_id: unique_id,
                identifier: identifier,
                actor_id: notification_data.actor.id,
                target_id: target_user_id[u],
                module: notification_data.module,
                module_id: notification_data.module_id,
                module_slug: notification_data.module_slug,
                reference_module: lodash_1.default.isEmpty(notification_data.reference_module) ? null : notification_data.reference_module,
                reference_id: lodash_1.default.isEmpty(notification_data.reference_id) ? null : notification_data.reference_id,
                reference_slug: lodash_1.default.isEmpty(notification_data.reference_slug) ? null : notification_data.reference_slug,
                title: notification_data.title,
                description: notification_data.message,
                web_redirect_link: lodash_1.default.isEmpty(notification_data.redirect_link) ? null : notification_data.redirect_link,
                created_at: (0, Index_1.currentDateTime)()
            });
        }
        await this.createMany(notification_param);
        return true;
    }
}
Notification.table = 'notifications';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Notification.prototype, "unique_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Notification.prototype, "identifier", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Notification.prototype, "actor_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Notification.prototype, "target_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Notification.prototype, "module", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Notification.prototype, "module_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Notification.prototype, "module_slug", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Notification.prototype, "reference_module", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Notification.prototype, "reference_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Notification.prototype, "reference_slug", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Notification.prototype, "description", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Notification.prototype, "web_redirect_link", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Notification.prototype, "is_read", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Notification.prototype, "is_view", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Notification.prototype, "created_at", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Notification.prototype, "updated_at", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Notification.prototype, "deleted_at", void 0);
exports.default = Notification;
//# sourceMappingURL=Notification.js.map