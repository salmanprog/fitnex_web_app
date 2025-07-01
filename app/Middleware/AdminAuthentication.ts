import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'

export default class AdminAuthentication
{
  public async handle({auth,response}: HttpContextContract, next: () => Promise<void>) {
    await auth.use('web').authenticate()
    //code for middleware goes here. ABOVE THE NEXT CALL
    if( ! await auth.use('web').check() ){
      response.redirect().withQs({ auth_token: Config.get('constants.ADMIN_LOGIN_TOKEN') }).toRoute('admin.login');
      return
    }
    await next()
  }
}
