import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'application_settings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier',200);
      table.string('meta_key',200);
      table.text('value');
      table.enu('is_file',['1','0']).notNullable().defaultTo('0');
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at',{ useTz: true }).nullable()
      table.index('identifier');
      table.index('meta_key');
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
