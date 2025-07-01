/*
|--------------------------------------------------------------------------
| Api Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
*/
import Route from '@ioc:Adonis/Core/Route'

//guest routes
Route
  .group(() => {

    Route.post('generate-video-thumb','Api/GeneralController.generateVideoThumb').as('generate-video-thumb');

    Route.post('user/resend/code','Api/UsersController.resendCode').as('user.resent-code').middleware('apiAuth')
    Route.post('user/verify/code','Api/UsersController.verifyCode').as('user.verify-code').middleware('apiAuth')
    Route.post('user/social-login','Api/UsersController.socialLogin').as('user.social-login')
    Route.post('user/change-password','Api/UsersController.changePassword').as('user.change-password').middleware('apiAuth')
    Route.post('user/forgot-password','Api/UsersController.forgotPassword').as('user.forgot-password')
    Route.post('user/login','Api/UsersController.login').as('user.login');
    
    // Named as api.users.index, api.users.store
    Route.resource('user', 'Api/UsersController')
      .except(['destroy'])
      .middleware({
        index: ['apiAuth'],
        show: ['apiAuth'],
        update: ['apiAuth'],
      })
  })
  .prefix('api')
  .as('api')
  .middleware(['apiAuthorization'])

// authentication routes
Route
  .group(() => {

    //User
    Route.post('user/logout','Api/UsersController.userLogout').as('user.logout');

    //Job
    Route.resource('job', 'Api/JobController')
    
    // Media
    Route.resource('media', 'Api/MediaController').except(['update','destroy'])
    
    //Notifications
    Route.post('notification/test-notification','Api/NotificationController.sendTestNotification').as('test-notification');

    // Route.post('gateway/customer','Api/GatewayController.customer').as('gateway-customer');
    // Route.post('gateway/card','Api/GatewayController.customerCard').as('gateway-card');
    // Route.post('gateway/card/default','Api/GatewayController.makeDefaultCard').as('gateway-default-card');
    // Route.post('gateway/card/delete','Api/GatewayController.deleteGatewayCard').as('gateway-delete-card');
    // Route.post('gateway/charge','Api/GatewayController.gatewayCharge').as('gateway-charge');

  })
  .prefix('api')
  .as('api')
  .middleware(['apiAuthorization','apiAuth'])

