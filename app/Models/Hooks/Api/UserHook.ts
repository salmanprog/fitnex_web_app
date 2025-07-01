'use strict'

import _ from 'lodash';
import FileUpload from 'App/Libraries/FileUpload/FileUpload'
import User from 'App/Models/User';
//import Hash from '@ioc:Adonis/Core/Hash'
import { sendMail, currentDateTime } from 'App/Helpers/Index'
import Database from '@ioc:Adonis/Lucid/Database'
import Application  from '@ioc:Adonis/Core/Application'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Env from '@ioc:Adonis/Core/Env'
const passwordHash = require('password-hash')
import UserSelectedServices from 'App/Models/UserSelectedServices';
import Services from 'App/Models/Services';

class UserHook
{
     /**
     * Hook for manipulate query of index result
     * @param {current mongo query} query
     * @param {adonis request object} request
     * @param {object} slug
     */
    public static async indexQueryHook(query: object, request: object, slug:string = '')
    {
        let params = request.all();
        query.select('users.*')
        if( typeof request.apiToken == 'function' && !_.isEmpty(slug) )
        {
          query.preload('userApiToken', (userApiTokenQuery) => {
            userApiTokenQuery.where('api_token', request.apiToken())
          })
        }
        if(!_.isEmpty(slug.parent_id)){
            query.where('parent_id',slug.parent_id).where('user_group_id',slug.user_group_id)
        }

        if(!_.isEmpty(slug.created_by)){
            let sub_users = await User.getUserHierarchy(slug.created_by);
            if(!_.isEmpty(slug.admin_id)){
                sub_users.push(slug.admin_id)
            }
            query.whereIn('parent_id',sub_users).where('user_group_id',slug.user_group_id)
        }

        if(_.isEmpty(slug)){
            query.where('users.user_type','user')
        }
        query.preload('SelectedServices').preload('BuildingType').orderBy('id','desc')
    }

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async beforeCreateHook(request: object, params:object)
    {
        if( Env.get('OTP_DRIVER') == 'Telesign' && Env.get('OTP_SENDBOX') == 0 ){
            params.mobile_otp = request.otpCode();
            params.mobile_otp_created_at = currentDateTime();
        }
        if( !_.isEmpty(request.file('image_url')) ){
            params.image_url  = await FileUpload.doUpload(request.file('image_url'),'user');
            //params.blurimage  = await FileUpload.createBlurHash(params.image_url);
        }
        let username      = await User.generateSlug(params.name);
        params.user_group_id = _.isEmpty(params.user_group_id) ? 2 : params.user_group_id;
        params.parent_id = _.isEmpty(params.parent_id) ? request.user().id : params.parent_id
        params.user_type  = 'user';
        params.password   =  await passwordHash.generate(params.password)
        params.username   = username
        params.slug       = username
        params.is_email_verify = 1
        params.created_at = currentDateTime();

    }

    /**
     * Hook for execute command after add public static function called
     * @param {saved record object} record
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async afterCreateHook(record:object, request:object, params:object)
    {
        let request_params = request.all();
        let api_token = User.generateApiToken(record.email);
        await Database.table('user_api_tokens').insert({
            user_id: record.id,
            api_token: api_token,
            device_type: request_params.device_type,
            device_token: request_params.device_token,
            platform_type: _.isEmpty(request_params.platform_type) ? 'custom' : request_params.platform_type,
            platform_id: _.isEmpty(request_params.platform_id) ? null : request_params.platform_id,
            ip_address: request.ip(),
            user_agent: request.header('User-Agent'),
            created_at: currentDateTime()
        })
        //merge api token
        const Request = Application.container.use('Adonis/Core/Request')
        Request.macro('apiToken', function () {
            return api_token;
        });

        if(!_.isEmpty(request_params.services_arr)){
            for(let i=0;i<request_params.services_arr.length;i++){
                let slug = await UserSelectedServices.generateSlug('slctd_'+record.id+request_params.services_arr[i])
                let get_service = await Services.query().where('id',request_params.services_arr[i]).first();
                let insert_services = await UserSelectedServices.create({
                    user_id:record.id,
                    service_id:request_params.services_arr[i],
                    slug:slug,
                    service_name:get_service.title,
                    service_amount:get_service.amount,
                    created_at: currentDateTime()
                })
            }
        }
        //send welcome email to user
        // if( Env.get('MAIL_SANDBOX') == 0 ){
        //     let email_params = {
        //       name: record.name,
        //       app_name: Env.get('APP_NAME'),
        //       link: Env.get('APP_URL') + '/user/verify/' + Encryption.encrypt(record.email)
        //     }
        //     sendMail('emails/register',record.email,`Welcome to ${email_params.app_name} `,email_params);
        // }
    }

    /**
     * Hook for manipulate data input before update data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    public static async beforeEditHook(request:object, params:object, slug:string)
    {
        if( !_.isEmpty(request.file('image_url')) ){
          params.image_url  = await FileUpload.doUpload(request.file('image_url'),'user');
          //params.blurimage  = await FileUpload.createBlurHash(params.image_url);
        }

        let request_params = request.all();
        if(!_.isEmpty(request_params.services_arr)){

            let get_user = await User.query().where('slug',slug).first();
            let get_delete_services = await UserSelectedServices.query().whereNotIn('service_id',request_params.services_arr).where('user_id',get_user.id)
            if(!_.isEmpty(get_delete_services)){    
                for(let j=0;j<get_delete_services.length;j++){
                    //console.log('delete_Service_id.........................................',get_delete_services[j].service_id)
                    let delete_services = await UserSelectedServices.query().where('service_id',get_delete_services[j].service_id).where('user_id',get_user.id).delete();
                }
            }
            let get_remaing_services = await UserSelectedServices.query().where('user_id',get_user.id)
            let remaing_service_ids = [];
            if(!_.isEmpty(get_remaing_services)){    
                for(let k=0;k<get_remaing_services.length;k++){
                    remaing_service_ids.push(get_remaing_services[k].service_id.toString())
                }
                //console.log('remaing_service_ids.........................................',remaing_service_ids)
            }
            let new_services = _.xor(request_params.services_arr, remaing_service_ids);
            if(!_.isEmpty(new_services)){
                //console.log('insert_service_ids.........................................',new_services)

                for(let i=0;i<new_services.length;i++){
                    let slug = await UserSelectedServices.generateSlug('slctd_'+get_user.id+new_services[i])
                    let get_service = await Services.query().where('id',new_services[i]).first();
                    let insert_services = await UserSelectedServices.create({
                        user_id:get_user.id,
                        service_id:new_services[i],
                        slug:slug,
                        service_name:get_service.title,
                        service_amount:get_service.amount,
                        created_at: currentDateTime()
                    })
                }
            }
            
        }

    }

    /**
     * Hook for execute command after edit
     * @param {updated record object} record
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async afterEditHook(request:object, slug:string)
    {
        
    }

    /**
     * Hook for execute command before delete
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    public static async beforeDeleteHook(request:object, params:object, slug:string)
    {

    }

    /**
     * Hook for execute command after delete
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    public static async afterDeleteHook(request:object, params:object, slug:string)
    {

    }
}
module.exports = UserHook;
