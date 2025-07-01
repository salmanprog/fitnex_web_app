import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminRedirectIfAuthentication {

  public async handle({auth,response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if(  await auth.use('web').check() ){
      response.redirect().toRoute('admin.dashboard');
      return
    }
    await next()
  }
}
