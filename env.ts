/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  APP_NAME: Env.schema.string(),
	HOST: Env.schema.string({ format: 'host' }),
	PORT: Env.schema.number(),
	APP_URL: Env.schema.string(),
  APP_KEY: Env.schema.string(),
  DRIVE_DISK: Env.schema.enum(['local','s3','private'] as const),
	NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  DB_CONNECTION: Env.schema.string(),
  MYSQL_HOST: Env.schema.string({ format: 'host' }),
  MYSQL_PORT: Env.schema.number(),
  MYSQL_USER: Env.schema.string(),
  MYSQL_PASSWORD: Env.schema.string.optional(),
  MYSQL_DB_NAME: Env.schema.string(),
  ADMIN_LOGIN_TOKEN: Env.schema.string(),
  JWT_SECRET: Env.schema.string(),
  JWT_EXPIRY: Env.schema.string(),
  CLIENT_ID: Env.schema.string(),
  AES_SECRET: Env.schema.string(),
  AES_IV: Env.schema.string(),
  SMTP_HOST: Env.schema.string({ format: 'host' }),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),
  SMTP_FROM_EMAIL: Env.schema.string(),
  SMTP_FROM_NAME: Env.schema.string(),
  MAIL_SANDBOX: Env.schema.number(),
  SESSION_DRIVER: Env.schema.string(),
  TIMEZONE:Env.schema.string(),
  TWILIO_SID: Env.schema.string(),
  TWILIO_AUTH_TOKEN: Env.schema.string(),
  TWILIO_SERVICE_ID: Env.schema.string(),
  OTP_SENDBOX: Env.schema.number(),
  TELESIGN_CUSTOMER_ID: Env.schema.string(),
  TELESIGN_API_KEY: Env.schema.string(),
  FFMPEG_BINARIES: Env.schema.string(),
  FFPROBE_BINARIES: Env.schema.string(),
  NOTIFICATION_DRIVER: Env.schema.string(),
  NOTIFICATION_URL: Env.schema.string(),
  NOTIFICATION_KEY: Env.schema.string(),
  NOTIFICATION_APP_ID: Env.schema.string(),
  PAYMENT_GATEWAY: Env.schema.string(),
  STRIPE_SECRET_KEY: Env.schema.string(),
  STRIPE_PUBLISHED_KEY: Env.schema.string(),
  STRIPE_CHARGE_CURRENCY: Env.schema.string(),
  BRAINTREE_ENV: Env.schema.string(),
  BRAINTREE_MERCHANT_ID: Env.schema.string(),
  BRAINTREE_MERCHANT_ACCOUNT_ID: Env.schema.string(),
  BRAINTREE_PUBLIC_KEY: Env.schema.string(),
  BRAINTREE_PRIVATE_KEY: Env.schema.string(),
  REDIS_CONNECTION: Env.schema.enum(['local'] as const),
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),
})
