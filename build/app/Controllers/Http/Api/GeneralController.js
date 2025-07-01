"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("../Controller"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
class GeneralController extends Controller_1.default {
    constructor() {
        super();
        this.__request;
        this.__response;
        this.__params = {};
    }
    async generateVideoThumb(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let file = this.__request.file('file');
        let fileValidate = (0, Index_1.fileValidation)(file, 6000000, ['mp4']);
        if (fileValidate.error) {
            return this.sendError('Validation Message', { message: fileValidate.message }, 400);
        }
        var thumbnail = await (0, Index_1.generateVideoThumb)(file.tmpPath, 'videos');
        thumbnail = await Drive_1.default.getUrl(thumbnail);
        this.__is_paginate = false;
        this.__collection = false;
        await this.__sendResponse(200, 'Thumbnail Generate in successfully', { fileurl: thumbnail });
        return;
    }
}
exports.default = GeneralController;
//# sourceMappingURL=GeneralController.js.map