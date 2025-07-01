import Application  from '@ioc:Adonis/Core/Application'
import RestController from '../Admin/CrudController'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User';
import UserApiToken from 'App/Models/UserApiToken';
import ResetPassword from 'App/Models/ResetPassword';
import _ from 'lodash'
import Env from '@ioc:Adonis/Core/Env'
import { rand, fileValidation } from 'App/Helpers/Index';
const Request = Application.container.use('Adonis/Core/Request')

export default class AdminController extends RestController
{
    protected __resource: string;
    protected __request: object;
    protected __response: object;
    protected __params: object;

    constructor() {
        super("User");
        this.__resource = "User";
        this.__request; //adonis request obj
        this.__response; //adonis response obj
        this.__params = {}; // this is used for get parameters from url
    }

    /**
     *
     * @param action
     * @param slug
     */
    protected async validation( action: string, slug: string )
    {
        switch (action) {
          case "store":
            await this.storeValidation();
          break;
          case "update":
            await this.updateValidation();
          break;
        }
    }

    /**
     *
     * @returns
     */
    private async storeValidation()
    {
        let validator;
        let validationRules;
        validationRules = schema.create({
        })
        try{
          validator = await this.__request.validate({ schema: validationRules,messages: {
          }
         })
        } catch(error){
            this.__is_error = true;
            return this.sendError(
              'Validation Message',
               this.setValidatorMessagesResponse(error.messages),
               400
            )
        }
        return validator;
    }


    /**
     *
     * @returns
     */
    private async updateValidation()
    {
        
    }

    /**
     *
     */
    protected async beforeIndexLoadModel()
    {
        this.__resource = 'Admin';
    }

    /**
     *
     */
    protected async afterIndexLoadModel(records:object)
    {

    }

    /**
     *
     */
    protected async beforeStoreLoadModel()
    {
        
    }

    /**
     *
     */
    protected async afterStoreLoadModel()
    {

    }

    /**
     *
     */
    protected async beforeShowLoadModel()
    {

    }

    /**
     *
     */
    protected async afterShowLoadModel(record: object)
    {

    }

    /**
     *
     */
    protected async beforeUpdateLoadModel()
    {
        
    }

    /**
     *
     */
    protected async afterUpdateLoadModel()
    {

    }

    /**
     *
     */
    protected async beforeDestoryLoadModel()
    {

    }

    /**
     *
     */
    protected async afterDestoryLoadModel()
    {

    }

    public async login(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
            email: schema.string({},[
              rules.email(),
            ]),
            password: schema.string(),
            device_type: schema.enum(['ios','android','web']),
            device_token: schema.string()
        })
        try{
          await this.__request.validate({ schema: validationRules })
        } catch(error){
            return this.sendError(
              'Validation Message',
              this.setValidatorMessagesResponse(error.messages),
              400
            )
        }
        //get user by email
        let body_params = this.__request.all();

        let user = await User.adminAuth(body_params.email);
        if( _.isEmpty(user) ){
          return this.sendError('Unauthorized',{message:'Invalid Credentials'},401);
        }
        if (! await Hash.verify(user.password, body_params.password)) {
          return this.sendError('Unauthorized',{message:'Invalid Credentials'},401);
        }
        if( user.status != 1 ){
          return this.sendError('Unauthorized',{message:'Your account has been disabled by the Admin'},401);
        }
        //update api token
        let api_token = await UserApiToken.createApiToken(this.__request,user.id);
        user.userApiToken = api_token;
        //send response
        this.__resource = 'Admin';
        this.__is_paginate = false;
        await this.__sendResponse(200,'You have logged in successfully',user);
        return;
    }

    public async forgotPassword(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
            email: schema.string({},[
              rules.email(),
            ]),
        })
        try{
          await this.__request.validate({ schema: validationRules })
        } catch(error){
            this.__is_error = true;
            return this.sendError(
              'Validation Message',
              this.setValidatorMessagesResponse(error.messages),
              400
            )
        }
        let body_params = this.__request.all();
        let user = await User.getUserByEmail(body_params.email);
        if( _.isEmpty(user) ){
          return this.sendError('Validation Error',{message:'Invalid email'},400);
        }
        if( user.is_email_verify != 1 && Env.get('MAIL_SANDBOX') == 0 ){
          return this.sendError('Validation Error',{message:'Invalid email'},400);
        }
        if( user.status != 1 ){
          return this.sendError('Validation Error',{message:'Your account has been disabled by the Admin'},400);
        }

        ResetPassword.forgotPassword(user).then( () => {} );
        //send response
        this.__is_paginate = false;
        this.__sendResponse(200,'Reset password link has been sent to your email address',{});
        return;
    }

    public async changePassword(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
            current_password: schema.string(),
            new_password: schema.string({},[
              rules.minLength(8),
              rules.maxLength(100),
              rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/)
            ]),
            confirm_password: schema.string({},[
              rules.confirmed('new_password')
            ])
        })
        try{
          await this.__request.validate({ schema: validationRules })
        } catch(error){
            return this.sendError(
              'Validation Message',
              this.setValidatorMessagesResponse(error.messages),
              400
            )
        }
        let user        = this.__request.user();
        let body_params = this.__request.all();
        if (! await Hash.verify(user.password, body_params.current_password)) {
            return this.sendError(
              'Validation Message',
              {message: 'Your current password is not valid'},
              400
            )
        } else if(body_params.new_password == body_params.current_password){
            return this.sendError(
              'Validation Message',
              {message: 'The current password and new password must be different'},
              400
            )
        } else {
            let newPassword = await Hash.make(body_params.new_password)
            await User.updateUser({password:newPassword},{id:user.id});
            //delete api token except current token
            UserApiToken.deleteApiTokenExceptCurrentToken(user.id,this.__request.apiToken()).then()
            //send response
            this.__is_paginate = false;
            this.__collection  = false;

            this.__sendResponse(200,'Password has been updated successfully',[]);
            return;
        }
    }

    public async userLogout(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
            device_type:schema.enum(['android','ios','web']),
            device_token:schema.string(),
        })
        try{
          await this.__request.validate({ schema: validationRules })
        } catch(error){
            return this.sendError(
              'Validation Message',
              this.setValidatorMessagesResponse(error.messages),
              400
            )
        }
        await User.removeDeviceToken(this.__request);
        //send response
        this.__is_paginate = false;

        this.__sendResponse(200,'You have logged out successfully',[]);
        return;
    }
}
