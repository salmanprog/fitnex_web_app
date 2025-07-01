"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'application_settings';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('identifier', 200);
            table.string('meta_key', 200);
            table.text('value');
            table.enu('is_file', ['1', '0']).notNullable().defaultTo('0');
            table.timestamp('created_at', { useTz: true }).nullable();
            table.timestamp('updated_at', { useTz: true }).nullable();
            table.timestamp('deleted_at', { useTz: true }).nullable();
            table.index('identifier');
            table.index('meta_key');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1659978720280_application_settings.js.map