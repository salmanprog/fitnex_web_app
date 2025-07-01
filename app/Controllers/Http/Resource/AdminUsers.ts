'use strict'
import _ from 'lodash';
import UserMdle from 'App/Models/User';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import Services from 'App/Models/Services';
import PublicUser from './PublicUser'
import BuildingType from './BuildingType'

class AdminUsers
{
  protected static async initResponse(data: object,request:object)
  {
      if( _.isEmpty(data) )
        return [];

      let response;
      if( Array.isArray(data) ){
        response = []
        for(var i=0; i < data.length; i++)
        {
          response.push( await this.jsonSchema(data[i],request));
        }
      } else {
        response = await this.jsonSchema(data,request)
      }
      return response;
  }

  private static async jsonSchema(record: object,request:object)
  {
      let created_by = await UserMdle.getUserById(record.parent_id)
      let user_status = '';
      if(record.user_status == '1'){
        user_status = 'Approved'
      }else if(record.user_status == '2'){
        user_status = 'Rejected'
      }else{
        user_status = 'Pending'
      } 
 
      return {
          id: record.id,
          parent_id:record.parent_id,
          created_by: await PublicUser.initResponse(created_by,request),
          user_group_id:record.user_group_id,
          name: record.name,
          slug: record.slug,
          email: record.email,
          mobile_no: record.mobile_number,
          dob:record.dob,
          age:record.age,
          profile_type:record.profile_type,
          image_url: !_.isEmpty(record.image_url) ?  await storageUrl(record.image_url) : baseUrl('/images/user-placeholder.jpg'),
          company_name:record.company_name,
          company_address:record.company_address,
          company_mobile_number:record.company_mobile_number,
          company_email_address:record.company_email_address,
          building_type_id:record.building_type_id,
          building_type: await BuildingType.initResponse(BuildingType,request),
          user_link:record.user_link,
          is_link:record.is_link,
          services:record.SelectedServices,
          is_email_verify:record.is_email_verify,
          platform_type:record.platform_type,
          user_status:user_status,
          user_status_number:parseInt(record.user_status),
          status_text:(record.status == 1) ? 'Active' : 'Deactive',
          status:record.status,
      }
  }

}
module.exports = AdminUsers;
