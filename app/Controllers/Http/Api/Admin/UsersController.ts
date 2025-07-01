import RestController from '.././RestController'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import I18n from '@ioc:Adonis/Addons/I18n'
import _ from 'lodash'
import User from 'App/Models/User';
import { request } from 'http'
import { sendMail, currentDateTime } from 'App/Helpers/Index'

export default class UsersController extends RestController
{
    protected __resource: string;
    protected __request: object;
    protected __response: object;
    protected __params: object;

    constructor() {
        super("User");
        this.__resource = "AdminUsers";
        this.__request; //adonis request obj
        this.__response; //adonis response obj
        this.__params = {}; // this is used for get parameters from url
        this.__success_store_message = 'messages.success_store_message';
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
          // company_name: schema.string({}),
          // company_address: schema.string({}),
          // user_group_id: schema.string({}),
          // name: schema.string({}),
          // email: schema.string({}),

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
          // company_name: schema.string({}),
          // company_address: schema.string({}),
          // name: schema.string({}),
            
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
      let body_params = this.__request.all();
      let check_email = await User.getUser(body_params.email);
      let check_number = await User.getUserNumber(body_params.mobile_number);
      if(!_.isEmpty(check_email)){
        this.__is_error = true;
          return this.sendError(
              'Validation Message',
              { message: 'Email already associated with another user' },
              400
          );
      }
      if(!_.isEmpty(check_number)){
        this.__is_error = true;
          return this.sendError(
              'Validation Message',
              { message: 'Phone number already associated with another user' },
              400
          );
      }
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
        let params = this.__request.all();
        let user = this.__request.user();
        let slug = this.__params.id

        let get_user = await User.query().where('slug',slug).first();
        let get_child = await User.getUserHierarchy(get_user.id)
        let delete_all_childe = await User.query().whereIn('id',get_child).update({'deleted_at':currentDateTime()});
    }

    /**
     *
     */
    protected async afterDestoryLoadModel()
    {
       
    }

    public async userDashboard(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
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
        
        let record = await User.dashBoard(this.__request.user().id,this.__request.user().user_group_id);
        //send response
        this.__is_paginate = false;
        this.__collection  = false;
        this.__sendResponse(200,'Get Dashboard data retrived successfully',record);
        return;
    }

    public async getChildUser(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
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
        let get_ids = await User.getUserHierarchy(params.parent_id);
        let record = await User.getUserByIds(get_ids,params.user_group_id);
        //send response
        this.__is_paginate = false;
        //this.__collection  = false;
        this.__sendResponse(200,'User Hierarchy retrived successfully',record);
        return;
    }
}
