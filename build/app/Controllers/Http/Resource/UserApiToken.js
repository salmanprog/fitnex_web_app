"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
class UserApiToken {
    static async initResponse(data, request) {
        if (lodash_1.default.isEmpty(data))
            return [];
        let response;
        if (Array.isArray(data)) {
            response = [];
            for (var i = 0; i < data.length; i++) {
                response.push(this.jsonSchema(data[i], request));
            }
        }
        else {
            response = this.jsonSchema(data, request);
        }
        return response;
    }
    static jsonSchema(record, request) {
        return {
            api_token: Buffer.from(record.api_token, "utf8").toString("base64"),
            device_type: record.device_type,
            device_token: record.device_token,
            platform_type: record.platform_type,
            platform_id: record.platform_id,
        };
    }
}
module.exports = UserApiToken;
//# sourceMappingURL=UserApiToken.js.map