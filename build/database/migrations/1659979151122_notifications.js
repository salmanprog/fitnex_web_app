"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'notifications';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('unique_id', 200).unique().notNullable();
            table.string('identifier', 200).notNullable();
            table.integer('actor_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
            table.integer('target_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
            table.string('module', 100).notNullable();
            table.integer('module_id').notNullable();
            table.string('module_slug', 100).notNullable();
            table.string('reference_module').nullable();
            table.integer('reference_id').nullable();
            table.string('reference_slug', 100).nullable();
            table.string('title');
            table.text('description');
            table.text('web_redirect_link').nullable();
            table.enu('is_read', ['1', '0']).notNullable().defaultTo('0');
            table.enu('is_view', ['1', '0']).notNullable().defaultTo('0');
            table.timestamp('created_at', { useTz: true }).nullable();
            table.timestamp('updated_at', { useTz: true }).nullable();
            table.timestamp('deleted_at', { useTz: true }).nullable();
            table.index('target_id');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1659979151122_notifications.js.map