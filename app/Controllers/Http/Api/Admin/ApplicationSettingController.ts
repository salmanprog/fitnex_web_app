import RestController from '.././RestController'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import I18n from '@ioc:Adonis/Addons/I18n'
import _ from 'lodash'
import { currentDateTime } from 'App/Helpers/Index'
import ApplicationSetting from 'App/Models/ApplicationSetting';
import FileUpload from 'App/Libraries/FileUpload/FileUpload';

export default class ApplicationSettingController extends RestController
{
    protected __resource: string;
    protected __request: object;
    protected __response: object;
    protected __params: object;

    constructor() {
        super("ApplicationSetting");
        this.__resource = "ApplicationSetting";
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
 
    public async getSetting(ctx: HttpContextContract)
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

      let record = []
      let identifier = 'application_setting'
      let params = this.__request.all()
      if(this.__request.method() == 'POST' ){
            let get_setting = await ApplicationSetting.getSetting(identifier);

            if( !_.isEmpty(this.__request.file('logo')) ){
              params.logo = await FileUpload.doUpload(this.__request.file('logo'),identifier);
            } else {
              params.logo = get_setting.logo;
            }
            //upload favicon
            if( !_.isEmpty(this.__request.file('favicon')) ){
              params.favicon = await FileUpload.doUpload(this.__request.file('favicon'),identifier);
            } else {
              params.favicon = get_setting.favicon;
            }
            //delete old data
            await ApplicationSetting.query().where('identifier',identifier).delete();
            //insert new data
            let ApplicationSettingData = [];
            for (const [key, value] of Object.entries(params)) {
                ApplicationSettingData.push({
                  identifier: identifier,
                  meta_key: key,
                  value: value,
                  is_file: key == 'logo' || key == 'favicon' ? '1' : '0',
                  created_at: currentDateTime(),
                });
            }
            await ApplicationSetting.createMany(ApplicationSettingData);

            record = await ApplicationSetting.getSetting(identifier);
      }else{
          record = await ApplicationSetting.getSetting(identifier);
      }
      
      //send response
      this.__is_paginate = false;
      this.__resource = 'ApplicationSetting';

      this.__sendResponse(
        200,
        'Validation Message',
        record
      );
      return;
    }
}
