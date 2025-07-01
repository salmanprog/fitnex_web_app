import { column,hasOne,HasOne,belongsTo,BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { string } from '@ioc:Adonis/Core/Helpers'
import Database from '@ioc:Adonis/Lucid/Database'
import Config from '@ioc:Adonis/Core/Config'
import Hash from '@ioc:Adonis/Core/Hash'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import jwt from 'jsonwebtoken'
import RestModel from './RestModel'
import UserApiToken from 'App/Models/UserApiToken'
import Gender from 'App/Models/Gender'
import Sex from 'App/Models/Sex'
import SexOrientation from 'App/Models/SexOrientation'

enum UserType{
  'admin',
  'user',
}
export default class User extends RestModel
{
    public static table = 'users'

    @column({ isPrimary: true })
    public id: number

    @column()
    public user_group_id: number

    @column()
    public user_type: UserType

    @column()
    public name: string

    @column()
    public username: string

    @column()
    public nick_name: string

    @column()
    public slug: string

    @column()
    public email: string

    @column()
    public dob: string | null

    @column()
    public age: number

    @column({ serializeAs: null })
    public password: string

    @column()
    public image_url: string | null

    @column()
    public gender: number

    @column()
    public sex: number

    @column()
    public sex_orientation: number

    @column()
    public status: number

    @column()
    public is_email_verify: number

    @column()
    public email_verify_at: DateTime | null

    @column()
    public email_otp: string | null

    @column()
    public email_otp_created_at: DateTime | null

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    @column()
    public device_type: string | null

    @column()
    public device_token: string | null

    @column()
    public platform_type: string | null

    @column()
    public platform_id: string | null

    @hasOne(() => UserApiToken, {
      foreignKey: 'user_id',
      localKey: 'id'
    })
    public userApiToken: HasOne<typeof UserApiToken>

    @belongsTo(() => Gender,{
        foreignKey:'gender'
    })
    public Gender: BelongsTo<typeof Gender>

    @belongsTo(() => Sex,{
        foreignKey:'sex'
    })
    public Sex: BelongsTo<typeof Sex>

    @belongsTo(() => SexOrientation,{
        foreignKey:'sex_orientation'
    })
    public SexOrientation: BelongsTo<typeof SexOrientation>

    public static fillable()
    {
        return [
          'user_group_id','user_type','name','nick_name','username','slug','email','dob','age','password','image_url',
          'gender','sex','sex_orientation','is_email_verify','email_verify_at','status','platform_type','platform_id',
          'email_otp','email_otp_created_at','created_at','updated_at','deleted_at'
        ]
    }

    public static async adminAuth(email:string)
    {
        let record = await this.query()
                              .where('email',email)
                              .where('user_type','admin')
                              .first();
        return record;
    }

    public static generateApiToken(email:string)
    {
        let jwt_options = {
            algorithm: 'HS256',
            expiresIn:Config.get('constants.JWT_EXPIRY'),
            issuer: Config.get('constants.CLIENT_ID'),
            subject: Config.get('constants.CLIENT_ID'),
            jwtid: email
        }
        var token = jwt.sign({ email:email }, Config.get('constants.JWT_SECRET'), jwt_options);
        return token;
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async getUserByEmail(email:string)
    {
        let record = await this.query().preload('Gender').preload('Sex').preload('SexOrientation').where('email',email).whereNull('deleted_at').first();
        return record;
    }

    public static async updateUser(data,condition)
    {
      await this.query().where(condition).update(data);
      return true
    }

    public static async updateResetPassword(params)
    {
        let new_password = await Hash.make(params.new_password)
        await Database.query().from('users').where('email',params.email).update({
            password: new_password
        })
        await Database.query().from('reset_passwords').where('email',params.email).delete();
        return true;
    }

    public static async getUserByApiToken(api_token)
    {
        let query = this.query()
                        .select('users.*','uat.device_type','uat.device_token','uat.platform_type')
                        .innerJoin('user_api_tokens AS uat','uat.user_id','=','users.id')
                        .where('api_token',api_token)
                        .first()
        return query;
    }

    public static async socialLogin(request)
    {
        let record;
        let api_token;
        let params = request.all();
        if( !_.isEmpty(params.email) ){
            record = await this.getUserByEmail(params.email);
        }
        if( _.isEmpty(record) ){
            record = await this.getSocialUser(params.platform_id,params.platform_type)
        }
        if( _.isEmpty(record) )
        {
            let password = string.generateRandom(32);
            let username = await this.generateSlug(strSlug(params.name));
            record = await this.create({
                    name: params.name,
                    user_group_id: 2,
                    user_type: 'user',
                    email: params.email,
                    image_url: _.isEmpty(params.image_url) ? null : params.image_url,
                    password:await Hash.make(password),
                    username: username,
                    slug: username,
                    platform_type: params.platform_type,
                    platform_id: params.platform_id,
                    is_email_verify:true,
                    email_verify_at: currentDateTime(),
                    created_at: currentDateTime()
            });

        }
        api_token = await UserApiToken.createApiToken(request,record.id);
        record.userApiToken = api_token;
        return record;
    }

    public static async getSocialUser(platform_id,platform_type)
    {
        let record = await this.query()
                        .from('user_api_tokens AS uat')
                        .select('u.*','uat.api_token')
                        .innerJoin('users AS u','u.id','=','uat.user_id')
                        .where('uat.platform_id',platform_id)
                        .where('uat.platform_type',platform_type)
                        .first()
        return record;
    }

    public static async removeDeviceToken(request)
    {
        let params = request.all();
        let user   = request.user();
        await UserApiToken.query()
                          .where('user_id',user.id)
                          .where('device_type',params.device_type)
                          .where('device_token',params.device_token)
                          .delete();
        return true;
    }

    public static async getTargetUsersByID(user_id)
    {
        let query = await this.query()
                            .join('user_api_tokens AS uat','uat.user_id','=','users.id')
                            .select('users.*','uat.device_token','uat.device_type')
                            .where('users.id',user_id)
                            .where('users.status','1');
        return query;
    }
}
module.exports = User;
