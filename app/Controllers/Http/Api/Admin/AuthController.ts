import RestController from '.././RestController'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import I18n from '@ioc:Adonis/Addons/I18n'
import _ from 'lodash'
//import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User';
import Env from '@ioc:Adonis/Core/Env'
import CmsModule from 'App/Models/CmsModule';
import UserApiToken from 'App/Models/UserApiToken';
import UserGroup from 'App/Models/UserGroup';
const passwordHash = require('password-hash')

export default class AuthController extends RestController
{
    protected __resource: string;
    protected __request: object;
    protected __response: object;
    protected __params: object;

    constructor() {
        super("User");
        this.__resource = "AdminAuth";
        this.__request; //adonis request obj
        this.__response; //adonis response obj
        this.__params = {}; // this is used for get parameters from url
        this.__success_store_message = 'messages.account_created';
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
          validator = await this.__request.validate({ schema: validationRules })
        } catch(error){
            this.__is_error = true;
            return this.sendError(
              'Validation Message', //validation_msg
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
        let validator;
        let validationRules
        validationRules = schema.create({
            
        })
        try{
          validator = await this.__request.validate({ schema: validationRules })
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
     */
    protected async beforeIndexLoadModel()
    {
        this.__resource = 'AdminAuth';
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
        let user = await User.getAdminByEmail(body_params.email);
        
        if( _.isEmpty(user) ){
          return this.sendError('Unauthorized',{message:'Invalid Credentials'},401);
        }
        if (!(await passwordHash.verify(body_params.password, user.password))) {
          return this.sendError('Unauthorized',{message:'Invalid Credentials'},401);
        }
        if( user.status != 1 ){
          return this.sendError('Unauthorized',{message:'Your account has been disabled by the Admin'},401);
        }
        if( user.is_email_verify != 1 && Env.get('MAIL_SANDBOX') == 0 ){
          return this.sendError('Unauthorized',{message:'Your email is not verified. Please check your email and verify your account'},401);
        }
        //update api token
        let api_token = await UserApiToken.createApiToken(this.__request,user.id);
        user.userApiToken = api_token;
        let get_role = await UserGroup.getById(user.user_group_id)
        user.cms_modules = await CmsModule.getCmsModules(get_role?.slug,[],{user_group_id:user.user_group_id});
        //send response
        this.__is_paginate = false;
        await this.__sendResponse(200,'You have logged in successfully',user);
        return;
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
