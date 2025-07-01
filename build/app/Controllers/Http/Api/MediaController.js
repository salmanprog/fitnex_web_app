"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const RestController_1 = __importDefault(require("./RestController"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Media_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Media"));
const fs_1 = __importDefault(require("fs"));
const Request = Application_1.default.container.use('Adonis/Core/Request');
class MediaController extends RestController_1.default {
    constructor() {
        super("Media");
        this.__resource = "Media";
        this.__request;
        this.__response;
        this.__params = {};
    }
    async validation(action, slug) {
        switch (action) {
            case "store":
                await this.storeValidation();
                break;
            case "update":
                await this.updateValidation();
                break;
        }
    }
    async storeValidation() {
        let validator;
        let validationRules;
        validationRules = Validator_1.schema.create({});
        try {
            validator = await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            this.__is_error = true;
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        return validator;
    }
    async updateValidation() {
        let validator;
        let validationRules;
        validationRules = Validator_1.schema.create({});
        try {
            validator = await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            this.__is_error = true;
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        return validator;
    }
    async beforeIndexLoadModel() {
    }
    async afterIndexLoadModel(records) {
    }
    async beforeStoreLoadModel() {
    }
    async afterStoreLoadModel() {
    }
    async beforeShowLoadModel() {
    }
    async afterShowLoadModel(record) {
    }
    async beforeUpdateLoadModel() {
    }
    async afterUpdateLoadModel() {
    }
    async beforeDestoryLoadModel() {
    }
    async afterDestoryLoadModel() {
    }
    async readMedia(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        this.__params = ctx.params;
        let validationRules = Validator_1.schema.create({});
        try {
            await this.__request.validate({ schema: validationRules });
        }
        catch (error) {
            return this.sendError('Validation Message', this.setValidatorMessagesResponse(error.messages), 400);
        }
        let media_id = this.__params.name;
        media_id = media_id.split('.')[0];
        let getMedia = await Media_1.default.getById(media_id);
        let fileContent = fs_1.default.readFileSync(Application_1.default.publicPath('uploads/' + getMedia.file_url));
        if (getMedia.file_type == 'audio') {
            ctx.response.header('Content-type', 'audio/mp3');
        }
        else if (getMedia.file_type == 'video') {
            ctx.response.header('Content-type', 'video/mp4');
        }
        ctx.response.send(fileContent);
        return;
    }
}
exports.default = MediaController;
//# sourceMappingURL=MediaController.js.map