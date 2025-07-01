'use strict'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import I18n from '@ioc:Adonis/Addons/I18n'
import Controller from '../Controller';
import _ from 'lodash';

export default class CrudController extends Controller
{
    protected __model: object;
    protected __indexView: string;
    protected __createView: string;
    protected __editView: string;
    protected __detailView: string;
    protected __routeName: string;
    protected __success_listing_message: string;
    protected __success_store_message: string;
    protected __success_show_message: string;
    protected __success_update_message: string;
    protected __success_delete_message: string;
    protected __data: Array<string>;

    constructor(modal:string){
        super();
        this.__model      = this.loadModal(modal);
        this.__indexView  = '';
        this.__createView = '';
        this.__editView   = '';
        this.__detailView = '';
        this.__routeName  = '';
        this.__is_error   = false;
        this.__success_listing_message = 'success_listing_message';
        this.__success_store_message   = 'success_store_message';
        this.__success_show_message    = 'success_show_message';
        this.__success_update_message  = 'success_update_message';
        this.__success_delete_message  = 'success_delete_message';
        this.__data = [];
    }

    async index({request,response,view})
    {
        this.__request  = request;
        this.__response = response;

        if (_.isFunction(this.beforeRenderIndexView)) {
            let hookResponse = await this.beforeRenderIndexView();
            if(  this.__is_error ){
                return hookResponse;
            }
        }

        return await this.loadAdminView(view,this.__indexView,this.__data);
    }

    async ajaxListing(ctx: HttpContextContract)
    {
        let params      = ctx.request.all();
        let records     = {};
        let record_data = [];
        records.data    = [];
        //get records for datatable
        let dataTableRecord     = await this.__model.dataTableRecords(ctx.request);
        records.draw            = parseInt(params['draw']);
        records.recordsTotal    = _.isEmpty(dataTableRecord['total_record']) ? 0 : dataTableRecord['total_record'];
        records.recordsFiltered = _.isEmpty(dataTableRecord['total_record']) ? 0 : dataTableRecord['total_record'];
        // set data grid output
        if( dataTableRecord['records'].length > 0 ) {
            for( var i=0; i < dataTableRecord['records'].length; i++ ){
              if (_.isFunction(this.dataTableRecords)) {
                let datatable_data = await this.dataTableRecords(dataTableRecord['records'][i]);
                record_data.push(datatable_data);
              }
            }
            records.data = record_data
        }
        return ctx.response.json(records);
    }

    async create({request,response,view})
    {
        this.__request  = request;
        this.__response = response;

        if (_.isFunction(this.beforeRenderCreateView)) {
            let hookResponse = await this.beforeRenderCreateView();
            if(  this.__is_error ){
                return hookResponse;
            }
        }

        return await this.loadAdminView(view,this.__createView,this.__data);
    }

    async store({ request, response, session })
    {
        this.__request  = request;
        this.__response = response;
        //check validation
        if (_.isFunction(this.storeValidation)) {
           await this.storeValidation( (errors) => {
                session.flash({errors: errors })
                response.redirect('back')
                return;
            });

        }
        //load controller before hook
        if (_.isFunction(this.beforeStoreLoadModel)) {
            let hookResponse = await this.beforeStoreLoadModel();
            if(  this.__is_error ){
                return hookResponse;
            }
        }
        //create record
        let record = await this.__model.createRecord(request,request.only(this.__model.fillable()));
        //load controller after hook
        if (_.isFunction(this.afterStoreLoadModel)) {
            var afterHookResponse = await this.afterStoreLoadModel(record);
            if ( typeof afterHookResponse != 'undefined' ) {
              record = afterHookResponse;
            }
        }
        session.flash({success: I18n.locale('en').formatMessage(`messages.${this.__success_store_message}`) });
        response.redirect().toRoute( this.__routeName + '.index');
        return;
    }

    async edit({request,response,params,view,session})
    {
        this.__request  = request;
        this.__response = response;
        this.__params   = params;

        let record = await this.__model.getRecordBySlug(request, params.id);
        if( _.isEmpty(record) ){
           session.withErrors({error: Antl.formatMessage('messages.invalid_request')  }).flashAll()
           response.route( this.__routeName + '.index' );
        }
        if (_.isFunction(this.beforeRenderEditView)) {
            let hookResponse = await this.beforeRenderEditView(record);
            if(  this.__is_error ){
                return hookResponse;
            }
        }
        this.__data['record'] = record;
        return await this.loadAdminView(view,this.__editView,this.__data);
    }

    async update({params,request,response,session})
    {
        this.__request  = request;
        this.__response = response;
        //check validation
        if (_.isFunction(this.updateValidation)) {
            await this.updateValidation(params.id, (errors) => {
                session.flash({errors: errors })
                response.redirect('back')
                return;
            });
        }
        //load controller before hook
        if (_.isFunction(this.beforeUpdateLoadModel)) {
            let hookResponse = await this.beforeUpdateLoadModel();
            if(  this.__is_error ){
                return hookResponse;
            }
        }
        //create record
        let record = await this.__model.updateRecord(request,request.only(this.__model.fillable()), params.id);
        //load controller after hook
        if (_.isFunction(this.afterUpdateLoadModel)) {
            var afterHookResponse = await this.afterUpdateLoadModel(record);
            if ( typeof afterHookResponse != 'undefined' ) {
              record = afterHookResponse;
            }
        }
        session.flash({success: I18n.locale('en').formatMessage(`messages.${this.__success_update_message}`) });
        response.redirect().toRoute( this.__routeName + '.index');
        return;
    }

    async destroy({request,response,params})
    {
        this.__request  = request;
        this.__response = response;
        this.__params   = params;

        let body = request.all();
        //load controller before hook
        if (_.isFunction(this.beforeDeleteLoadModel)) {
            let hookResponse = await this.beforeDeleteLoadModel();
            if(  this.__is_error ){
                return hookResponse;
            }
        }
        await this.__model.deleteRecord(request, request.all(), params.id);
        let message = body.length > 1 ? I18n.locale('en').formatMessage(`messages.success_delete_messages`) : I18n.locale('en').formatMessage(`messages.success_delete_message`)
        return response.json({ message:message });
    }

    /**
     * Load Model
     * @param name
     * @returns {object} model instance
     */
    private loadModal(name: string) : object {
      return require(`App/Models/${name}`);
   }
}
module.exports = CrudController;
