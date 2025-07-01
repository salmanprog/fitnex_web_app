'use strict'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { fileValidation } from 'App/Helpers/Index';
import Controller from '../Controller';
import ApplicationSetting from 'App/Models/ApplicationSetting';
import FileUpload from 'App/Libraries/FileUpload/FileUpload';
import { currentDateTime } from 'App/Helpers/Index'
import I18n from '@ioc:Adonis/Addons/I18n';
import _ from 'lodash';

class ApplicationSettingController extends Controller
{
    async setting({request,response,session,view})
    {
      if( request.method() == 'POST' ){
          return await this._submitSetting(request,response,session);
      }
      return await this.loadAdminView(view,'application-setting.index');
    }

    private async _submitSetting(request:object, response:object ,session:object)
    {
        let validationRules:object, params:object;
        //validation rules
        validationRules = schema.create({
            app_name: schema.string([
              rules.minLength(3),
              rules.maxLength(50),
            ]),
            meta_keyword: schema.string.optional({},[
              rules.minLength(5),
              rules.maxLength(1000),
            ]),
            meta_description: schema.string({},[
              rules.minLength(5),
              rules.maxLength(1000),
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
        if( !_.isEmpty(request.file('logo')) ) {
            let fileValidate = fileValidation(request.file('logo'),6000000);
            if ( fileValidate.error ) {
                session.flash({error: fileValidate.message })
                response.redirect('back')
                return;
            }
        }
        //favicon validation
        if( !_.isEmpty(request.file('favicon')) ) {
            let fileValidate = fileValidation(request.file('favicon'),6000000);
            if ( fileValidate.error ) {
                session.flash({error: fileValidate.message })
                response.redirect('back')
                return;
            }
        }
        //update user data
        params = request.all();
        //upload logo
        if( !_.isEmpty(request.file('logo')) ){
          params.logo = await FileUpload.doUpload(request.file('logo'),'application-setting');
        } else {
          params.logo = params.old_logo;
        }
        //upload favicon
        if( !_.isEmpty(request.file('favicon')) ){
          params.favicon = await FileUpload.doUpload(request.file('favicon'),'application-setting');
        } else {
          params.favicon = params.old_favicon;
        }
        delete params._csrf;
        delete params.old_logo;
        delete params.old_favicon;
        //delete old data
        await ApplicationSetting.query().where('identifier','application-setting').delete();
        //insert new data
        let ApplicationSettingData = [];
        for (const [key, value] of Object.entries(params)) {
            ApplicationSettingData.push({
              identifier: 'application-setting',
              meta_key: key,
              value: value,
              is_file: key == 'logo' || key == 'favicon' ? '1' : '0',
              created_at: currentDateTime(),
            });
        }
        await ApplicationSetting.createMany(ApplicationSettingData);

        session.flash({success: I18n.locale('en').formatMessage(`messages.success_update_message`) });
        return response.redirect().back();
    }
}
module.exports = ApplicationSettingController;
