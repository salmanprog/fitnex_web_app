'use strict'

import _ from 'lodash';
import UserApiToken from './UserApiToken';
import Drive from '@ioc:Adonis/Core/Drive'
import {baseUrl,storageUrl} from 'App/Helpers/Index'

class Admin
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
      return {
          id: record.id,
          info:{
            name: record.name,
            nick_name: record.nick_name,
            slug: record.slug,
            email: record.email,
            mobile_no: record.mobile_no,
            dob:record.dob,
            age:record.age,
            user_link:record.user_link,
            is_link:record.is_link,
            image_url: !_.isEmpty(record.image_url) ?  await storageUrl(record.image_url) : baseUrl('/images/user-placeholder.jpg'),
          },
          status:{
            is_email_verify:record.is_email_verify,
            platform_type:record.platform_type,
            status:record.status,
          },
          meta: await UserApiToken.initResponse(record.userApiToken,request),
          created_at: record.created_at
      }
  }

}
module.exports = Admin;
