'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
class Index {
    static notification(device_tokens, device_type, title, message, badge = 0, redirect_link = '', custom_data = {}) {
        let driver = Env_1.default.get('NOTIFICATION_DRIVER');
        let instance = global[Symbol.for('ioc.use')](`App/Libraries/PushNotification/${driver}.ts`);
        instance = new instance;
        return instance.sendPush(device_tokens, device_type, title, message, badge, redirect_link, custom_data);
    }
}
exports.default = Index;
//# sourceMappingURL=index.js.map