import Encryption from '@ioc:Adonis/Core/Encryption'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ResetPassword from 'App/Models/ResetPassword';
import UserApiToken from 'App/Models/UserApiToken';
import User from 'App/Models/User';
import { currentDateTime,currentUnixDateTime } from 'App/Helpers/Index';
import { DateTime } from 'luxon'
import _ from 'lodash';
import Controller from './Controller';

export default class UsersController extends Controller
{
    public async verifyEmail({ response,params,session })
    {
        let email;
        try{
          email = Encryption.decrypt(params.email)
        } catch(error){
            return 'Invalid signature';
        }
        let data = {
          is_email_verify:'1',
          email_verify_at: currentDateTime()
        }
        await User.updateUser(data,{email:email})
        session.flash('success', 'Your email has been verified successfully')
        return response.redirect('/');
    }

    public async resetPassword({request,params, view, session,response})
    {
        let resetPasswordToken = params.resetpasstoken;
        let getResetPassReq    = await ResetPassword.getResetPassReq(resetPasswordToken);
        //check reset password link
        if( _.isEmpty(getResetPassReq) ){
            session.flash({ error: 'Reset password link has been expired or used' })
            response.redirect('/');
            return;
        }
        let expiry_link_date = DateTime.fromISO(getResetPassReq.created_at).plus({hours:1}).toUnixInteger();
        // //check expiry
        if( expiry_link_date > currentUnixDateTime() ){
          session.flash({ error: 'Reset password link has been expired' })
          response.redirect('/');
          return;
        }
        //delete all api token
        await UserApiToken.deleteApiToken(getResetPassReq.id);

        if( request.method() == 'POST' )
          return this._submitResetPassword(request,response,session,getResetPassReq);

        return view.render('reset-password');
    }

    private async _submitResetPassword(request:object,response:object,session:object,getResetPassReq:object)
    {
        const validationRules = schema.create({
          new_password: schema.string({},[
              rules.minLength(8),
              rules.maxLength(100),
              rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/)
          ]),
          confirm_password: schema.string({},[
            rules.confirmed('new_password')
          ]),
        })
        try{
            await request.validate({ schema: validationRules })
        } catch(error){
            let error_messges = this.setValidatorMessagesResponse(error.messages,'web');
            session.flash({errors:error_messges})
            return response.redirect('back')
        }
        let body_params   = request.all();
        body_params.email = getResetPassReq.email;
        await User.updateResetPassword(body_params);
        session.flash({ success: 'Password has been updated successfully.'})
        return response.redirect('/');
    }
}
