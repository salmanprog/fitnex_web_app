import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import RestModel from './RestModel'
import CmsModulePermission from './CmsModulePermission'
import _ from 'lodash'

export default class CmsModule extends RestModel {

    public static table = 'cms_modules'

    @column({ isPrimary: true })
    public id: number

    @column()
    public parent_id: number

    @column()
    public name: string

    @column()
    public route_name: string

    @column()
    public icon: string
    
    @column()
    public is_parent: string

    @column()
    public status: number

    @column()
    public sort_order: number

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    public static fillable()
    {
        return ['parent_id', 'name', 'route_name', 'icon', 'is_parent', 'status', 'sort_order', 'created_at',
        'updated_at', 'deleted_at']
    }

    public static async getCmsModules(role_slug = 'super-admin', module_permission = [], params = {})
    {
        
      
        let modules = [];
        let query = this.query();
        let records =  await this.query().where({status:true}).where('parent_id',0)
            records = _.isEmpty(records) ? [] : records;
            let role_modules =  await CmsModulePermission.query().where('user_group_id',params.user_group_id)
            role_modules = _.isEmpty(role_modules) ? [] : role_modules;
            
        if( role_slug != 'super-admin' ) {
          
      
          if( role_modules ){
            for (let m = 0; m < role_modules.length; m++) {
              // Find matching record based on cms_module_id
              const matchingRecord = records.find(record => record.id === role_modules[m].cms_module_id);
          
              if (matchingRecord) {
                let record = matchingRecord.toJSON();
                record.is_add = role_modules[m].is_add;
                record.is_view = role_modules[m].is_view;
                record.is_update = role_modules[m].is_update;
                record.is_delete = role_modules[m].is_delete;
          
                // Fetch child records
                let child_records = await this.query().where({'parent_id': record.id}).where({ status: true });
                child_records = _.isEmpty(child_records) ? [] : child_records;
                
                // Attach child records as submodules
                record.submodules = child_records;
          
                // Add the modified record to modules array
                modules.push(record);
              }
            }
            return modules;
            
          } else {
            
             return modules;
          }
        }else{
            for( var j=0; j < records.length; j++ ){
              if(records[j].is_parent == 1){
                let child_records =  await this.query().where({'parent_id':records[j].id}).where({status:true})
                child_records = _.isEmpty(child_records) ? [] : child_records;
                records[j].child_menu = child_records;
              }
            }
          return records;
        }
    }
}
module.exports = CmsModule;
