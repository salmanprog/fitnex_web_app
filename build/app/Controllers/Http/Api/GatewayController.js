'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("../Controller"));
const Index_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Libraries/PaymentGateway/Index"));
class GatewayController extends Controller_1.default {
    constructor() {
        super();
        this.__request;
        this.__response;
        this.__params = {};
    }
    async customer(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let params = this.__request.all();
        let customer = await Index_1.default.init().createCustomer({ email: params.email });
        if (customer.code != 200) {
            return this.sendError('Gateway Error', { message: customer.message }, 400);
        }
        this.__is_paginate = false;
        this.__collection = false;
        await this.__sendResponse(200, 'customer has been created successfully', { gateway_customer_id: customer.data.id });
        return;
    }
    async customerCard(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let params = this.__request.all();
        let card = await Index_1.default.init().createCustomerCard(params.gateway_customer_id, params.card_token);
        if (card.code != 200) {
            return this.sendError('Gateway Error', { message: card.message }, 400);
        }
        this.__is_paginate = false;
        this.__collection = false;
        await this.__sendResponse(200, 'Customer card has been created successfully', { card: card });
        return;
    }
    async makeDefaultCard(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let params = this.__request.all();
        let card = await Index_1.default.init().makeDefaultCard(params.gateway_customer_id, params.card_id);
        if (card.code != 200) {
            return this.sendError('Gateway Error', { message: card.message }, 400);
        }
        this.__is_paginate = false;
        this.__collection = false;
        await this.__sendResponse(200, 'Customer card has been updated successfully', { card: card });
        return;
    }
    async deleteGatewayCard(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let params = this.__request.all();
        let card = await Index_1.default.init().deleteCustomerCard(params.gateway_customer_id, params.card_id);
        if (card.code != 200) {
            return this.sendError('Gateway Error', { message: card.message }, 400);
        }
        this.__is_paginate = false;
        this.__collection = false;
        await this.__sendResponse(200, 'Customer card has been deleted successfully', { card: card });
        return;
    }
    async gatewayCharge(ctx) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        let params = this.__request.all();
        let charge = await Index_1.default.init().customerCharge(params.gateway_customer_id, params.amount);
        if (charge.code != 200) {
            return this.sendError('Gateway Error', { message: charge.message }, 400);
        }
        this.__is_paginate = false;
        this.__collection = false;
        await this.__sendResponse(200, 'Payment has been charged successfully', { charge: charge });
        return;
    }
}
exports.default = GatewayController;
//# sourceMappingURL=GatewayController.js.map