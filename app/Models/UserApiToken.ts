import { column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import _ from 'lodash';
import UserModel from './User';
import RestModel from './RestModel'
import { currentDateTime } from 'App/Helpers/Index';
enum DeviceType{
  'web',
  'ios',
  'android'
}
class UserApiToken extends RestModel
{
    public static table = 'user_api_tokens'

    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number

    @column()
    public api_token: string

    @column()
    public device_type: DeviceType

    @column()
    public device_token: string

    @column()
    public platform_type: string

    @column()
    public platform_id: string

    @column()
    public ip_address: string

    @column()
    public user_agent: string

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    public static async createApiToken(request,user_id)
    {
        let request_params = request.all();
        let api_token = UserModel.generateApiToken(request_params.email);
        let record = await this.create({
          user_id: user_id,
          api_token: api_token,
          device_type: request_params.device_type,
          device_token: request_params.device_token,
          platform_type: _.isEmpty(request_params.platform_type) ? 'custom' : request_params.platform_type,
          platform_id: _.isEmpty(request_params.platform_id) ? null : request_params.platform_id,
          ip_address: request.ip(),
          user_agent: request.header('User-Agent'),
          created_at: currentDateTime()
        });
        return record;
    }

    public static async deleteApiToken(user_id)
    {
        await this.query().where('user_id',user_id).delete();
        return true;
    }

    public static async deleteApiTokenExceptCurrentToken(user_id,api_token)
    {
        await this.query().where('user_id',user_id)
                  .where('api_token','<>',api_token).delete();
        return true;
    }
}
module.exports = UserApiToken;
export default UserApiToken;
