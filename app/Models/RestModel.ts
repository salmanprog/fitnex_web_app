import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
import Config from '@ioc:Adonis/Core/Config'
import _ from 'lodash';

export default class RestModels extends BaseModel
{
    protected static __softDelete = true;

    public static async createRecord(request:object,params:object)
    {
        //before create hook
        if (_.isFunction(this.loadHook(request).beforeCreateHook)) {
            await this.loadHook(request).beforeCreateHook(request, params);
        }
        //insert record
        var record = await this.create(params);
        //after create hook
        if (_.isFunction(this.loadHook(request).afterCreateHook)) {
            await this.loadHook(request).afterCreateHook(record, request, params);
        }
        //get record by id
        var record = await this.getRecordBySlug(request, record.slug);

        return record;
    }

    public static async getRecords(request:object, params:object = {})
    {
        let query = this.query()
                        .select()
                        .whereNull("deleted_at");
        //query hook
        if (_.isFunction(this.loadHook(request).indexQueryHook)) {
            await this.loadHook(request).indexQueryHook(query, request, params);
        }
        let record_limit = _.isEmpty(params.limit) ? Config.get("constants.PAGINATION_LIMIT") : parseInt(params.limit);
        query = await query.paginate(_.isEmpty(params.page) ? 1 : params.page, record_limit);
        return query.toJSON();
    }

    public static async getRecordBySlug(request:object, slug:string)
    {
        let record;
        let query = this.query()
                        .select()
                        .whereNull("deleted_at");
        //query hook
        if (_.isFunction(this.loadHook(request).indexQueryHook)) {
            await this.loadHook(request).indexQueryHook(query, request, slug);
        }
        //get record
        record = await query.where("slug", slug).first();
        if( !_.isEmpty(record) ){
            record = record.toJSON();
        } else{
            record = {};
        }
        return record;
    }

    public static async updateRecord(request:object, params:object, slug:string)
    {
        let record;
        //before update hook
        if (_.isFunction(this.loadHook(request).beforeEditHook)) {
            await this.loadHook(request).beforeEditHook(request, params, slug);
        }
        //update record
        if (!_.isEmpty(params) ) {
            record = await this.query().where("slug", slug).update(params);
        }
        //After  update hook
        if (_.isFunction(this.loadHook(request).afterEditHook)) {
            await this.loadHook(request).afterEditHook(record,request, params);
        }

        record = await this.getRecordBySlug(request, slug);
        return record;
    }

    public static async deleteRecord(request:object, params:object, slug:string)
    {
        let slug_arr = [];
        if( slug == 'delete-record' ){
          slug_arr = params.slug
        } else {
          slug_arr.push(slug);
        }
        //before delete hook
        if (_.isFunction(this.loadHook(request).beforeDeleteHook)) {
            await this.loadHook(request).beforeDeleteHook(request, params, slug_arr);
        }
        //check soft delete
        if ( this.__softDelete ) {
          await this.query()
                    .whereIn("slug", slug_arr)
                    .update({ deleted_at: new Date()});
        } else {
            await this.query().whereIn("slug", slug_arr).delete();
        }
        //after delete hook
        if (_.isFunction(this.loadHook(request).afterDeleteHook)) {
            await this.loadHook(request).afterDeleteHook(request, params, slug_arr);
        }
        return true;
    }

    public static async dataTableRecords(request:object)
    {
      let data   = [];
      let params = request.all();
      let query  = this.query()
                    .select('*')
                    .whereNull(this.table + ".deleted_at");

      if(_.isFunction(this.loadHook(request).datatable_query_hook))
          await this.loadHook(request).datatable_query_hook(query,request);

      let total_record = query;
      query = await query.limit(parseInt(params['length'])).offset(parseInt(params['start'])).orderBy(this.table + '.id','desc');
      data['records'] = !_.isEmpty(query) ? query : [];
      data['total_record'] = await total_record.getCount();
      return data;
    }

    private static loadHook(request)
    {
        let hookName = this.prototype.constructor.name + 'Hook';
        let url = request.url();
        if( url.includes('api') ){
          return require(`App/Models/Hooks/Api/${hookName}`);
        } else {
          return require(`App/Models/Hooks/Admin/${hookName}`);
        }
    }
}
