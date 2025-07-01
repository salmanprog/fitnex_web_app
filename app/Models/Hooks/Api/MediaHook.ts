'use strict'
import Media from 'App/Models/Media';
import { currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash';
import FileUpload from 'App/Libraries/FileUpload/FileUpload'
import { currentDateTime } from 'App/Helpers/Index'

class MediaHook
{
     /**
     * Hook for manipulate query of index result
     * @param {current mongo query} query
     * @param {adonis request object} request
     * @param {object} slug
     */
    public static async indexQueryHook(query: object, request: object, slug:string = '')
    {
        
    }

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async beforeCreateHook(request: object, params:object)
    {
        if( !_.isEmpty(request.file('file_url')) ){
            if(params.file_type == 'image'){
                params.file_url  = await FileUpload.doUpload(request.file('file_url'),'media/image');
            }else if(params.file_type == 'video'){
                params.file_url  = await FileUpload.doUpload(request.file('file_url'),'media/video');
            }else if(params.file_type == 'audio'){
                params.file_url  = await FileUpload.doUpload(request.file('file_url'),'media/audio');
            }else if(params.file_type == 'pdf'){
                params.file_url  = await FileUpload.doUpload(request.file('file_url'),'media/pdf');
            }else if(params.file_type == 'ancillary_profile'){
                params.file_url  = await FileUpload.doUpload(request.file('file_url'),'media/ancillary_profile');
            }

            if( !_.isEmpty(request.file('thumbnail_url')) ){
                params.thumbnail_url = await FileUpload.doUpload(request.file('thumbnail_url'),'media/thumbnails');
            }else{
                params.thumbnail_url = params.file_url
            }   

            params.slug = Math.floor( ( Math.random() * 100) + 1 ) + new Date().getTime();
            params.user_id = request.user().id
            params.module = ''
            params.module_id = 0
            params.filename = 'dumy_'+Math.floor( ( Math.random() * 100) + 1 ) + new Date().getTime();
            params.original_name = 'dumy_'+Math.floor( ( Math.random() * 100) + 1 ) + new Date().getTime();
            params.file_url = params.file_url;
            params.file_url_blur = '0000'
            params.thumbnail_url = params.thumbnail_url
            params.mime_type = params.file_type
            params.file_type = params.file_type
            params.driver = ''        
            params.media_type = 'public'   
            params.meta = ''
            //params.created_at = currentDateTime();
        }
        
    }

    /**
     * Hook for execute command after add public static function called
     * @param {saved record object} record
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async afterCreateHook(record:object, request:object, params:object)
    {
        
    }

    /**
     * Hook for manipulate data input before update data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    public static async beforeEditHook(request:object, params:object, slug:string)
    {
        
    }

    /**
     * Hook for execute command after edit
     * @param {updated record object} record
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async afterEditHook(request:object, slug:string)
    {

    }

    /**
     * Hook for execute command before delete
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    public static async beforeDeleteHook(request:object, params:object, slug:string)
    {

    }

    /**
     * Hook for execute command after delete
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    public static async afterDeleteHook(request:object, params:object, slug:string)
    {

    }
}
module.exports = MediaHook;
