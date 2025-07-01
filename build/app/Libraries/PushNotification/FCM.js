'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const fetch = require('node-fetch');
class FCM {
    sendPush(device_tokens, device_type, title, message, badge = 0, redirect_link = '', custom_data = {}) {
        if (device_type == 'ios') {
            return this.sendIosPushNotification(device_tokens, device_type, title, message, badge, redirect_link, custom_data);
        }
        else {
            return this.sendAndroidPushNotification(device_tokens, device_type, title, message, badge, redirect_link, custom_data);
        }
    }
    sendIosPushNotification(device_tokens, device_type, title, message, badge = 0, redirect_link = '', custom_data = {}) {
        let notification_data = {
            registration_ids: device_tokens,
            notification: {
                title: title,
                text: message,
                body: message,
                sound: 'default',
                badge: badge,
                custom_data: custom_data,
                user_badge: badge,
            }
        };
        this.sendCurl(notification_data);
        return true;
    }
    sendAndroidPushNotification(device_tokens, device_type, title, message, badge = 0, redirect_link = '', custom_data = {}) {
        let notification_data = {
            registration_ids: device_tokens,
            notification: {
                title: title,
                body: message,
                sound: 'default',
                badge: badge,
                priority: 'high'
            },
            data: {
                message: {
                    title: title,
                    body: message,
                    sound: 'default'
                },
                user_badge: badge,
                custom_data: custom_data,
                priority: 'high'
            }
        };
        this.sendCurl(notification_data);
        return true;
    }
    sendCurl(notification_data) {
        let headers = {
            'Authorization': 'Bearer ' + Env_1.default.get('NOTIFICATION_KEY'),
            'Content-Type': 'application/json',
            'charset': 'utf-8'
        };
        fetch(Env_1.default.get('NOTIFICATION_URL'), {
            method: 'post',
            body: JSON.stringify(notification_data),
            headers: headers
        })
            .then((res) => {
            res.json().then((resbody) => {
            });
        });
        return true;
    }
}
exports.default = FCM;
module.exports = FCM;
//# sourceMappingURL=FCM.js.map