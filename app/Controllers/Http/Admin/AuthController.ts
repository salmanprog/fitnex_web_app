import { schema,rules } from '@ioc:Adonis/Core/Validator'
import Config from '@ioc:Adonis/Core/Config'
import { sendMail } from 'App/Helpers/Index'
import Hash from '@ioc:Adonis/Core/Hash'
import Controller from '../Controller';
import User from 'App/Models/User';
import Encryption from '@ioc:Adonis/Core/Encryption'
import Env from '@ioc:Adonis/Core/Env'
import _ from 'lodash';

export default class AuthController extends Controller
{
    public async login({request,response,session,auth,view})
    {
        let params = request.all();
        console.log('check==========>>',params)
        if( params.auth_token != Config.get('constants.ADMIN_LOGIN_TOKEN') ){
            response.redirect('/');
            return;
        }
        if( request.method() == 'POST' )
          return this._submitLogin(request,response,session,auth)

        return await this.loadAdminView(view,'auth.login');
    }

    private async _submitLogin(request: object,response:object,session:object,auth:object)
    {
        let validator;
        let validationRules;
        validationRules = schema.create({
            email: schema.string({},[
                rules.email(),
                rules.maxLength(100),
            ]),
            password: schema.string({},[
                rules.maxLength(10),
            ])
        })
        try{
          validator = await request.validate({ schema: validationRules })
        } catch(error){
           let error_messges = this.setValidatorMessagesResponse(error.messages,'web');
           session.flash({errors:error_messges})
           return response.redirect().withQs().back()
        }
        let params = request.all();
        let user   = await User.adminAuth(params.email);

        if( _.isEmpty(user) ){
            session.flash({errors:'Invalid credentials'})
            return response.redirect().withQs().back();
        }
        if (! await Hash.verify(user.password, params.password)) {
            session.flash({errors:'Invalid credentials'})
            return response.redirect().withQs().back();
        }
        if( user.status == 0 ){
            session.flash({errors:'Your account has been disabled by the administrator'})
            return response.redirect().withQs().back();
        }
        await auth.use('web').loginViaId(user.id)
        response.redirect().toRoute('admin.dashboard')
        return;
    }

    public async forgotPassword({request,response,session,view})
    {
        if( request.method() == 'POST' )
          return this._submitForgotPassword(request,response,session)

        return await this.loadAdminView(view,'auth.forgot-password');
    }

    private async _submitForgotPassword(request:object,response:object,session:object)
    {
        let validator;
        let validationRules;
        validationRules = schema.create({
            email: schema.string({},[
                rules.email(),
                rules.maxLength(100),
            ])
        })
        try{
          validator = await request.validate({ schema: validationRules })
        } catch(error){
          let error_messges = this.setValidatorMessagesResponse(error.messages,'web');
          session.flash({errors:error_messges})
          return response.redirect().withQs().back()
        }
        let params = request.all();
        let user   = await User.adminAuth(params.email);
        if( _.isEmpty(user) ){
            session.flash({errors:'Invalid Email'})
            return response.redirect().withQs().back();
        }
        //send email
        let email_params = {
          name: user.name,
          app_name: Env.get('APP_NAME'),
          link: Env.get('APP_URL') + '/admin/reset-pass/' + Encryption.encrypt(user.email)
        }
        try{
          if( Env.get('MAIL_SANDBOX') == 0 )
            sendMail('emails/forgot-password',user.email,`Reset Password`,email_params);
        } catch ( error ){
            console.log(error);
        }

        session.flash({success:'Reset password link has been sent to your email address'})
        response.redirect().withQs({ auth_token: Config.get('constants.ADMIN_LOGIN_TOKEN') }).toRoute('admin.login');
        return;
    }

    public async resetPassword({request,response,session,view,params})
    {
        if( request.method() == 'POST' )
          return this._submitResetPassword(request,response,session,params)

        return await this.loadAdminView(view,'auth.reset-password');
    }

    private async _submitResetPassword(request:object,response:object,session:object,params:object)
    {
        let validator;
        let validationRules;
        validationRules = schema.create({
            new_password: schema.string({},[
                rules.minLength(8),
                rules.maxLength(100),
                rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/)
            ]),
            confirm_password: schema.string({},[
                rules.confirmed('new_password')
            ])
        })
        try{
          validator = await request.validate({ schema: validationRules })
        } catch(error){
           let error_messges = this.setValidatorMessagesResponse(error.messages,'web');
           session.flash({errors:error_messges})
           return response.redirect().withQs().back()
        }
        let newPassword = await Hash.make(request.input('new_password'))
        await User.updateUser({password:newPassword},{email:Encryption.decrypt(params.email)});

        session.flash({success:'Password has been updated successfully'})
        response.redirect().withQs({ auth_token: Config.get('constants.ADMIN_LOGIN_TOKEN') }).toRoute('admin.login');
        return;
    }
}
