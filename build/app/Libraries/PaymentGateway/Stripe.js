'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const stripe = require('stripe')(Env_1.default.get('STRIPE_SECRET_KEY'));
class Stripe {
    async createCustomer(data) {
        let customer;
        try {
            customer = await stripe.customers.create(data);
        }
        catch (error) {
            return {
                code: 400,
                message: error.message
            };
        }
        return {
            code: 200,
            message: 'Customer has been created successfully',
            data: customer
        };
    }
    async createCustomerCard(customer_id, card_token) {
        let card;
        try {
            card = await stripe.customers.createSource(customer_id, { source: card_token });
        }
        catch (error) {
            return {
                code: 400,
                message: error.message
            };
        }
        return {
            code: 200,
            message: 'Card has been created successfully',
            data: card
        };
    }
    async makeDefaultCard(customer_id, card_id) {
        let card;
        try {
            card = await stripe.customers.update(customer_id, { default_source: card_id });
        }
        catch (error) {
            return {
                code: 400,
                message: error.message
            };
        }
        return {
            code: 200,
            message: 'Card has been updated successfully',
            data: card
        };
    }
    async deleteCustomerCard(customer_id, card_id) {
        let card;
        try {
            card = await stripe.customers.deleteSource(customer_id, card_id);
        }
        catch (error) {
            return {
                code: 400,
                message: error.message
            };
        }
        return {
            code: 200,
            message: 'Card has been deleted successfully',
            data: card
        };
    }
    async customerCharge(customer_id, amount, capture = true, currency = 'usd', description = '') {
        let charge;
        try {
            charge = await stripe.charges.create({
                amount: (amount * 100),
                currency: currency,
                customer: customer_id,
                description: description,
                capture: capture
            });
        }
        catch (error) {
            return {
                code: 400,
                message: error.message
            };
        }
        return {
            code: 200,
            message: 'payment has been charged successfully',
            data: charge
        };
    }
}
exports.default = Stripe;
module.exports = Stripe;
//# sourceMappingURL=Stripe.js.map