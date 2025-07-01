'use strict'
import Env from '@ioc:Adonis/Core/Env'
const fetch  = require('node-fetch');

export default class OneSignal
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
    sendPush(
          device_tokens: Array<string>,
          device_type: string,
          title: string,
          message: string,
          badge: number  = 0,
          redirect_link: string | null = '',
          custom_data: object | null = {}
        )
    {
        let language = 'en';
        let params = {
            app_id: Env.get('NOTIFICATION_APP_ID'),
            include_player_ids: device_tokens,
            channel_for_external_user_ids: 'push',
            data:{
                title: title,
                message: message,
                badge: badge,
                custom_data: custom_data
            },
            headings: { [language]: title },
            contents: { [language]: message },
            isIos: device_type == 'ios' ? true : false,
            ios_badgeType: 'Increase',
            ios_badgeCount: badge,
        }
        if( device_type == 'web' )
          params.url = redirect_link

        let headers = {
          'Content-Type':'application/json',
          'charset':'utf-8',
          'Authorization': 'Basic ' + Env.get('NOTIFICATION_KEY')
        }
        fetch(Env.get('NOTIFICATION_URL'),{
                method: 'post',
                body: JSON.stringify(params),
                headers: headers
              }).then( (res) => {
                  res.json().then( (resbody) => {
                      //console.log('OneSignal Response',resbody);
                  })
              });
        return true;
    }
}
module.exports = OneSignal;
