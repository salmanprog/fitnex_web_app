import Encryption from '@ioc:Adonis/Core/Encryption'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ResetPassword from 'App/Models/ResetPassword';
import UserApiToken from 'App/Models/UserApiToken';
import User from 'App/Models/User';
import { currentDateTime,currentUnixDateTime } from 'App/Helpers/Index';
import { DateTime } from 'luxon'
import _ from 'lodash';
import Controller from './Controller';

export default class ContentController extends Controller
{
    public async index({request,params, view, session,response})
    {
        return view.render('content');
    }   
}
