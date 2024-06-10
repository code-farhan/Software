'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Auth
Route.post('/auth/register', 'AuthController.register')
Route.post('/auth/login', 'AuthController.login')

Route.get('/filter/location', 'FilterController.location').middleware('auth')
Route.post('/filter/subsidiary', 'FilterController.subsidiary').middleware('auth')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON by Victor' }
})
