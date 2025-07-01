'use strict'
import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'


class Media
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
      let media_url;

      if(record.file_type == 'audio'){
        media_url = baseUrl() + '/media_read/' + record.id + '.mp3';
      }else if(record.file_type == 'video'){
        media_url = baseUrl() + '/media_read/' + record.id + '.mp4';
      }else{
        media_url = await storageUrl(record.file_url)
      }

      return {
          id: record.id,
          filename: record.filename,
          file_url: await storageUrl(record.file_url),
          thumbnail_url: await storageUrl(record.thumbnail_url),
          file_type: record.file_type,
      }
  }

}
module.exports = Media;
