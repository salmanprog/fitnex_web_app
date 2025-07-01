'use strict'
import Env from '@ioc:Adonis/Core/Env'
const fetch  = require('node-fetch');

export default class FCM
{
    /**
     *
     * @param device_tokens
     * @param device_type
     * @param title
     * @param message
     * @param badge
     * @param redirect_link
     * @param custom_data
     * @returns
     */
    public sendPush(
        device_tokens: Array<string>,
        device_type: string,
        title: string,
        message: string,
        badge: number  = 0,
        redirect_link: string | null = '',
        custom_data: object | null = {}
      )
    {
        if( device_type == 'ios' ){
            return this.sendIosPushNotification(device_tokens,device_type,title,message,badge,redirect_link,custom_data);
        } else {
          return this.sendAndroidPushNotification(device_tokens,device_type,title,message,badge,redirect_link,custom_data);
        }
    }

    /**
     *
     * @param device_tokens
     * @param device_type
     * @param title
     * @param message
     * @param badge
     * @param redirect_link
     * @param custom_data
     */
    private sendIosPushNotification(
        device_tokens: Array<string>,
        device_type: string,
        title: string,
        message: string,
        badge: number  = 0,
        redirect_link: string | null = '',
        custom_data: object | null = {}
    )
    {
        let notification_data = {
          registration_ids: device_tokens,
          notification: {
            title: title,
            text: message,
            body: message,
            sound: 'default',
            badge: badge,
            custom_data: custom_data,
            user_badge: badge,
          }
        }
        this.sendCurl(notification_data);
        return true;
    }

    /**
     *
     * @param device_tokens
     * @param device_type
     * @param title
     * @param message
     * @param badge
     * @param redirect_link
     * @param custom_data
     */
    private sendAndroidPushNotification(
        device_tokens: Array<string>,
        device_type: string,
        title: string,
        message: string,
        badge: number  = 0,
        redirect_link: string | null = '',
        custom_data: object | null = {}
    )
    {
        let notification_data = {
          registration_ids: device_tokens,
          notification: {
            title: title,
            body: message,
            sound: 'default',
            badge: badge,
            priority: 'high'
          },
          data: {
              message: {
                title: title,
                body: message,
                sound: 'default'
              },
              user_badge: badge,
              custom_data: custom_data,
              priority: 'high'
          }
        }
        this.sendCurl(notification_data);
        return true;
    }

    /**
     *
     * @param notification_data
     */
    private sendCurl(notification_data: object)
    {
        let headers = {
          'Authorization': 'Bearer ' + Env.get('NOTIFICATION_KEY'),
          'Content-Type': 'application/json',
          'charset': 'utf-8'
        }
        fetch(Env.get('NOTIFICATION_URL'),{
          method: 'post',
          body: JSON.stringify(notification_data),
          headers: headers
        })
        .then( (res) => {
          res.json().then( (resbody) => {
              //console.log('FCM Response',resbody);
          })
        })
        return true;
    }
}
module.exports = FCM
