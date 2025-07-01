import { DateTime } from 'luxon'
import { currentDateTime } from 'App/Helpers/Index'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import crypto from 'crypto';
import Env from '@ioc:Adonis/Core/Env'
import PushNotification from 'App/Libraries/PushNotification'
import _ from 'lodash'

export default class Notification extends BaseModel
{
    public static table = 'notifications'

    @column({ isPrimary: true })
    public id: number

    @column()
    public unique_id: string

    @column()
    public identifier: string

    @column()
    public actor_id: number

    @column()
    public target_id: number

    @column()
    public module: string

    @column()
    public module_id: number

    @column()
    public module_slug: string

    @column()
    public reference_module: string

    @column()
    public reference_id: number

    @column()
    public reference_slug: string

    @column()
    public title: string

    @column()
    public description: string

    @column()
    public web_redirect_link: string

    @column()
    public is_read: string

    @column()
    public is_view: string

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    public static async sendNotification(identifier:string, notification_data:object, custom_data : object={})
    {
        let ios_device_token = [];
        let android_device_token = [];
        let target_user_id = [];

        let target_users = notification_data.target;

        for( var i=0; i < target_users.length; i++ )
        {
            target_user_id.push(target_users[i].id);
            if( !_.isEmpty(target_users[i].device_token) ){
                if( target_users[i].device_type == 'ios' ){
                  ios_device_token.push(target_users[i].device_token)
                } else {
                  android_device_token.push(target_users[i].device_token)
                }
            }
        }
        //create unique record
        ios_device_token     = _.uniq(ios_device_token);
        android_device_token = _.uniq(android_device_token);
        target_user_id       = _.uniq(target_user_id);

        let unique_id = crypto.randomBytes(16).toString("hex");
        custom_data.unique_id = unique_id;

        //send notification on android device
        if( android_device_token.length > 0 ) {
            PushNotification.notification(
                  android_device_token,
                  'android',
                  notification_data.title,
                  notification_data.message,
                  notification_data.badge,
                  notification_data.redirect_link,
                  custom_data
              );
        }
        //send notification on ios device
        if( ios_device_token.length > 0 ) {
            PushNotification.notification(
                  ios_device_token,
                  'ios',
                  notification_data.title,
                  notification_data.message,
                  notification_data.badge,
                  notification_data.redirect_link,
                  custom_data
              );
        }
        //insert notification data into db
        let notification_param = [];
        for( var u=0; u < target_user_id.length; u++ ){
            notification_param.push({
                unique_id: unique_id,
                identifier: identifier,
                actor_id: notification_data.actor.id,
                target_id: target_user_id[u],
                module: notification_data.module,
                module_id: notification_data.module_id,
                module_slug: notification_data.module_slug,
                reference_module: _.isEmpty(notification_data.reference_module) ? null : notification_data.reference_module,
                reference_id: _.isEmpty(notification_data.reference_id) ? null : notification_data.reference_id,
                reference_slug: _.isEmpty(notification_data.reference_slug) ? null : notification_data.reference_slug,
                title: notification_data.title,
                description: notification_data.message,
                web_redirect_link: _.isEmpty(notification_data.redirect_link) ? null : notification_data.redirect_link,
                created_at: currentDateTime()
            })
        }
        await this.createMany(notification_param);
        return true;
    }
}
