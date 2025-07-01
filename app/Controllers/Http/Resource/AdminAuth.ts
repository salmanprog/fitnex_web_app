'use strict'

import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import CmsModule from 'App/Models/CmsModule';
import UserGroup from 'App/Models/UserGroup';

class User
{
  constructor()
  {
      this.headers = {};
  }

  protected static async initResponse(data: object,request:object)
  {
      this.headers = request.headers();
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
      let api_token = typeof request.headers().authorization == 'undefined' ? record.userApiToken.api_token : request.apiToken();
      api_token = Buffer.from(api_token, "utf8").toString("base64")
      let get_role = await UserGroup.getById(record.user_group_id)
      return {
          id: record.id,
          parent_id:record.parent_id,
          user_group_id:record.user_group_id,
          user_group:get_role.title,
          name: record.name,
          username: record.username,
          slug: record.slug,
          email: record.email,
          mobile_no: record.mobile_number,
          image_url: !_.isEmpty(record.image_url) ?  await storageUrl(record.image_url) : baseUrl('/images/user-placeholder.jpg'),
          company_name:record.company_name,
          company_address:record.company_address,
          company_mobile_number:record.company_mobile_number,
          company_email_address:record.company_email_address,
          user_link:record.user_link,
          is_link:record.is_link,
          is_mobile_verify:record.is_mobile_verify,
          is_email_verify:record.is_email_verify,
          platform_type:record.platform_type,
          status:record.status,
          api_token: api_token,
          cms_modules: (!_.isEmpty(record.cms_modules)) ? record.cms_modules : await CmsModule.getCmsModules(get_role?.slug,[],{user_group_id:record.user_group_id})
          created_at: record.created_at
      }
  }

}
module.exports = User;
