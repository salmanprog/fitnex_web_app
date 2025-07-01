"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'user_api_tokens';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
            table.text('api_token').notNullable();
            table.string('device_type', 100).nullable();
            table.string('device_token', 100).nullable();
            table.string('platform_type', 100).nullable();
            table.string('platform_id', 255).nullable();
            table.string('ip_address', 100).nullable();
            table.text('user_agent').nullable();
            table.timestamp('created_at', { useTz: true }).nullable();
            table.timestamp('updated_at', { useTz: true }).nullable();
            table.timestamp('deleted_at', { useTz: true }).nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1688368042172_user_appi_tokens.js.map