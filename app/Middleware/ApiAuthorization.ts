import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import CryptoJS from 'crypto-js';
import _ from 'lodash';

export default class ApiAuthorization {
  public async handle({request, response}: HttpContextContract, next: () => Promise<void>) {
      // code for middleware goes here. ABOVE THE NEXT CALL
      let token     = request.header('token');
      let client_id = Env.get('CLIENT_ID');
      if( _.isEmpty(token) ){
          let data = {
              code: 401,
              message: 'You are not authorize to process this request',
              data:{}
          }
          response.status(401).send(data);
          return;
      }
      //decrypt client id
      try{
          var key = CryptoJS.enc.Utf8.parse(Env.get('AES_SECRET'));
          var iv  = CryptoJS.enc.Utf8.parse(Env.get('AES_IV'));
          var bytes = CryptoJS.AES.decrypt(token, key, {iv:iv});
          var decrypt_token = bytes.toString(CryptoJS.enc.Utf8);
      } catch (err){
            let res = {
                code: 401,
                message: 'Invalid Authorization token',
                data:{}
            }
            response.status(401).send(res);
            return;
      }
      //check client id is valid or not
      if( decrypt_token != client_id){
          let res = {
              code: 401,
              message: 'Invalid Authorization token',
              data:{}
          }
          response.status(401).send(res);
          return;
      }
      await next()
  }
}
