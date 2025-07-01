'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const accountSid = Env_1.default.get('TWILIO_SID');
const authToken = Env_1.default.get('TWILIO_AUTH_TOKEN');
const client = require('twilio')(accountSid, authToken);
class Twillio {
    static async sendOtp(mobile_no) {
        mobile_no = mobile_no.replace('-', '');
        if (!mobile_no.includes('+')) {
            mobile_no = '+' + mobile_no;
        }
        try {
            let data = await client.verify.v2.services(Env_1.default.get('TWILIO_SERVICE_ID'))
                .verifications
                .create({ to: mobile_no, channel: 'sms' });
            return {
                code: 200,
                message: 'OTP has been sent successfully',
                data: data
            };
        }
        catch (error) {
            return {
                code: 400,
                message: error.message,
                data: error
            };
        }
    }
    static async verifyOtp(mobile_no, code) {
        mobile_no = mobile_no.replace('-', '');
        if (!mobile_no.includes('+')) {
            mobile_no = '+' + mobile_no;
        }
        try {
            let data = await client.verify.v2.services(Env_1.default.get('TWILIO_SERVICE_ID'))
                .verificationChecks
                .create({ to: mobile_no, code: code });
            return {
                code: 200,
                message: 'OTP has been verified successfully',
                data: data
            };
        }
        catch (error) {
            return {
                code: 400,
                message: error.message,
                data: {}
            };
        }
    }
}
exports.default = Twillio;
//# sourceMappingURL=Twillio.js.map