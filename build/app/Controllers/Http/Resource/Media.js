'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
class Media {
    static async initResponse(data, request) {
        if (lodash_1.default.isEmpty(data))
            return [];
        let response;
        if (Array.isArray(data)) {
            response = [];
            for (var i = 0; i < data.length; i++) {
                response.push(await this.jsonSchema(data[i], request));
            }
        }
        else {
            response = await this.jsonSchema(data, request);
        }
        return response;
    }
    static async jsonSchema(record, request) {
        let media_url;
        if (record.file_type == 'audio') {
            media_url = (0, Index_1.baseUrl)() + '/media_read/' + record.id + '.mp3';
        }
        else if (record.file_type == 'video') {
            media_url = (0, Index_1.baseUrl)() + '/media_read/' + record.id + '.mp4';
        }
        else {
            media_url = await (0, Index_1.storageUrl)(record.file_url);
        }
        return {
            id: record.id,
            filename: record.filename,
            file_url: await (0, Index_1.storageUrl)(record.file_url),
            thumbnail_url: await (0, Index_1.storageUrl)(record.thumbnail_url),
            file_type: record.file_type,
        };
    }
}
module.exports = Media;
//# sourceMappingURL=Media.js.map