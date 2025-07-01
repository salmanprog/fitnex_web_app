import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import RestModel from './RestModel'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'

export default class Content extends RestModel {

  public static table = 'content_managements'

    @column({ isPrimary: true })
    public id: number

    @column()
    public title: string

    @column()
    public slug: string

    @column()
    public content: string

    @column()
    public api_url: string | null

    @column()
    public status: number

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    public static fillable()
    {
        return ['title','slug','content','api_url','status','created_at','updated_at','deleted_at']
    }


    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }
}
module.exports = Content;
