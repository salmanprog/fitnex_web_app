import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import Controller from "../Controller";
import _ from 'lodash';
import { fileValidation, generateVideoThumb } from 'App/Helpers/Index';
import Drive from '@ioc:Adonis/Core/Drive'

export default class GeneralController extends Controller
{
    protected __resource: string;
    protected __request: object;
    protected __response: object;
    protected __params: object;

    constructor() {
        super();
        this.__request; //adonis request obj
        this.__response; //adonis response obj
        this.__params = {}; // this is used for get parameters from url
    }

    public async generateVideoThumb(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let file = this.__request.file('file');
        let fileValidate = fileValidation(file,6000000,['mp4']);
        if ( fileValidate.error ) {
            return this.sendError(
                'Validation Message',
                { message: fileValidate.message },
                400
            );
        }
        var thumbnail = await generateVideoThumb(file.tmpPath,'videos');
            thumbnail = await Drive.getUrl(thumbnail)
        //send response
        this.__is_paginate = false;
        this.__collection  = false;
        await this.__sendResponse(200,'Thumbnail Generate in successfully',{ fileurl: thumbnail });
        return;
    }
}
