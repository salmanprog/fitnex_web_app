"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const fetch = require('node-fetch');
var FormData = require('form-data');
const CustomerId = Env_1.default.get('TELESIGN_CUSTOMER_ID');
const ApiKey = Env_1.default.get('TELESIGN_API_KEY');
const TelesignAuth = Buffer.from(`${CustomerId}:${ApiKey}`).toString('base64');
class Telesign {
    static async sendOtp(mobile_no, code) {
        mobile_no = mobile_no.replace('-', '');
        mobile_no = mobile_no.replace('+', '');
        var form = new FormData();
        form.append('phone_number', mobile_no);
        form.append('message', `Your verification code is ${code}`);
        form.append('message_type', 'ARN');
        try {
            let response = await fetch('https://rest-api.telesign.com/v1/messaging', {
                method: 'post',
                body: form,
                headers: { 'Authorization': 'Basic ' + TelesignAuth }
            });
            let data = await response.json();
            return {
                code: data.status.code == 290 ? 200 : data.status.code,
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
}
exports.default = Telesign;
//# sourceMappingURL=Telesign.js.map