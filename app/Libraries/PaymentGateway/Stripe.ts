'use strict'
import Env from '@ioc:Adonis/Core/Env'
const stripe = require('stripe')(Env.get('STRIPE_SECRET_KEY'));

export default class Stripe
{
    async createCustomer(data: object)
    {
        let customer;
        try{
          customer = await stripe.customers.create(data);
        } catch( error ){
            return {
               code: 400,
               message: error.message
            }
        }
        return {
          code: 200,
          message: 'Customer has been created successfully',
          data: customer
        }
    }

    async createCustomerCard( customer_id:string, card_token:string )
    {
        let card;
        try{
          card = await stripe.customers.createSource(
            customer_id,
            {source: card_token}
          );
        } catch ( error ){
          return {
              code: 400,
              message: error.message
          }
        }
        return {
          code: 200,
          message: 'Card has been created successfully',
          data: card
        }
    }

    async makeDefaultCard(customer_id:string, card_id:string)
    {
        let card;
        try{
          card = await stripe.customers.update(
              customer_id,
              { default_source:card_id }
            );
        } catch ( error ){
          return {
              code: 400,
              message: error.message
          }
        }
        return {
          code: 200,
          message: 'Card has been updated successfully',
          data: card
        }
    }

    async deleteCustomerCard(customer_id: string, card_id: string)
    {
        let card;
        try{
          card = await stripe.customers.deleteSource(
              customer_id,
              card_id
            );
        } catch ( error ){
          return {
              code: 400,
              message: error.message
          }
        }
        return {
          code: 200,
          message: 'Card has been deleted successfully',
          data: card
        }
    }

    async customerCharge(customer_id:string, amount:number, capture:boolean=true, currency:string='usd', description:string='' )
    {
        let charge;
        try{
          charge = await stripe.charges.create({
                      amount: (amount * 100),
                      currency: currency,
                      customer: customer_id,
                      description: description,
                      capture: capture
                    });
        } catch ( error ){
          return {
              code: 400,
              message: error.message
          }
        }
        return {
          code: 200,
          message: 'payment has been charged successfully',
          data: charge
        }
    }
}
module.exports = Stripe
