'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const FileUpload_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Libraries/FileUpload/FileUpload"));
class MediaHook {
    static async indexQueryHook(query, request, slug = '') {
    }
    static async beforeCreateHook(request, params) {
        if (!lodash_1.default.isEmpty(request.file('file_url'))) {
            if (params.file_type == 'image') {
                params.file_url = await FileUpload_1.default.doUpload(request.file('file_url'), 'media/image');
            }
            else if (params.file_type == 'video') {
                params.file_url = await FileUpload_1.default.doUpload(request.file('file_url'), 'media/video');
            }
            else if (params.file_type == 'audio') {
                params.file_url = await FileUpload_1.default.doUpload(request.file('file_url'), 'media/audio');
            }
            else if (params.file_type == 'pdf') {
                params.file_url = await FileUpload_1.default.doUpload(request.file('file_url'), 'media/pdf');
            }
            else if (params.file_type == 'ancillary_profile') {
                params.file_url = await FileUpload_1.default.doUpload(request.file('file_url'), 'media/ancillary_profile');
            }
            if (!lodash_1.default.isEmpty(request.file('thumbnail_url'))) {
                params.thumbnail_url = await FileUpload_1.default.doUpload(request.file('thumbnail_url'), 'media/thumbnails');
            }
            else {
                params.thumbnail_url = params.file_url;
            }
            params.slug = Math.floor((Math.random() * 100) + 1) + new Date().getTime();
            params.user_id = request.user().id;
            params.module = '';
            params.module_id = 0;
            params.filename = 'dumy_' + Math.floor((Math.random() * 100) + 1) + new Date().getTime();
            params.original_name = 'dumy_' + Math.floor((Math.random() * 100) + 1) + new Date().getTime();
            params.file_url = params.file_url;
            params.file_url_blur = '0000';
            params.thumbnail_url = params.thumbnail_url;
            params.mime_type = params.file_type;
            params.file_type = params.file_type;
            params.driver = '';
            params.media_type = 'public';
            params.meta = '';
        }
    }
    static async afterCreateHook(record, request, params) {
    }
    static async beforeEditHook(request, params, slug) {
    }
    static async afterEditHook(request, slug) {
    }
    static async beforeDeleteHook(request, params, slug) {
    }
    static async afterDeleteHook(request, params, slug) {
    }
}
module.exports = MediaHook;
//# sourceMappingURL=MediaHook.js.map