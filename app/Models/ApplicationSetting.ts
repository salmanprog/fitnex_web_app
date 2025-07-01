import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'
import {baseUrl} from 'App/Helpers/Index'
import { DateTime } from 'luxon'
import _ from 'lodash';

export default class ApplicationSetting extends BaseModel {

    public static table = 'application_settings'

    @column({ isPrimary: true })
    public id: number

    @column()
    public identifier: string

    @column()
    public meta_key: string

    @column()
    public value: string

    @column()
    public is_file: number

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    public static async getSetting(identifier:string)
    {
        let setting: object;
        let settings = await this.query().where('identifier',identifier);
        if( _.isEmpty(settings) ){
          setting = {
            'app_name': Env.get('APP_NAME'),
            'meta_keyword': null,
            'meta_description': null,
            'logo': baseUrl() + '/images/logo.png',
            'favicon': baseUrl() + '/images/logo.png',
          };
        } else {
           setting = {};
           for( var i=0; i < settings.length; i++ ){
              setting[settings[i].meta_key] = settings[i].value;
           }
        }
        return setting;
    }
}
