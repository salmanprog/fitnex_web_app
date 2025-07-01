import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'
import { baseUrl, sendMail, currentDateTime } from 'App/Helpers/Index'
import { string } from '@ioc:Adonis/Core/Helpers'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'

export default class ResetPassword extends BaseModel
{
    public static table = 'reset_passwords'

    @column({ isPrimary: true })
    public id: number

    @column()
    public email: string

    @column()
    public token: string

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    public static async forgotPassword(record)
    {
        let resetPasswordToken = record.id + string.generateRandom(32);
        await Database.table('reset_passwords').insert({
            email: record.email,
            token: resetPasswordToken,
            created_at: currentDateTime()
        })
        //send reset password email
        let mail_params = {
            name: record.name,
            link: baseUrl() + 'user/reset-password/' + resetPasswordToken,
            app_name: Env.get('APP_NAME')
        }
        sendMail('emails/forgot-password',record.email,'Reset Password',mail_params)
    }

    public static async getResetPassReq(token)
    {
        let record = await this.query()
                            .select('u.*')
                            .innerJoin('users AS u','u.email','=','reset_passwords.email')
                            .where('reset_passwords.token',token)
                            .first();
        return record;
    }
}
