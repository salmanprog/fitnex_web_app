'use strict'

import Env from '@ioc:Adonis/Core/Env'
const accountSid = Env.get('TWILIO_SID');
const authToken = Env.get('TWILIO_AUTH_TOKEN');
const client = require('twilio')(accountSid, authToken);

export default class Twillio
{
    /**
     * This function is used to send otp
     * @param mobile_no {string}
     * @returns
     */
    public static async sendOtp(mobile_no:string)
    {
        mobile_no = mobile_no.replace('-','');
        if( !mobile_no.includes('+') ){
            mobile_no = '+' + mobile_no;
        }
        try{
          let data = await client.verify.v2.services(Env.get('TWILIO_SERVICE_ID'))
                            .verifications
                            .create({to: mobile_no, channel: 'sms'})
          return {
            code: 200,
            message: 'OTP has been sent successfully',
            data: data
          };
        } catch (error){
            return {
              code: 400,
              message:error.message,
              data: error
            };
        }
    }

    /**
     * This function is used to verify otp
     * @param mobile_no {string}
     * @param code {string}
     * @returns
     */
    public static async verifyOtp(mobile_no:string, code:string)
    {
        mobile_no = mobile_no.replace('-','');
        if( !mobile_no.includes('+') ){
            mobile_no = '+' + mobile_no;
        }
        try{
          let data = await client.verify.v2.services(Env.get('TWILIO_SERVICE_ID'))
                          .verificationChecks
                          .create({to: mobile_no, code: code})
          return {
            code: 200,
            message: 'OTP has been verified successfully',
            data: data
          };
        } catch (error){
            return {
              code: 400,
              message:error.message,
              data: {}
            };
        }
    }
}
