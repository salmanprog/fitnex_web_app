import Env from '@ioc:Adonis/Core/Env'

/*
|--------------------------------------------------------------------------
| Application Constant Variables
|--------------------------------------------------------------------------
|
*/
export const ADMIN_LOGIN_TOKEN: string = Env.get('ADMIN_LOGIN_TOKEN','zekkmdvhkm')

export const JWT_SECRET: string = Env.get('JWT_SECRET','8c1281f7fcd2kXp2s5v8y/B?E(H+MbQeThWmZq3t6w9z')

export const JWT_EXPIRY: string = Env.get('JWT_EXPIRY','7d')

export const CLIENT_ID: string = Env.get('CLIENT_ID','59200748-36fc-2744-355-8c1281f7fcd2')

export const AES_SECRET: string = Env.get('AES_SECRET','kXp2s5v8y/B?E(H+MbQeThWmZq3t6w9z')

export const APP_NAME: string = Env.get('APP_NAME','Adonis TypeScript')

export const PAGINATION_LIMIT: number = 20

export const USER_IMAGE_PATH: string = 'uploads/users/';

export const APP_SETTING_IMAGE_PATH: string = 'uploads/app_setting/'

export const REDIS_CACHE_ENABLE: boolean = Env.get('REDIS_CACHE_ENABLE',false)

export const REDIS_CACHE_EXPIRE_TIME: number = Env.get('REDIS_CACHE_EXPIRE_TIME',3600)
