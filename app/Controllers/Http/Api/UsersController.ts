import Application  from '@ioc:Adonis/Core/Application'
import RestController from './RestController'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User';
import UserApiToken from 'App/Models/UserApiToken';
import ResetPassword from 'App/Models/ResetPassword';
import _ from 'lodash'
import Env from '@ioc:Adonis/Core/Env'
import Twillio from 'App/Libraries/OtpVerification/Twillio';
import Telesign from 'App/Libraries/OtpVerification/Telesign';
import { string } from '@ioc:Adonis/Core/Helpers'
import { rand, fileValidation } from 'App/Helpers/Index';
const Request = Application.container.use('Adonis/Core/Request')
const passwordHash = require('password-hash')

export default class UsersController extends RestController
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
            name: schema.string({},[
              rules.minLength(2),
              rules.maxLength(20),
              rules.regex(/^[A-Za-z0-9\s]+$/)
            ]),
            nick_name: schema.string({},[
              rules.minLength(2),
              rules.maxLength(20),
              rules.regex(/^[A-Za-z0-9\s]+$/)
            ]),
            email: schema.string({},[
                rules.email(),
                rules.maxLength(50),
                rules.unique({
                  table: 'users',
                  column: 'email',
                  where: {
                    deleted_at: null,
                  },
                })
            ]),
            martial_status: schema.string({},[
              rules.regex(/^[0-9]*$/)
            ]),
            password: schema.string({},[
                rules.minLength(8),
                rules.maxLength(100),
                rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/)
            ]),
            confirm_password: schema.string({},[
              rules.confirmed('password')
            ]),
            device_type: schema.enum(['ios','android','web']),
            device_token: schema.string()
        })
        try{
          validator = await this.__request.validate({ schema: validationRules,messages: {
                      required: '{{ field }} is required to sign up', 
                      'email.unique': 'email already exist in our recorde',
                      'martial_status.regex': 'only number allowed'
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
        let validator;
        let validationRules
        validationRules = schema.create({
            name: schema.string.optional({},[
              rules.minLength(2),
              rules.maxLength(20),
              rules.regex(/^[A-Za-z0-9\s]+$/)
            ]),
            device_type: schema.enum.optional(['ios','android','web']),
            device_token: schema.string.optional()
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
        this.__resource = 'PublicUser';
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
        let user = this.__request.user();
        if( user.slug != this.__params.id ){
            this.__is_error = true;
            return this.sendError(
              'Validation Message',
              { message: 'invalid request' },
              400
            )
        }
        //check image validation
        if( !_.isEmpty(this.__request.file('image_url')) ) {
            let fileValidate = fileValidation(this.__request.file('image_url'),6000000,);
            if ( fileValidate.error ) {
              this.__is_error = true;
                return this.sendError(
                    'Validation Message',
                    { message: fileValidate.message },
                    400
                );
            }
        }
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
        let user = await User.getUserByEmail(body_params.email);
        if( _.isEmpty(user) ){
          return this.sendError('Unauthorized',{message:'Invalid Credentials'},400);
        }
        if (!(await passwordHash.verify(body_params.password, user.password))) {
          return this.sendError('Unauthorized',{message:'Invalid Credentials'},400);
        }
        if( user.status != 1 ){
          return this.sendError('Unauthorized',{message:'Your account has been disabled by the Admin'},400);
        }
        if( user.is_email_verify != 1 && Env.get('MAIL_SANDBOX') == 0 ){
          return this.sendError('Unauthorized',{message:'Your email is not verified. Please check your email and verify your account'},400);
        }
        //update api token
        let api_token = await UserApiToken.createApiToken(this.__request,user.id);
        user.userApiToken = api_token;
        //send response
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
        if (!(await passwordHash.verify(body_params.current_password, user.password))) {
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
          let newPassword = await passwordHash.generate(body_params.new_password);
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

    public async socialLogin(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
            platform_id: schema.string({},[
                rules.maxLength(200),
            ]),
            platform_type:schema.enum(['facebook','google','apple']),
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
        let record = await User.socialLogin(this.__request);
        //send response
        this.__is_paginate = false;
        this.__sendResponse(200,'You have logged in successfully',record);
        return;
    }

    public async verifyCode(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        let params = this.__request.all();
        let validationRules = schema.create({
            code: schema.string({},[
                rules.maxLength(6),
            ]),
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
        let user = this.__request.user();
        //check twillio code
        if( Env.get('OTP_SENDBOX') == 0 ){
            let twillio_response = await Twillio.verifyOtp(user.mobile_no,params.code);
            if( twillio_response.code != 200 ){
                return this.sendError(
                  'SMS gateway error',
                  {message: twillio_response.message},
                  400
                )
            }
        }
        //check telesign code
        if( Env.get('OTP_SENDBOX') == 0 ){
            if( user.mobile_otp != params.code ){
                return this.sendError(
                  'SMS gateway error',
                  {message: 'OTP is invalid'},
                  400
                )
            }
        }
        //update mobile verify flag
        let data = {
          mobile_otp: null,
          is_mobile_verify: '1',
          mobile_verify_at: new Date()
        }
        User.updateUser(data,{id: user.id}).then()
        //update user object
        user.is_mobile_verify = data.is_mobile_verify
        user.mobile_verify_at = data.mobile_verify_at

        //send response
        this.__is_paginate = false;
        this.__sendResponse(200,'Mobile number has been verified successfully',user);
        return;
    }

    public async resendCode(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        let user = this.__request.user();

        //twillio
        if( Env.get('OTP_SENDBOX') == 0 ){
            let twillio_response = await Twillio.sendOtp(user.mobile_no);
            if( twillio_response.code != 200 ){
              this.__is_error = true;
              return  this.sendError('SMS gateway Error',{message:twillio_response.message},400);
            }
        }

        //telesign
        if( Env.get('OTP_SENDBOX') == 0 ){
            let otp_code = rand(1111,9999);
            let telesignResponse = await Telesign.sendOtp(user.mobile_no,otp_code);
            if( telesignResponse.code != 200 ){
                return  this.sendError('SMS gateway Error',{message:telesignResponse.message},400);
            }
            //update otp into user table
            let data = {
              mobile_otp: otp_code,
              mobile_otp_created_at: new Date()
            }
            User.updateUser(data,{id: user.id}).then()
        }

        this.__is_paginate = false;
        this.__sendResponse(200,'OTP has been send successfully',user);
        return;
    }

    public async getUserLogs(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        let user = this.__request.user();
        //check validation
        let validationRules = schema.create({
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
        let params = this.__request.all()

        let record = await UserQuickLog.getLogsByMonthYear(params.month,params.year,user.id,params.is_by_date,params.log_date,params.log_type,params.created_at)
        //send response
        this.__resource = 'UserQuickLogByCalender';
        this.__is_paginate = false;
        await this.__sendResponse(200,'get all record of curren month and year',record);
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

    public async userGeneratedLink(ctx: HttpContextContract)
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
        if( !_.isEmpty(user) ){
          return this.sendError('Validation Error',{message:'Email already exits'},400);
        }
        let record = await User.gernateUser(this.__request);
        let generateLinkToken = record.id + string.generateRandom(32);
        let update_user = await User.updateUser({'user_link':generateLinkToken,'is_link':'1'},{'id':record.id})
        let get_user = await User.getUserById(record.id);
        //send response
        this.__is_paginate = false;
        this.__sendResponse(200,'Link generated by user',get_user);
        return;
    }

    public async userVerifyLink(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
          name: schema.string({},[
            rules.minLength(2),
            rules.maxLength(20),
            rules.regex(/^[A-Za-z0-9\s]+$/)
          ]),
          password: schema.string({},[
              rules.minLength(8),
              rules.maxLength(100),
              rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/)
          ]),
          confirm_password: schema.string({},[
            rules.confirmed('password')
          ]),
          user_link: schema.string()
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
        let user = await User.getUserByLinkToken(body_params.user_link);
        if( _.isEmpty(user) ){
          return this.sendError('Validation Error',{message:'Link has been expire'},400);
        }
        let update_user = await User.updateUser({'name':body_params.name,'mobile_number':body_params.mobile_number,'password':await passwordHash.generate(body_params.password),'dob':body_params.dob,'user_link':null,'is_link':'0','status':'1'},{'id':user.id})
        let get_user = await User.getUserById(user.id);
        //send response
        this.__is_paginate = false;
        this.__sendResponse(200,'User has been created successfully',get_user);
        return;
    }

    public async getUserByLink(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        this.__params   = ctx.params;
        //check validation
        let validationRules = schema.create({
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
        let linkToken = this.__params.slug
        let user = await User.getUserByLinkToken(linkToken);
        if( _.isEmpty(user) ){
          return this.sendError('Validation Error',{message:'Link has been expire'},400);
        }
        //send response
        this.__is_paginate = false;
        this.__sendResponse(200,'User has been retrived successfully',user);
        return;
    }

    public async getUserListLink(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
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
        let users = await User.getUserLists();
        //send response
        this.__resource = "InviteUsers";
        this.__is_paginate = false;
        
        this.__sendResponse(200,'User has been retrived successfully',users);
        return;
    }
}
