'use strict'

import Controller from '../Controller';

export default class DashboardController extends Controller
{
    async index({view})
    {
        return await this.loadAdminView(view,'dashboard.index');
    }

}
