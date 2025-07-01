import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cms_module_permissions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_group_id').unsigned().references('id').inTable('user_groups').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('cms_module_id').unsigned().references('id').inTable('cms_modules').onDelete('CASCADE').onUpdate('NO ACTION');
      table.enu('is_add',['1','0']).defaultTo('0')
      table.enu('is_view',['1','0']).defaultTo('0')
      table.enu('is_update',['1','0']).defaultTo('0')
      table.enu('is_delete',['1','0']).defaultTo('0')
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
