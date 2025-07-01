'use strict'
import Env from '@ioc:Adonis/Core/Env'

export default class Index
{
    public static init( )
    {
      let driver   = Env.get('PAYMENT_GATEWAY');
      let instance =  require(`App/Libraries/PaymentGateway/${driver}.ts`);
      return new instance;
    }
}
