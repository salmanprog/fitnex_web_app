import Env from '@ioc:Adonis/Core/Env'
const fetch  = require('node-fetch');
var FormData = require('form-data');
const CustomerId    = Env.get('TELESIGN_CUSTOMER_ID');
const ApiKey        = Env.get('TELESIGN_API_KEY');
const TelesignAuth  = Buffer.from(`${CustomerId}:${ApiKey}`).toString('base64')

export default class Telesign
{
    /**
     * This function is used to send otp
     * @param mobile_no {string}
     * @returns
     */
    public static async sendOtp(mobile_no:string,code:number)
    {
          mobile_no = mobile_no.replace('-','');
          mobile_no = mobile_no.replace('+','');
          var form = new FormData();
              form.append('phone_number', mobile_no);
              form.append('message', `Your verification code is ${code}`);
              form.append('message_type','ARN');
          try{
              let response =  await fetch('https://rest-api.telesign.com/v1/messaging',{
                method: 'post',
                body: form,
                headers: {'Authorization': 'Basic ' + TelesignAuth}
              });
              let data = await response.json();
              return {
                  code: data.status.code == 290 ? 200 : data.status.code,
                  message: 'OTP has been sent successfully',
                  data: data
              };
          } catch( error ){
              return {
                  code: 400,
                  message: error.message,
                  data: error
              };
          }
    }

}
