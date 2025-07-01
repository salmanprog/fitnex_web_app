import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'

class PublicUser
{

  public static async initResponse(data: object,request:object)
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
          name: record.name,
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
          created_at: record.created_at
      }
  }

}
module.exports = PublicUser;
