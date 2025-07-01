'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
class FileUpload {
    static async doUpload(fileObject, destination_upload_path, resize = false) {
        let filename = destination_upload_path + '/' + `${new Date().getTime()}.${fileObject.extname}`;
        let fileContent = fs_1.default.readFileSync(fileObject.tmpPath);
        await Drive_1.default.put(filename, fileContent);
        if (resize) {
        }
        return filename;
    }
    static generateVideoThumb(file_path, destination_path) {
        return new Promise((resolve, reject) => {
            try {
                let dir = Application_1.default.publicPath('uploads/video-thumbnail');
                if (!fs_1.default.existsSync(dir)) {
                    fs_1.default.mkdirSync(dir);
                }
                fluent_ffmpeg_1.default.setFfmpegPath(Env_1.default.get('FFMPEG_BINARIES'));
                fluent_ffmpeg_1.default.setFfprobePath(Env_1.default.get('FFPROBE_BINARIES'));
                let thumbnail_name = 'thumbnail-' + (0, Index_1.randomString)(10) + '.jpg';
                (0, fluent_ffmpeg_1.default)(file_path)
                    .on('end', async function () {
                    let thumbnail_path = dir + '/' + thumbnail_name;
                    let contents = fs_1.default.readFileSync(thumbnail_path);
                    await Drive_1.default.put(`${destination_path}/${thumbnail_name}`, contents);
                    fs_1.default.unlinkSync(`${dir}/${thumbnail_name}`);
                    resolve(`${destination_path}/${thumbnail_name}`);
                })
                    .screenshots({
                    count: 1,
                    filename: thumbnail_name,
                    folder: Application_1.default.publicPath('uploads/video-thumbnail')
                });
            }
            catch (error) {
                reject(error.message);
            }
        });
    }
}
exports.default = FileUpload;
//# sourceMappingURL=FileUpload.js.map