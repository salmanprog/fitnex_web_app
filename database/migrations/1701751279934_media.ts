import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'media'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('slug',100).notNullable().unique()
      table.string('module',100).notNullable()
      table.integer('module_id').notNullable()
      table.string('filename',200).notNullable()
      table.string('original_name',200).notNullable()
      table.text('file_url').notNullable()
      table.string('file_url_blur',200).notNullable()
      table.text('thumbnail_url').nullable()
      table.string('mime_type')
      table.string('file_type')
      table.string('driver',50).notNullable().defaultTo('local')
      table.enu('media_type',['public','private']).notNullable().defaultTo('public');
      table.text('meta').nullable()
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index('module')
      table.index('module_id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
