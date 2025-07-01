/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
*/
import Route from '@ioc:Adonis/Core/Route'

// Route.get('/', async ({view}) => {
//   return view.render('welcome')
// })
Route.get('encrypt-data', async ({view}) => {
  return view.render('encrypt-data');
})
Route.get('user/verify/:email','UsersController.verifyEmail').as('verifyEmail');
Route.route('user/reset-password/:resetpasstoken',['GET','POST'],'UsersController.resetPassword');
Route.get('media_read/:name', 'Api/MediaController.readMedia').as('mediaread.readMedia')
//reactjs
Route.on("/:module?/:action?/:slug?").render("index");
