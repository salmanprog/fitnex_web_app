"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideoThumb = exports.fileValidation = exports.sendMail = exports.currentTime = exports.currentUnixDateTime = exports.currentDateTime = exports.rand = exports.randomString = exports.storageUrl = exports.baseUrl = exports.kebabCase = exports.strSlug = void 0;
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const luxon_1 = require("luxon");
const lodash_1 = __importDefault(require("lodash"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const fs_1 = __importDefault(require("fs"));
const ffmpeg = require('fluent-ffmpeg');
const strSlug = (string) => {
    return string
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[-]+/g, "-")
        .replace(/[^\w-]+/g, "");
};
exports.strSlug = strSlug;
const kebabCase = (string) => {
    return string.split('').map((letter, idx) => {
        return letter.toUpperCase() === letter
            ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
            : letter;
    }).join('');
};
exports.kebabCase = kebabCase;
const baseUrl = (path = '') => {
    return Env_1.default.get('APP_URL') + path;
};
exports.baseUrl = baseUrl;
const storageUrl = async (path) => {
    return Env_1.default.get('DRIVE_DISK') == 's3' ? await Drive_1.default.getUrl(path) : (0, exports.baseUrl)('/uploads/' + path);
};
exports.storageUrl = storageUrl;
const randomString = (length = 10) => {
    return Helpers_1.string.generateRandom(length);
};
exports.randomString = randomString;
const rand = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.rand = rand;
const currentDateTime = () => {
    return luxon_1.DateTime.now().toUTC().toFormat("yyyy-MM-dd\'T\'TT");
};
exports.currentDateTime = currentDateTime;
const currentUnixDateTime = () => {
    return luxon_1.DateTime.now().toUTC().toUnixInteger();
};
exports.currentUnixDateTime = currentUnixDateTime;
const currentTime = () => {
    return luxon_1.DateTime.now().toUTC().toFormat("TT");
};
exports.currentTime = currentTime;
const sendMail = async (email_view_path, to, subject, params) => {
    Mail_1.default.send((message) => {
        message
            .from(Env_1.default.get('SMTP_FROM_EMAIL'), Env_1.default.get('SMTP_FROM_NAME'))
            .to(to)
            .subject(subject)
            .htmlView(email_view_path, params);
    }).then();
};
exports.sendMail = sendMail;
const fileValidation = (file, sizeInKB = 2000000, extensions = ['png', 'jpg', 'jpeg']) => {
    let data = {
        error: false,
        message: ''
    };
    if (file.size > sizeInKB) {
        data.error = true;
        data.message = 'Error: max upload file size is 2MB';
    }
    if (!extensions.includes(file.extname)) {
        data.error = true;
        data.message = 'File extension is not valid';
    }
    if (!lodash_1.default.isEmpty(file.error)) {
        data.error = true;
        data.message = file.error;
    }
    return data;
};
exports.fileValidation = fileValidation;
const generateVideoThumb = (file_path, destination_path) => {
    return new Promise((resolve, reject) => {
        try {
            let dir = Application_1.default.tmpPath('uploads/video-thumbnail');
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir);
            }
            ffmpeg.setFfmpegPath(Env_1.default.get('FFMPEG_BINARIES'));
            ffmpeg.setFfprobePath(Env_1.default.get('FFPROBE_BINARIES'));
            let thumbnail_name = 'thumbnail-' + Helpers_1.string.generateRandom(10) + '.jpg';
            ffmpeg(file_path)
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
                folder: Application_1.default.tmpPath('uploads/video-thumbnail')
            });
        }
        catch (error) {
            reject(error.message);
        }
    });
};
exports.generateVideoThumb = generateVideoThumb;
//# sourceMappingURL=Index.js.map