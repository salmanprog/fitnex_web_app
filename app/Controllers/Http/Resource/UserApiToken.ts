import _ from 'lodash';

class UserApiToken
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
          response.push( this.jsonSchema(data[i],request));
        }
      } else {
        response = this.jsonSchema(data,request)
      }
      return response;
  }

  private static jsonSchema(record: object,request:object)
  {
      return {
          api_token: Buffer.from(record.api_token, "utf8").toString("base64"),
          device_type: record.device_type,
          device_token: record.device_token,
          platform_type: record.platform_type,
          platform_id: record.platform_id,
      }
  }

}
module.exports = UserApiToken;
