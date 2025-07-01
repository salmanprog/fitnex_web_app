'use strict'
import Env from '@ioc:Adonis/Core/Env'

export default class Index
{
    /**
     *
     * @param {array} $device_tokens
     * @param {string} $device_type | ios, android, web
     * @param {string} $title
     * @param {string} $message
     * @param {int} $badge
     * @param {string} $redirect_link
     * @param {object} $custom_data
     */
    public static notification(
      device_tokens: Array<string>,
      device_type: string,
      title: string,
      message: string,
      badge: number  = 0,
      redirect_link: string | null = '',
      custom_data: object | null = {}
    )
    {
      let driver   = Env.get('NOTIFICATION_DRIVER');
      let instance =  require(`App/Libraries/PushNotification/${driver}.ts`);
          instance = new instance;

      return instance.sendPush(device_tokens,device_type,title,message,badge,redirect_link,custom_data);
    }
}
