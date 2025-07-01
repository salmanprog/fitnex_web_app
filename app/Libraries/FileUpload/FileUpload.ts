'use strict'

import Drive from '@ioc:Adonis/Core/Drive'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'
import fs from 'fs'
//import {encode} from "blurhash";
//import { createCanvas, loadImage, Image } from 'canvas'
import ffmpeg from 'fluent-ffmpeg';
import _ from 'lodash'
import {randomString} from 'App/Helpers/Index';

export default class FileUpload
{
    public static async doUpload(fileObject:object, destination_upload_path:string, resize:boolean=false)
    {
        let filename = destination_upload_path + '/' + `${new Date().getTime()}.${fileObject.extname}`;
        let fileContent = fs.readFileSync(fileObject.tmpPath);
        await Drive.put(filename,fileContent)
        if( resize ){

        }
        return filename;
    }

    // public static async createBlurHash(image_path)
    // {
    //     let fileContent = await Drive.get(image_path);
    //     let image = await loadImage(fileContent)
    //     let imageData = this.getImageData(image)
    //     return encode(
    //       imageData.data,
    //       imageData.width,
    //       imageData.height,
    //       4,
    //       4
    //     )
    // }

    // private static getImageData(image: Image)
    // {
    //     let canvas = createCanvas(image.width, image.height)
    //     let context = canvas.getContext('2d')
    //     context.drawImage(image, 0, 0)
    //     return context.getImageData(0, 0, image.width, image.height)
    // }

    public static generateVideoThumb(file_path, destination_path)
    {
      return new Promise( (resolve,reject) => {
          try{
              //create thumbnail tmp dir
              let dir = Application.publicPath('uploads/video-thumbnail');
              if (!fs.existsSync(dir)){
                  fs.mkdirSync(dir);
              }
              //set ffmpeg path
              ffmpeg.setFfmpegPath(Env.get('FFMPEG_BINARIES'))
              ffmpeg.setFfprobePath(Env.get('FFPROBE_BINARIES'))
              //thumbnail name
              let thumbnail_name = 'thumbnail-' + randomString(10) + '.jpg';
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
                folder: Application.publicPath('uploads/video-thumbnail')
              });
          } catch ( error ){
              reject(error.message);
          }
      })
    }
}
