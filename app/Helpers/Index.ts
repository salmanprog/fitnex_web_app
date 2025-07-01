import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'
import { string } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'
import _ from 'lodash';
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import fs from 'fs';
const ffmpeg = require('fluent-ffmpeg');
/*
|--------------------------------------------------------------------------
| Application Helpers
|--------------------------------------------------------------------------
|
|
*/
export const strSlug = (string: string) => {
  return string
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[-]+/g, "-")
          .replace(/[^\w-]+/g, "");
}

export const kebabCase = (string: string) => {
  return string.split('').map((letter, idx) => {
    return letter.toUpperCase() === letter
     ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
     : letter;
  }).join('');
}

export const baseUrl = (path: string = '') => {
  return Env.get('APP_URL') + path;
}

export const storageUrl = async (path:string) => {
  return Env.get('DRIVE_DISK') == 's3' ? await Drive.getUrl(path) : baseUrl('/uploads/' + path);
}

export const randomString = (length: number = 10) => {
  return string.generateRandom(length)
}

export const rand = (min:number, max:number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const currentDateTime = () => {
    return DateTime.now().toUTC().toFormat("yyyy-MM-dd\'T\'TT");
}

export const currentUnixDateTime = () => {
  return DateTime.now().toUTC().toUnixInteger();
}

export const currentTime = () => {
  return DateTime.now().toUTC().toFormat("TT");
}

export const sendMail = async (email_view_path: string,to: string,subject:string,params:object) => {
      Mail.send((message) => {
        message
          .from(Env.get('SMTP_FROM_EMAIL'),Env.get('SMTP_FROM_NAME'))
          .to(to)
          .subject(subject)
          .htmlView(email_view_path, params)
      }).then()
}

export const fileValidation = (file,sizeInKB = 2000000, extensions=['png','jpg','jpeg']) => {
    let data = {
        error:false,
        message: ''
    };
    if( file.size > sizeInKB ){
        data.error   = true;
        data.message = 'Error: max upload file size is 2MB'
    }
    if( !extensions.includes(file.extname) ){
        data.error   = true;
        data.message = 'File extension is not valid'
    }
    if( !_.isEmpty(file.error) ){
        data.error   = true;
        data.message = file.error;
    }
    return data;
}

export const generateVideoThumb = (file_path, destination_path) =>
{
    return new Promise( (resolve,reject) => {
        try{
            //create thumbnail tmp dir
            let dir = Application.tmpPath('uploads/video-thumbnail');
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            //set ffmpeg path
            ffmpeg.setFfmpegPath(Env.get('FFMPEG_BINARIES'))
            ffmpeg.setFfprobePath(Env.get('FFPROBE_BINARIES'))
            //thumbnail name
            let thumbnail_name = 'thumbnail-' + string.generateRandom(10) + '.jpg';
            ffmpeg(file_path)
            .on('end', async function() {
                //save file to disk
                let thumbnail_path = dir + '/' + thumbnail_name;
                let contents    = fs.readFileSync(thumbnail_path)
                await Drive.put(`${destination_path}/${thumbnail_name}`, contents)
                fs.unlinkSync(`${dir}/${thumbnail_name}`);
                resolve(`${destination_path}/${thumbnail_name}`);
            })
            .screenshots({
              count: 1,
              filename: thumbnail_name,
              folder: Application.tmpPath('uploads/video-thumbnail')
            });
        } catch ( error ){
            reject(error.message);
        }
    })
}
