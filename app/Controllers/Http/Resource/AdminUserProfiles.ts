'use strict'
import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import MediaResource from './Media';
import Media from 'App/Models/Media';
import moment from 'moment';

class AdminUserProfiles
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
          slug: record.slug,
          name: record.name,
          nick_name: record.nick_name,
          dob: record.dob,
          age:record.age,
          image_url: !_.isEmpty(record.image_url) ?  await storageUrl(record.image_url) : baseUrl('/images/user-placeholder.jpg'),
      }
  }

}
module.exports = AdminUserProfiles;
