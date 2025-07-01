import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import Controller from "../Controller";
import _ from 'lodash';
import User from 'App/Models/User';
import Notification from 'App/Models/Notification';
// import { fileValidation, generateVideoThumb } from 'App/Helpers/Index';

export default class GeneralController extends Controller
{
    protected __resource: string;
    protected __request: object;
    protected __response: object;
    protected __params: object;

    constructor() {
        super();
        this.__request; //adonis request obj
        this.__response; //adonis response obj
        this.__params = {}; // this is used for get parameters from url
    }

    public async sendTestNotification(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;

        let validationRules = schema.create({
            target_user_id: schema.string({}),
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

        let actor = this.__request.user();
        let targetUsers = await User.getTargetUsersByID(this.__request.input('target_user_id'));
        if( !_.isEmpty(targetUsers) ){
              let notification_data = {
                    actor: actor,
                    target: targetUsers,
                    module: 'users',
                    module_id: actor.id,
                    module_slug: actor.slug,
                    reference_id:null,
                    reference_module: null,
                    reference_slug: null,
                    title: 'AdonisJS',
                    message: 'Testing push notification',
                    redirect_link: null,
                    badge:0,
                }
                let custom_data = {
                    record_id: actor.id,
                    redirect_link: null,
                    identifier: 'test-notification'
                }
                Notification.sendNotification(
                  'test-notification',
                  notification_data,
                  custom_data
                ).then();
        }

        //send response
        this.__is_paginate = false;
        this.__collection  = false;
        await this.__sendResponse(200,'Test notification has been sent successfully',[]);
        return;
    }
}
