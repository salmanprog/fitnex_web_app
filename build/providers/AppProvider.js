"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppProvider {
    constructor(app) {
        this.app = app;
    }
    register() {
    }
    async boot() {
        this.DBCountFn();
        this.lucidCountFn();
    }
    async ready() {
    }
    async shutdown() {
    }
    async DBCountFn() {
        const { DatabaseQueryBuilder } = this.app.container.use('Adonis/Lucid/Database');
        DatabaseQueryBuilder.macro('getCount', async function () {
            const result = await this.count('* as total');
            return BigInt(result[0].total);
        });
    }
    async lucidCountFn() {
        const { ModelQueryBuilder } = this.app.container.use('Adonis/Lucid/Database');
        ModelQueryBuilder.macro('getCount', async function () {
            const result = await this.count('* as total');
            return BigInt(result[0].$extras.total);
        });
    }
}
exports.default = AppProvider;
//# sourceMappingURL=AppProvider.js.map