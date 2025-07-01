'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
class Index {
    static init() {
        let driver = Env_1.default.get('PAYMENT_GATEWAY');
        let instance = global[Symbol.for('ioc.use')](`App/Libraries/PaymentGateway/${driver}.ts`);
        return new instance;
    }
}
exports.default = Index;
//# sourceMappingURL=Index.js.map