"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_CACHE_EXPIRE_TIME = exports.REDIS_CACHE_ENABLE = exports.APP_SETTING_IMAGE_PATH = exports.USER_IMAGE_PATH = exports.PAGINATION_LIMIT = exports.APP_NAME = exports.AES_SECRET = exports.CLIENT_ID = exports.JWT_EXPIRY = exports.JWT_SECRET = exports.ADMIN_LOGIN_TOKEN = void 0;
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
exports.ADMIN_LOGIN_TOKEN = Env_1.default.get('ADMIN_LOGIN_TOKEN', 'zekkmdvhkm');
exports.JWT_SECRET = Env_1.default.get('JWT_SECRET', '8c1281f7fcd2kXp2s5v8y/B?E(H+MbQeThWmZq3t6w9z');
exports.JWT_EXPIRY = Env_1.default.get('JWT_EXPIRY', '7d');
exports.CLIENT_ID = Env_1.default.get('CLIENT_ID', '59200748-36fc-2744-355-8c1281f7fcd2');
exports.AES_SECRET = Env_1.default.get('AES_SECRET', 'kXp2s5v8y/B?E(H+MbQeThWmZq3t6w9z');
exports.APP_NAME = Env_1.default.get('APP_NAME', 'Adonis TypeScript');
exports.PAGINATION_LIMIT = 20;
exports.USER_IMAGE_PATH = 'uploads/users/';
exports.APP_SETTING_IMAGE_PATH = 'uploads/app_setting/';
exports.REDIS_CACHE_ENABLE = Env_1.default.get('REDIS_CACHE_ENABLE', false);
exports.REDIS_CACHE_EXPIRE_TIME = Env_1.default.get('REDIS_CACHE_EXPIRE_TIME', 3600);
//# sourceMappingURL=constants.js.map