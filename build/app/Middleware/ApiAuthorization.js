"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const lodash_1 = __importDefault(require("lodash"));
class ApiAuthorization {
    async handle({ request, response }, next) {
        let token = request.header('token');
        let client_id = Env_1.default.get('CLIENT_ID');
        if (lodash_1.default.isEmpty(token)) {
            let data = {
                code: 401,
                message: 'You are not authorize to process this request',
                data: {}
            };
            response.status(401).send(data);
            return;
        }
        try {
            var key = crypto_js_1.default.enc.Utf8.parse(Env_1.default.get('AES_SECRET'));
            var iv = crypto_js_1.default.enc.Utf8.parse(Env_1.default.get('AES_IV'));
            var bytes = crypto_js_1.default.AES.decrypt(token, key, { iv: iv });
            var decrypt_token = bytes.toString(crypto_js_1.default.enc.Utf8);
        }
        catch (err) {
            let res = {
                code: 401,
                message: 'Invalid Authorization token',
                data: {}
            };
            response.status(401).send(res);
            return;
        }
        if (decrypt_token != client_id) {
            let res = {
                code: 401,
                message: 'Invalid Authorization token',
                data: {}
            };
            response.status(401).send(res);
            return;
        }
        await next();
    }
}
exports.default = ApiAuthorization;
//# sourceMappingURL=ApiAuthorization.js.map