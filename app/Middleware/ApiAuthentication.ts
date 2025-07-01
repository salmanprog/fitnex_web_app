import Application  from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'
import _ from 'lodash';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken'

export default class ApiAuthentication {
  public async handle({request,response}: HttpContextContract, next: () => Promise<void>) {
      // code for middleware goes here. ABOVE THE NEXT CALL
      let headers = request.headers();
      let authorization = headers.authorization;
      let jwt_data;

      if( _.isEmpty(authorization) ){
          let res = {
              code: 401,
              message: 'Authorization header is required',
              data:{}
          }
          response.status(401).send(res);
          return;
      }
      authorization = authorization.replace('Bearer ','');
      //decrypt AES Data
      try{
        var key         = CryptoJS.enc.Utf8.parse(Env.get('AES_SECRET'));
        var iv          = CryptoJS.enc.Utf8.parse(Env.get('AES_IV'));
        var bytes       = CryptoJS.AES.decrypt(authorization,key, {iv:iv} );
        var base64Token = bytes.toString(CryptoJS.enc.Utf8);
      } catch (err){
          let res = {
              code: 401,
              message: 'Authorization header is not valid',
              data:{}
          }
          response.status(401).send(res);
          return;
      }
      //decode base64 token
      authorization   = Buffer.from(base64Token, 'base64').toString('ascii')
      //get user by authorization header
      let user = await User.getUserByApiToken(authorization);
      if( _.isEmpty(user) ){
          let res = {
              code: 401,
              message: 'Authorization header is not valid',
              data:{}
          }
          response.status(401).send(res);
          return;
      }
      //verify jwt
      try{
        jwt_data = await jwt.verify(authorization, Env.get('JWT_SECRET'))
      } catch(err){
          let res = {
              code: 401,
              message: err,
              data:{}
          }
          response.status(401).send(res);
          return;
      }

      if( user.status == 0 ){
          let res = {
              code: 401,
              message: 'Your account is disabled. Please contact to administrator',
              data:{}
          }
          response.status(401).send(res);
          return;
      }

      if( Env.get('MAIL_SANDBOX') == 0 ){
          if( user.is_email_verify == 0 ){
              let res = {
                  code: 401,
                  message: 'Your email is not verified. Please check your email and verify your account',
                  data:{}
              }
              response.status(401).send(res);
              return;
          }
      }

      const Request = Application.container.use('Adonis/Core/Request')
      Request.macro('user', function () {
          return user;
      });
      Request.macro('apiToken', function () {
        return authorization;
      });

      await next()
  }
}
