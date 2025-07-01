import { column,hasOne,HasOne,belongsTo,BelongsTo,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { string } from '@ioc:Adonis/Core/Helpers'
import Database from '@ioc:Adonis/Lucid/Database'
import Config from '@ioc:Adonis/Core/Config'
//import Hash from '@ioc:Adonis/Core/Hash'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import jwt from 'jsonwebtoken'
import RestModel from './RestModel'
import UserApiToken from 'App/Models/UserApiToken'
import Job from 'App/Models/Job'
import JobAssignee from 'App/Models/JobAssignee'
import Order from 'App/Models/Order'
import ProductCategory from 'App/Models/ProductCategory'
import Services from 'App/Models/Services'
import UserSelectedServices from 'App/Models/UserSelectedServices'
import BuildingType from 'App/Models/BuildingType'
import moment from 'moment';
const passwordHash = require('password-hash')

enum UserType{
  'admin',
  'user',
}
export default class User extends RestModel
{
    public static table = 'users'

    @column({ isPrimary: true })
    public id: number

    @column()
    public user_group_id: number

    @column()
    public parent_id: number

    @column()
    public created_by: number

    @column()
    public user_type: UserType

    @column()
    public name: string

    @column()
    public username: string

    @column()
    public nick_name: string

    @column()
    public slug: string

    @column()
    public email: string

    @column()
    public mobile_number: string

    @column()
    public dob: string | null

    @column()
    public age: number

    @column({ serializeAs: null })
    public password: string

    @column()
    public image_url: string | null

    @column()
    public company_name: string | null

    @column()
    public company_address: string | null

    @column()
    public company_mobile_number: string | null

    @column()
    public company_email_address: string | null

    @column()
    public building_type_id: number

    @column()
    public user_link: string | null

    @column()
    public is_link: number
    
    @column()
    public gender: string

    @column()
    public profile_type: string

    @column()
    public user_status: number

    @column()
    public status: number

    @column()
    public total_no_user: number

    @column()
    public total_no_request: number

    @column()
    public is_email_verify: number

    @column()
    public email_verify_at: DateTime | null

    @column()
    public email_otp: string | null

    @column()
    public email_otp_created_at: DateTime | null

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    @column()
    public device_type: string | null

    @column()
    public device_token: string | null

    @column()
    public platform_type: string | null

    @column()
    public platform_id: string | null

    @hasOne(() => UserApiToken, {
      foreignKey: 'user_id',
      localKey: 'id'
    })
    public userApiToken: HasOne<typeof UserApiToken>

    @hasOne(() => BuildingType, {
        foreignKey: 'id',
        localKey: 'building_type_id'
      })
      public BuildingType: HasOne<typeof BuildingType>

    @hasMany(() => UserSelectedServices, {
        foreignKey: 'user_id',
        localKey: 'id'
      })
      public SelectedServices: HasMany<typeof UserSelectedServices>


    public static fillable()
    {
        return [
          'user_group_id','created_by','parent_id','user_type','name','nick_name','username','slug','email','mobile_number','dob','age','password','image_url','company_name','company_address','company_mobile_number','company_email_address','building_type_id','user_link','is_link',
          'gender','profile_type','total_no_user','total_no_request','is_email_verify','email_verify_at','user_status','status','platform_type','platform_id',
          'email_otp','email_otp_created_at','created_at','updated_at','deleted_at'
        ]
    }

    public static async adminAuth(email:string)
    {
        let record = await this.query()
                              .where('email',email)
                              .where('user_type','admin')
                              .first();
        return record;
    }

    public static async getUserById(id:number)
    {
        let record = await this.query()
                              .where('id',id)
                              .where('user_type','user')
                              .first();
        return record;
    }

    public static async getUserByLinkToken(user_link:string)
    {
        let record = await this.query()
                              .where('user_link',user_link)
                              .where('user_type','user')
                              .first();
        return record;
    }

    public static async getUserLists()
    {
        let record = await this.query()
                              .whereNotNull('user_link')
                              .where('is_link','1')
                              .where('status','0')
                              .where('user_type','user')
                              .whereNull('deleted_at')
        return record;
    }

    public static async getUser(email:string)
    {
        let record = await this.query()
                              .where('email',email)
                              .where('user_type','user')
                              .first();
        return record;
    }

    public static async getUserNumber(mobile_number:string)
    {
        let record = await this.query()
                              .where('mobile_number',mobile_number)
                              .where('user_type','user')
                              .first();
        return record;
    }

    public static generateApiToken(email:string)
    {
        let jwt_options = {
            algorithm: 'HS256',
            expiresIn:Config.get('constants.JWT_EXPIRY'),
            issuer: Config.get('constants.CLIENT_ID'),
            subject: Config.get('constants.CLIENT_ID'),
            jwtid: email
        }
        var token = jwt.sign({ email:email }, Config.get('constants.JWT_SECRET'), jwt_options);
        return token;
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async getUserByEmail(email:string)
    {
        let record = await this.query().where('email',email).whereNull('deleted_at').first();
        return record;
    }

    public static async getUserByIds(ids:Array,user_group_id:number)
    {
        let record = await this.query().whereIn('id',ids).where('user_group_id',user_group_id).whereNull('deleted_at');
        return record;
    }

    public static async getAdminByEmail(email:string)
    {
        let record = await this.query().where('email',email).whereNull('deleted_at').first();
        return record;
    }

    public static async updateUser(data,condition)
    {
      await this.query().where(condition).update(data);
      return true
    }

    public static async updateResetPassword(params)
    {
        //let new_password = await Hash.make(params.new_password)
        let new_password = await passwordHash.generate(params.new_password)
        await Database.query().from('users').where('email',params.email).update({
            password: new_password
        })
        await Database.query().from('reset_passwords').where('email',params.email).delete();
        return true;
    }

    public static async getUserByApiToken(api_token)
    {
        let query = this.query()
                        .select('users.*','uat.device_type','uat.device_token','uat.platform_type')
                        .innerJoin('user_api_tokens AS uat','uat.user_id','=','users.id')
                        .where('api_token',api_token)
                        .first()
        return query;
    }

    public static async socialLogin(request)
    {
        let record;
        let api_token;
        let params = request.all();
        if( !_.isEmpty(params.email) ){
            record = await this.getUserByEmail(params.email);
        }
        if( _.isEmpty(record) ){
            record = await this.getSocialUser(params.platform_id,params.platform_type)
        }
        if( _.isEmpty(record) )
        {
            let password = string.generateRandom(32);
            let username = await this.generateSlug(strSlug(params.name));
            record = await this.create({
                    name: params.name,
                    user_group_id: 2,
                    user_type: 'user',
                    email: params.email,
                    image_url: _.isEmpty(params.image_url) ? null : params.image_url,
                    password: await passwordHash.generate(password),
                    username: username,
                    slug: username,
                    platform_type: params.platform_type,
                    platform_id: params.platform_id,
                    is_email_verify:true,
                    email_verify_at: currentDateTime(),
                    created_at: currentDateTime()
            });

        }
        api_token = await UserApiToken.createApiToken(request,record.id);
        record.userApiToken = api_token;
        return record;
    }

    public static async gernateUser(request)
    {
        let record;
        let api_token;
        let params = request.all();
        let password = string.generateRandom(32);
        let username = await this.generateSlug(strSlug('user_'+password));
        record = await this.create({
                name: params.name,
                user_group_id: params.user_group_id,
                user_type: 'user',
                email: params.email,
                created_by: params.created_by,
                parent_id: params.parent_id,
                image_url: _.isEmpty(params.image_url) ? null : params.image_url,
                password: await passwordHash.generate(password),
                username: username,
                slug: username,
                platform_type: 'google',
                platform_id: 'HFJHSJ4458KFJDH1101',
                is_email_verify:true,
                email_verify_at: currentDateTime(),
                status:'0',
                created_at: currentDateTime()
        });
        api_token = await UserApiToken.createApiToken(request,record.id);
        record.userApiToken = api_token;
        return record;
    }

    public static async getSocialUser(platform_id,platform_type)
    {
        let record = await this.query()
                        .from('user_api_tokens AS uat')
                        .select('u.*','uat.api_token')
                        .innerJoin('users AS u','u.id','=','uat.user_id')
                        .where('uat.platform_id',platform_id)
                        .where('uat.platform_type',platform_type)
                        .first()
        return record;
    }

    public static async removeDeviceToken(request)
    {
        let params = request.all();
        let user   = request.user();
        await UserApiToken.query()
                          .where('user_id',user.id)
                          .where('device_type',params.device_type)
                          .where('device_token',params.device_token)
                          .delete();
        return true;
    }

    public static async getTargetUsersByID(user_id)
    {
        let query = await this.query()
                            .join('user_api_tokens AS uat','uat.user_id','=','users.id')
                            .select('users.*','uat.device_token','uat.device_type')
                            .where('users.id',user_id)
                            .where('users.status','1');
        return query;
    }

    public static async getUsersByIDArray(user_id)
    {
        let query = await this.query()
                            .whereIn('id',user_id)
                            .where('users.status','1');
        return query;
    }
    
    public static async getUserHierarchy(id: number) {
        try {
          // Prepare and execute the raw query
          const result = await Database.rawQuery(`
            WITH RECURSIVE user_tree AS (
              SELECT id, name, parent_id
              FROM users
              WHERE id = ?
              UNION ALL
              SELECT u.id, u.name, u.parent_id
              FROM users u
              INNER JOIN user_tree ut ON u.parent_id = ut.id
            )
            SELECT * FROM user_tree;
          `, [id]);
          let record = JSON.parse(JSON.stringify(result[0]));
          let ids = []
          for(let i=0;i<record.length;i++){
                ids.push(record[i].id)
          }
          return ids;  // Accessing the rows in the result
        } catch (error) {
          console.error('Error fetching user hierarchy:', error);
          throw error;  // Handle or throw the error as needed
        }
      }
      
    public static async dashBoard(user_id:number,user_group_id:number)
    {
        let dashboard = {}
        if(user_group_id == 2){
            let total_user = await this.query().whereNotIn('user_group_id',[1,2]).whereNull('deleted_at').getCount();
            let total_contractor = await this.query().where('user_group_id',3).whereNull('deleted_at').getCount();
            let total_customer = await this.query().where('user_group_id',5).whereNull('deleted_at').getCount();
            let total_manager = await this.query().where('user_group_id',4).whereNull('deleted_at').getCount();
            let total_crew = await this.query().where('user_group_id',6).whereNull('deleted_at').getCount();
            let total_job = await Job.query().whereNull('deleted_at').getCount();
            let total_order = await Order.query().whereNull('deleted_at').getCount();
            let total_category = await ProductCategory.query().whereNull('deleted_at').getCount();
            let total_services = await Services.query().whereNull('deleted_at').getCount();
            dashboard.total_user = Number(total_user);
            dashboard.contractor = Number(total_contractor);
            dashboard.customer = Number(total_customer);
            dashboard.manager = Number(total_manager);
            dashboard.crew = Number(total_crew);
            dashboard.job = Number(total_job);
            dashboard.order = Number(total_order);
            dashboard.category = Number(total_category);
            dashboard.services = Number(total_services);
        }else if(user_group_id == 3){ //Contractor
            let get_user = await this.getUserHierarchy(user_id);
            var remove_current_id = _.without(get_user, user_id);
            let total_order = await Order.query().where('created_by_id',user_id).whereNull('deleted_at').getCount();
            let total_customer = await this.query().where('user_group_id',5).where('parent_id',user_id).whereNull('deleted_at');
            let totalCrew = await Database.from('jobs')
                                            .leftJoin('jobs_assigners', 'jobs_assigners.job_id', 'jobs.id')
                                            .where('jobs.created_by_id', user_id)
                                            .count('jobs_assigners.job_id as total_crew')                                      
            let total_manager = []
            for(let j=0;j<total_customer.length;j++){
                let get_manager = await this.query().where('user_group_id',4).where('parent_id',total_customer[j].id).whereNull('deleted_at').getCount();
                if(get_manager > 0){
                    total_manager.push(get_manager)
                }
            }
            let total_job = Job.query().whereNull('deleted_at')
            total_job.where(function (query) {
                query.whereIn('created_by_id',get_user)
                    .orWhereIn('parent_id',get_user);
            });
            let job = await total_job.count('* as count');
            let number_of_job = _.isEmpty(job) ? '0' : job[0].$extras.count
            dashboard.total_user = Number(remove_current_id.length);
            dashboard.customer = Number(total_customer.length);
            dashboard.manager = Number(total_manager.length);
            dashboard.crew = Number(totalCrew[0].total_crew);
            dashboard.job = Number(number_of_job);
            dashboard.order = Number(total_order);
        }else if(user_group_id == 5){//Customer
            let get_user = await this.getUserHierarchy(user_id);
            var remove_current_id = _.without(get_user, user_id);
            let total_order = await Order.query().where('created_by_id',user_id).whereNull('deleted_at').getCount();
            let manager = await this.query().where('user_group_id',4).where('parent_id',user_id).whereNull('deleted_at');
            let totalCrew = await Database.from('jobs')
                                            .leftJoin('jobs_assigners', 'jobs_assigners.job_id', 'jobs.id')
                                            .where('jobs.target_id', user_id)
                                            .count('jobs_assigners.job_id as total_crew') 
            let total_job = Job.query().whereNull('deleted_at')
            total_job.where(function (query) {
                query.whereIn('created_by_id',get_user)
                    .orWhereIn('parent_id',get_user);
            });
            let job = await total_job.count('* as count');
            let number_of_job = _.isEmpty(job) ? '0' : job[0].$extras.count
            dashboard.total_user = Number(remove_current_id.length);
            dashboard.manager = Number(manager.length);
            dashboard.crew = Number(totalCrew[0].total_crew);
            dashboard.job = Number(number_of_job);
            dashboard.order = Number(total_order);
        }else if(user_group_id == 4){//Manager
            let get_user = await this.getUserHierarchy(user_id);
            var remove_current_id = _.without(get_user, user_id);
            let total_order = await Order.query().where('created_by_id',user_id).whereNull('deleted_at').getCount();
            let total_job = Job.query().whereNull('deleted_at')
            total_job.where(function (query) {
                query.whereIn('created_by_id',get_user)
                    .orWhereIn('parent_id',get_user);
            });
            let job = await total_job.count('* as count');
            let number_of_job = _.isEmpty(job) ? '0' : job[0].$extras.count
            dashboard.job = Number(number_of_job);
            dashboard.order = Number(total_order);
        }else if(user_group_id == 6){//Crew
            var now = new Date();
            var dateString = moment(now).format('YYYY-MM-DD');
            let startOfDay = moment(dateString).startOf('day').toDate();
            let endOfDay = moment(dateString).endOf('day').toDate();
            let today_job = await JobAssignee.query()
                            .where('crew_id', user_id)
                            .whereBetween('created_at', [startOfDay, endOfDay]) // Using whereBetween to cover the entire day
                            .whereNull('deleted_at')
                            .getCount();
            let total_job = await JobAssignee.query().where('crew_id',user_id).whereNull('deleted_at').getCount();
            dashboard.today_job = Number(today_job);
            dashboard.total_job = Number(total_job);
        }
        
        return dashboard;
    }
}
module.exports = User;
