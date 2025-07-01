'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const fetch = require('node-fetch');
class OneSignal {
    sendPush(device_tokens, device_type, title, message, badge = 0, redirect_link = '', custom_data = {}) {
        let language = 'en';
        let params = {
            app_id: Env_1.default.get('NOTIFICATION_APP_ID'),
            include_player_ids: device_tokens,
            channel_for_external_user_ids: 'push',
            data: {
                title: title,
                message: message,
                badge: badge,
                custom_data: custom_data
            },
            headings: { [language]: title },
            contents: { [language]: message },
            isIos: device_type == 'ios' ? true : false,
            ios_badgeType: 'Increase',
            ios_badgeCount: badge,
        };
        if (device_type == 'web')
            params.url = redirect_link;
        let headers = {
            'Content-Type': 'application/json',
            'charset': 'utf-8',
            'Authorization': 'Basic ' + Env_1.default.get('NOTIFICATION_KEY')
        };
        fetch(Env_1.default.get('NOTIFICATION_URL'), {
            method: 'post',
            body: JSON.stringify(params),
            headers: headers
        }).then((res) => {
            res.json().then((resbody) => {
            });
        });
        return true;
    }
}
exports.default = OneSignal;
module.exports = OneSignal;
//# sourceMappingURL=OneSignal.js.map