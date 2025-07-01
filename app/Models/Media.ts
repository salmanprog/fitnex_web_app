import { column } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'

export default class Media extends RestModel
{
    public static table = 'media'

    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number | null

    @column()
    public slug: string

    @column()
    public module: string | null

    @column()
    public module_id: number | null

    @column()
    public filename: string

    @column()
    public original_name: string | null

    @column()
    public file_url: string

    @column()
    public file_url_blur: string | null

    @column()
    public thumbnail_url: string | null

    @column()
    public mime_type: string | null

    @column()
    public file_type: string | null

    @column()
    public driver: string | null

    @column()
    public media_type: string | null

    @column()
    public meta: string | null

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null


    public static fillable()
    {
        return [
          'slug','user_id','module','module_id','filename','original_name','file_url','file_url_blur','thumbnail_url','mime_type','file_type','driver','media_type','meta','created_at','updated_at','deleted_at'
        ]
    }

    public static async getMediaByType(module_id,module,file_type = null)
    {
        let query = this.query()
                    .select('*')
                    .whereNull("deleted_at");
        if(!_.isEmpty(file_type)){
            query.where('file_type',file_type)
        }                    
        query = await query.where('module',module).where('module_id',module_id);
        return query;
    }

    public static async getById(id)
    {
        let query = this.query()
                    .select('*')
                    .whereNull("deleted_at");
        query = await query.where('id',id).first();
        return query.toJSON();
    }
}
module.exports = Media;
