"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const lodash_1 = __importDefault(require("lodash"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ApiAuthentication {
    async handle({ request, response }, next) {
        let headers = request.headers();
        let authorization = headers.authorization;
        let jwt_data;
        if (lodash_1.default.isEmpty(authorization)) {
            let res = {
                code: 401,
                message: 'Authorization header is required',
                data: {}
            };
            response.status(401).send(res);
            return;
        }
        authorization = authorization.replace('Bearer ', '');
        try {
            var key = crypto_js_1.default.enc.Utf8.parse(Env_1.default.get('AES_SECRET'));
            var iv = crypto_js_1.default.enc.Utf8.parse(Env_1.default.get('AES_IV'));
            var bytes = crypto_js_1.default.AES.decrypt(authorization, key, { iv: iv });
            var base64Token = bytes.toString(crypto_js_1.default.enc.Utf8);
        }
        catch (err) {
            let res = {
                code: 401,
                message: 'Authorization header is not valid',
                data: {}
            };
            response.status(401).send(res);
            return;
        }
        authorization = Buffer.from(base64Token, 'base64').toString('ascii');
        let user = await User_1.default.getUserByApiToken(authorization);
        if (lodash_1.default.isEmpty(user)) {
            let res = {
                code: 401,
                message: 'Authorization header is not valid',
                data: {}
            };
            response.status(401).send(res);
            return;
        }
        try {
            jwt_data = await jsonwebtoken_1.default.verify(authorization, Env_1.default.get('JWT_SECRET'));
        }
        catch (err) {
            let res = {
                code: 401,
                message: err,
                data: {}
            };
            response.status(401).send(res);
            return;
        }
        if (user.status == 0) {
            let res = {
                code: 401,
                message: 'Your account is disabled. Please contact to administrator',
                data: {}
            };
            response.status(401).send(res);
            return;
        }
        if (Env_1.default.get('MAIL_SANDBOX') == 0) {
            if (user.is_email_verify == 0) {
                let res = {
                    code: 401,
                    message: 'Your email is not verified. Please check your email and verify your account',
                    data: {}
                };
                response.status(401).send(res);
                return;
            }
        }
        const Request = Application_1.default.container.use('Adonis/Core/Request');
        Request.macro('user', function () {
            return user;
        });
        Request.macro('apiToken', function () {
            return authorization;
        });
        await next();
    }
}
exports.default = ApiAuthentication;
//# sourceMappingURL=ApiAuthentication.js.map