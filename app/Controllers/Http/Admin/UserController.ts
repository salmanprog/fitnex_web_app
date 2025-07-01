'use strict'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import CrudController from './CrudController';
import { baseUrl } from 'App/Helpers/Index';
import moment from 'moment';

class UserController extends CrudController
{
    protected __request: object;
    protected __response: object;
    protected __params: object;

    constructor(){
        super('User')
        this.__data['page_title'] = 'Users Listing';
        this.__indexView  = 'user.index';
        this.__createView = 'user.add';
        this.__editView   = 'user.edit';
        this.__routeName    = 'admin.user';
        this.__request; //adonis request obj
        this.__response; //adonis response obj
        this.__params = {}; // this is used for get parameters from url
    }

    /**
     *
     * @returns
     */
    protected async storeValidation(cb)
    {
        let validationRules;
        validationRules = schema.create({
            status: schema.enum(['1','0']),
        })
        try{
          await this.__request.validate({ schema: validationRules })
        } catch(error){
            this.__is_error = true;
            let messages = this.setValidatorMessagesResponse(error.messages,'admin')
            cb(messages);
        }
        return true;
    }


    /**
     *
     * @returns
     */
    protected async updateValidation(slug:string, cb)
    {
        let validationRules;
        validationRules = schema.create({
            status: schema.enum(['1','0']),
        })
        try{
          await this.__request.validate({ schema: validationRules })
        } catch(error){
            this.__is_error = true;
            let messages = this.setValidatorMessagesResponse(error.messages,'admin')
            cb(messages);
        }
        return true;
    }

    /**
     *
     */
    protected async beforeIndexLoadModel()
    {

    }

    /**
     *
     */
    protected async afterIndexLoadModel(records:object)
    {

    }

    protected async dataTableRecords(record: object)
    {
        let options  = `<a href="${ baseUrl('/admin/user/'+record.slug + '/edit') }" title="edit" class="btn btn-sm btn-info"><i class="fa fa-edit"></i></a>`;
        return [
            record.name,
            record.email,
            record.mobile_no,
            record.is_email_verify == 1 ? '<span class="btn btn-xs btn-success">Verified</span>' : '<span class="btn btn-xs btn-danger">Not Verified</span>',
            record.status == 1 ? '<span class="btn btn-xs btn-success">Active</span>' : '<span class="btn btn-xs btn-danger">Disabled</span>',
            moment(record.created_at).format('MM-DD-YYYY hh:mm A'),
            options
        ];
    }

    /**
     *
     */
    protected async beforeStoreLoadModel()
    {

    }

    /**
     *
     */
    protected async afterStoreLoadModel()
    {

    }

    /**
     *
     */
    protected async beforeShowLoadModel()
    {

    }

    /**
     *
     */
    protected async afterShowLoadModel(record: object)
    {

    }

    /**
     *
     */
    protected async beforeUpdateLoadModel()
    {

    }

    /**
     *
     */
    protected async afterUpdateLoadModel()
    {

    }

    /**
     *
     */
    protected async beforeDestoryLoadModel()
    {

    }

    /**
     *
     */
    protected async afterDestoryLoadModel()
    {

    }

}
module.exports = UserController
