import { column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import _ from 'lodash';
import RestModel from './RestModel'
import { currentDateTime } from 'App/Helpers/Index';


export default class UserGroup extends RestModel
{
    public static table = 'user_groups'

    @column({ isPrimary: true })
    public id: number

    @column()
    public slug: string

    @column()
    public title: string

    @column()
    public description: string

    @column()
    public type: string

    @column()
    public is_super_admin: string

    @column()
    public status: number

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    
    public static async getById(id)
    {
        let query = this.query()
                        .select('*')
                        .where('id',id)
                        .first()
        return query;
    }
    
}
module.exports = UserGroup;
