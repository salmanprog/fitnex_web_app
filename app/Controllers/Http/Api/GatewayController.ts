'use strict'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Controller from "../Controller";
import gateway from 'App/Libraries/PaymentGateway/Index';

export default class GatewayController extends Controller
{
    protected __resource: string;
    protected __request: object;
    protected __response: object;
    protected __params: object;

    constructor() {
        super();
        this.__request; //adonis request obj
        this.__response; //adonis response obj
        this.__params = {}; // this is used for get parameters from url
    }

    async customer(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;

        let params    = this.__request.all();
        let customer = await gateway.init().createCustomer({email:params.email});
        if( customer.code != 200 ){
            return this.sendError('Gateway Error',{message: customer.message}, 400);
        }

        this.__is_paginate = false;
        this.__collection  = false;
        await this.__sendResponse(200,'customer has been created successfully',{ gateway_customer_id: customer.data.id });
        return;
    }

    async customerCard( ctx: HttpContextContract )
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;

        let params    = this.__request.all();
        let card = await gateway.init().createCustomerCard(params.gateway_customer_id,params.card_token);
        if( card.code != 200 ){
            return this.sendError('Gateway Error',{message: card.message}, 400);
        }

        this.__is_paginate = false;
        this.__collection  = false;
        await this.__sendResponse(200,'Customer card has been created successfully',{ card: card });
        return;
    }

    async makeDefaultCard( ctx: HttpContextContract )
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;

        let params    = this.__request.all();
        let card = await gateway.init().makeDefaultCard(params.gateway_customer_id,params.card_id);
        if( card.code != 200 ){
            return this.sendError('Gateway Error',{message: card.message}, 400);
        }

        this.__is_paginate = false;
        this.__collection  = false;
        await this.__sendResponse(200,'Customer card has been updated successfully',{ card: card });
        return;
    }

    async deleteGatewayCard( ctx: HttpContextContract )
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;

        let params    = this.__request.all();
        let card = await gateway.init().deleteCustomerCard(params.gateway_customer_id,params.card_id);
        if( card.code != 200 ){
            return this.sendError('Gateway Error',{message: card.message}, 400);
        }

        this.__is_paginate = false;
        this.__collection  = false;
        await this.__sendResponse(200,'Customer card has been deleted successfully',{ card: card });
        return;
    }

    async gatewayCharge( ctx: HttpContextContract )
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;

        let params    = this.__request.all();
        let charge = await gateway.init().customerCharge(
            params.gateway_customer_id,
            params.amount,
          );
        if( charge.code != 200 ){
            return this.sendError('Gateway Error',{message: charge.message}, 400);
        }

        this.__is_paginate = false;
        this.__collection  = false;
        await this.__sendResponse(200,'Payment has been charged successfully',{ charge: charge });
        return;
    }
}
