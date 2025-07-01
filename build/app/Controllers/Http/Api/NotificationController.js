"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Controller_1 = __importDefault(require("../Controller"));
const lodash_1 = __importDefault(require("lodash"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Notification_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Notification"));
class GeneralController extends Controller_1.default {
    constructor() {
        super();
        this.__request;
        this.__response;
        this.__params = {};
    }
    async sendTestNotification(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let validationRules = Validator_1.schema.create({
            target_user_id: Validator_1.schema.string({}),
        });
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let actor = this.__request.user();
        let targetUsers = await User_1.default.getTargetUsersByID(this.__request.input('target_user_id'));
        if (!lodash_1.default.isEmpty(targetUsers)) {
            let notification_data = {
                actor: actor,
                target: targetUsers,
                module: 'users',
                module_id: actor.id,
                module_slug: actor.slug,
                reference_id: null,
                reference_module: null,
                reference_slug: null,
                title: 'AdonisJS',
                message: 'Testing push notification',
                redirect_link: null,
                badge: 0,
            };
            let custom_data = {
                record_id: actor.id,
                redirect_link: null,
                identifier: 'test-notification'
            };
            Notification_1.default.sendNotification('test-notification', notification_data, custom_data).then();
        }
        this.__is_paginate = false;
        this.__collection = false;
        await this.__sendResponse(200, 'Test notification has been sent successfully', []);
        return;
    }
}
exports.default = GeneralController;
//# sourceMappingURL=NotificationController.js.map