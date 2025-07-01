import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'content_managements'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title',150).notNullable();
      table.string('slug',150).notNullable().unique()
      table.text('content')
      table.text('api_url').nullable()
      table.enu('status',['1','0']).defaultTo('1')
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index('slug')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
