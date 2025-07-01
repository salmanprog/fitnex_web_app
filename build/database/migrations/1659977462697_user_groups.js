"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'user_groups';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('title', 100).notNullable().unique();
            table.string('slug', 100).notNullable().unique();
            table.string('description', 255).nullable();
            table.enu('type', ['admin', 'user']).notNullable().defaultTo('user');
            table.enu('is_super_admin', ['1', '0']).notNullable().defaultTo('0');
            table.enu('status', ['1', '0']).notNullable().defaultTo('1');
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
//# sourceMappingURL=1659977462697_user_groups.js.map