//import I18n from '@ioc:Adonis/Addons/I18n'

import Drive from '@ioc:Adonis/Core/Drive'
import {baseUrl} from 'App/Helpers/Index'
import ApplicationSetting from 'App/Models/ApplicationSetting';
import moment from 'moment';

export default class Controller {

    protected __is_error: boolean;
    protected __is_paginate: boolean;
    protected __collection: boolean;

    constructor() {
        this.__is_error    = false;
        this.__is_paginate = true;
        this.__collection  = true;
    }

    /**
     *
     * @param {*} messages
     * @returns
     */
    protected setValidatorMessagesResponse( messages: object , type:string = 'api' )
    {
        let error_messages = type == 'api' ? {} : '';
        messages = messages.errors;
        if( messages.length > 0 ){
            for( var i=0; i < messages.length; i++ )
            {
                if( type == 'api' )
                  error_messages[messages[i].field] = messages[i].message;
                else
                  error_messages += '<p>'+ messages[i].message +'</p>';
            }
        }
        return error_messages;
    }

    /**
     *
     * @param code
     * @param message
     * @param data
     * @returns {Promise<void>}
     */
    protected async __sendResponse(code:number = 200, message:string = "success", data:object = {})
    {
        let links = this.paginateLinks(data);
        let results = this.__is_paginate ? data.data : data;
        let obj = {};
        if (this.__collection) {
            let resource = this.loadResource();
            results = await resource.initResponse(results,this.__request);

            obj.code = code;
            obj.message = message;
            obj.data = results;
            obj.links = links;
        } else {
            obj.code = code;
            obj.message = message;
            obj.data = results;
            obj.links = links;
        }
        this.__response.status(code).send(obj);
        return;
    }

     /**
     *
     * @param data
     * @returns {{next: null, last: null, prev: null, first: null}|{next: number, per_page: number, total: (number|number), current: number, prev: number}}
     */
      private paginateLinks(data:object)
      {
        let links = {};
        if (this.__is_paginate) {
            links = {
                total: data.meta.total,
                per_page: data.meta.per_page,
                current_page: data.meta.current_page,
                last_page: data.meta.last_page,
                prev: parseInt(data.meta.current_page) - 1,
                next: parseInt(data.meta.current_page) + 1,
            };
        } else {
            links = {
                first: null,
                last: null,
                prev: null,
                next: null,
            };
        }
        return links;
    }

    /**
     *
     * @param error
     * @param error_messages
     * @param http_code
     */
    protected sendError( error:string = 'Validation Message', error_message:object = {}, http_status_code:number = 400)
    {
        let obj = {
            code: http_status_code,
            message: error,
            data: error_message,
        };
        this.__response.status(http_status_code).send(obj);
        return;
    }

    protected async loadAdminView(viewClass: object, viewPath:string, data: Array<string|object>=[])
    {
      let driveUrl = baseUrl() + await Drive.getUrl('/');
      data.storage_url = function(path){
         return driveUrl + path;
      }
      data.application_setting = await ApplicationSetting.getSetting('application-setting');
      data.current_year = moment().format('YYYY');
      return viewClass.render('admin.'+ viewPath,data);
    }

    /**
     *
     * @returns {*}
     */
    private loadResource()
    {
        return require(`App/Controllers/Http/Resource/${this.__resource}`);
    }
}
