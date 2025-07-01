import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import RestModel from './RestModel'
import _ from 'lodash'

export default class CmsModulePermission extends RestModel {

    public static table = 'cms_module_permissions'

    @column({ isPrimary: true })
    public id: number

    @column()
    public user_group_id: number

    @column()
    public user_id: number

    @column()
    public cms_module_id: number

    @column()
    public is_add: string

    @column()
    public is_view: string
    
    @column()
    public is_update: string

    @column()
    public is_delete: string

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
        return ['user_group_id', 'user_id', 'cms_module_id', 'is_add', 'is_view', 'is_update', 'is_delete', 'status', 'created_at',
        'updated_at', 'deleted_at']
    }
}
module.exports = CmsModulePermission;
