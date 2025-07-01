'use strict'

import Controller from '../Controller';
import Config from '@ioc:Adonis/Core/Config';
import { schema,rules } from '@ioc:Adonis/Core/Validator';
import { fileValidation } from 'App/Helpers/Index';
import FileUpload from 'App/Libraries/FileUpload/FileUpload';
import I18n from '@ioc:Adonis/Addons/I18n';
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User';
import _ from 'lodash';

export default class AdminController extends Controller
{
    protected __data: Array<string>;

    constructor(){
      super()
      this.__data = [];
    }

    public async profile({auth,request,response,session,view})
    {
        if( request.method() == 'POST' ){
            return await this._submitProfile(auth,request,response,session);
        }
        return await this.loadAdminView(view,'auth.profile',this.__data);
    }

    private async _submitProfile(auth:object,request:object,response:object,session:object)
    {
        let user:object, validationRules:object, params:object;
        //get session user
        user = auth.use('web').user
        //validation rules
        validationRules = schema.create({
            name: schema.string.optional({},[
              rules.minLength(2),
              rules.maxLength(20),
              rules.regex(/^[A-Za-z0-9\s]+$/)
            ]),
            email: schema.string.optional({},[
              rules.minLength(5),
              rules.maxLength(50),
              rules.email(),
              rules.unique({
                table: 'users',
                column: 'email',
                where: {
                  deleted_at: null
                },
                whereNot:{
                  slug: user.slug
                }
              })
            ]),
            mobile_no: schema.string({},[
                rules.minLength(10),
                rules.maxLength(15),
                rules.regex(/^(\+?\d{1,3}[-])\d{9,12}$/),
                rules.unique({
                  table: 'users',
                  column: 'mobile_no',
                  where: {
                    deleted_at: null
                  },
                  whereNot:{
                    slug: user.slug
                  }
                })
            ])
        })
        try{
          await request.validate({ schema: validationRules })
        } catch(error){
            let errors = this.setValidatorMessagesResponse(error.messages,'admin')
            session.flash({errors: errors })
            response.redirect('back')
            return;
        }
        //image validation
        if( !_.isEmpty(request.file('image_url')) ) {
            let fileValidate = fileValidation(request.file('image_url'),6000000);
            if ( fileValidate.error ) {
                session.flash({error: fileValidate.message })
                response.redirect('back')
                return;
            }
        }
        //update user data
        params = request.all();
        if( !_.isEmpty(request.file('image_url')) ){
          params.image_url = await FileUpload.doUpload(request.file('image_url'),'user');
        } else {
          params.image_url = params.old_file;
        }

        delete params._csrf;
        delete params.old_file;

        await User.updateUser(params,{id: user.id});
        session.flash({success: I18n.locale('en').formatMessage(`messages.success_update_message`) });
        return response.redirect().back();
    }

    public async changePassword({auth,request,response,session,view})
    {
        if( request.method() == 'POST' ){
            return await this._submitChangePassword(auth,request,response,session);
        }
        return await this.loadAdminView(view,'auth.change-password',this.__data);
    }

    private async _submitChangePassword(auth:object,request:object,response:object,session:object)
    {
        let user:object, validationRules:object, params:object;
        //get request payload
        params = request.all();
        //get login user
        user = auth.use('web').user
        //validation rules
        validationRules = schema.create({
            current_password: schema.string([
              rules.minLength(2),
              rules.maxLength(50),
            ]),
            new_password: schema.string([
              rules.minLength(8),
              rules.maxLength(50),
              rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/),
              rules.confirmed('confirm_password')
            ]),
            confirm_password: schema.string([
                rules.maxLength(50),
            ])
        })
        try{
          await request.validate({ schema: validationRules })
        } catch(error){
            let errors = this.setValidatorMessagesResponse(error.messages,'admin')
            session.flash({errors: errors })
            response.redirect('back')
            return;
        }
        //check current password
        if (! await Hash.verify(user.password, params.current_password)) {
            session.flash({errors: 'Current password is not valid' })
            response.redirect('back')
            return;
        }
        //update new password
        await User.updateUser({password: await Hash.make(params.new_password)},{id: user.id});
        session.flash({success: I18n.locale('en').formatMessage(`messages.success_update_message`) });
        return response.redirect().back();
    }

    public async logout({auth,response})
    {
        await auth.use('web').logout()
        response.redirect().withQs({ auth_token: Config.get('constants.ADMIN_LOGIN_TOKEN') }).toRoute('admin.login');
        return
    }
}
