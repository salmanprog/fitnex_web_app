import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_group_id').unsigned().references('id').inTable('user_groups').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('parent_id').notNullable().defaultTo('0');
      table.integer('created_by').notNullable().defaultTo('0');
      table.enu('user_type',['admin','user']).notNullable().defaultTo('user')
      table.string('name',255).nullable()
      table.string('username',150).notNullable().unique()
      table.string('slug',150).notNullable().unique()
      table.string('email',150).nullable().unique()
      table.string('mobile_number',150).nullable().unique()
      table.string('dob',250).nullable()
      table.integer('age').notNullable().defaultTo(0)
      table.enu('gender',['Male','Female']).notNullable().defaultTo('Male')
      table.enu('profile_type',['Public','Private']).notNullable().defaultTo('Public')
      table.string('password',255).notNullable()
      table.text('image_url').nullable()
      table.string('company_name',255).nullable()
      table.string('company_address',255).nullable()
      table.string('company_mobile_number',255).nullable()
      table.string('company_email_address',255).nullable()
      table.integer('building_type_id').notNullable().defaultTo('0');
      table.text('user_link').nullable()
      table.enu('is_link',['1','0']).notNullable().defaultTo('0')
      table.enu('user_status',['0','1','2']).notNullable().defaultTo('1')
      table.enu('status',['1','0']).notNullable().defaultTo('1')
      table.enu('is_email_verify',['1','0']).notNullable().defaultTo('0')
      table.timestamp('email_verify_at').nullable()
      table.string('platform_type').notNullable().defaultTo('custom')
      table.string('platform_id').nullable()
      table.string('email_otp',100).nullable()
      table.integer('total_no_user').notNullable().defaultTo('0');
      table.integer('total_no_request').notNullable().defaultTo('0');
      table.timestamp('email_otp_created_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at',{ useTz: true }).nullable()
      table.index('name')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
