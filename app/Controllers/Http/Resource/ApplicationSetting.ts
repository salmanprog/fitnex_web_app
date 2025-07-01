import _ from 'lodash';
import {baseUrl} from 'App/Helpers/Index'

class ApplicationSetting
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
        favicon: baseUrl() +'/uploads/'+ record.favicon,
        logo: baseUrl() +'/uploads/'+ record.logo,
        application_name: record.app_name,
        meta_keyword: record.meta_keyword,
        meta_description: record.meta_description,
      }
  }

}
module.exports = ApplicationSetting;
