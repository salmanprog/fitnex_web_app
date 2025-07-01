"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("./Controller"));
class ContentController extends Controller_1.default {
    async index({ request, params, view, session, response }) {
        return view.render('content');
    }
}
exports.default = ContentController;
//# sourceMappingURL=ContentController.js.map