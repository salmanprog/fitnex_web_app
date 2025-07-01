"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const standalone_1 = require("@adonisjs/core/build/standalone");
const fs_1 = __importDefault(require("fs"));
class RestModule extends standalone_1.BaseCommand {
    async run() {
        const model = await this.prompt.ask('Enter Model Name');
        const type = await this.prompt.ask('Enter Type eg: api | admin');
        this.logger.info(`${model} rest module is generating`);
        if (type == 'api') {
            await this.generateApiRestModule(model);
        }
        else {
            await this.generateAdminRestModule(model);
        }
        this.logger.success(`${model} rest module has been generated successfully`);
    }
    async generateApiRestModule(model) {
        await this.generateModel(model);
        await this.generateApiHook(model);
        await this.generateApiController(model);
        await this.generateApiResource(model);
    }
    async generateAdminRestModule(model) {
        await this.generateModel(model);
        await this.generateAdminHook(model);
        await this.generateAdminController(model);
        await this.generateCrudFile(model);
    }
    async generateModel(model) {
        if (!fs_1.default.existsSync(`${Application_1.default.appRoot}/App/Models/${model}.ts`)) {
            let modelContent = fs_1.default.readFileSync(`${Application_1.default.appRoot}/Commands/RestStuff/SampleModel.stuff`, { encoding: 'utf8' });
            modelContent = modelContent.replaceAll('[MODEL]', model);
            fs_1.default.writeFileSync(`${Application_1.default.appRoot}/App/Models/${model}.ts`, modelContent);
        }
    }
    async generateApiHook(model) {
        if (!fs_1.default.existsSync(`${Application_1.default.appRoot}/App/Models/Hooks/Api/${model}Hook.ts`)) {
            let modelContent = fs_1.default.readFileSync(`${Application_1.default.appRoot}/Commands/RestStuff/api/SampleHook.stuff`, { encoding: 'utf8' });
            modelContent = modelContent.replaceAll('[MODEL]', model);
            fs_1.default.writeFileSync(`${Application_1.default.appRoot}/App/Models/Hooks/Api/${model}Hook.ts`, modelContent);
        }
    }
    async generateApiController(model) {
        if (!fs_1.default.existsSync(`${Application_1.default.appRoot}/App/Controllers/Http/Api/${model}Controller.ts`)) {
            let modelContent = fs_1.default.readFileSync(`${Application_1.default.appRoot}/Commands/RestStuff/api/SampleRestController.stuff`, { encoding: 'utf8' });
            modelContent = modelContent.replaceAll('[MODEL]', model);
            fs_1.default.writeFileSync(`${Application_1.default.appRoot}/App/Controllers/Http/Api/${model}Controller.ts`, modelContent);
        }
    }
    async generateApiResource(model) {
        if (!fs_1.default.existsSync(`${Application_1.default.appRoot}/App/Controllers/Http/Resource/${model}.ts`)) {
            let modelContent = fs_1.default.readFileSync(`${Application_1.default.appRoot}/Commands/RestStuff/api/SampleResource.stuff`, { encoding: 'utf8' });
            modelContent = modelContent.replaceAll('[MODEL]', model);
            fs_1.default.writeFileSync(`${Application_1.default.appRoot}/App/Controllers/Http/Resource/${model}.ts`, modelContent);
        }
    }
    async generateAdminHook(model) {
        if (!fs_1.default.existsSync(`${Application_1.default.appRoot}/App/Models/Hooks/Admin/${model}Hook.ts`)) {
            let modelContent = fs_1.default.readFileSync(`${Application_1.default.appRoot}/Commands/RestStuff/Admin/SampleHook.stuff`, { encoding: 'utf8' });
            modelContent = modelContent.replaceAll('[MODEL]', model);
            fs_1.default.writeFileSync(`${Application_1.default.appRoot}/App/Models/Hooks/Admin/${model}Hook.ts`, modelContent);
        }
    }
    async generateAdminController(model) {
        if (!fs_1.default.existsSync(`${Application_1.default.appRoot}/App/Controllers/Http/Admin/${model}Controller.ts`)) {
            let modelContent = fs_1.default.readFileSync(`${Application_1.default.appRoot}/Commands/RestStuff/admin/SampleCrudController.stuff`, { encoding: 'utf8' });
            modelContent = modelContent.replaceAll('[MODEL]', model);
            fs_1.default.writeFileSync(`${Application_1.default.appRoot}/App/Controllers/Http/Admin/${model}Controller.ts`, modelContent);
        }
    }
    async generateCrudFile(model) {
        let resourcesPath = Application_1.default.resourcesPath();
        let dir = resourcesPath + '/views/admin/' + this.kebabCase(model);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir);
            let addContent = fs_1.default.readFileSync(`${Application_1.default.appRoot}/Commands/RestStuff/Admin/add.edge`, { encoding: 'utf8' });
            fs_1.default.writeFileSync(`${resourcesPath}/views/admin/${this.kebabCase(model)}/add.edge`, addContent);
            let editContent = fs_1.default.readFileSync(`${Application_1.default.appRoot}/Commands/RestStuff/Admin/edit.edge`, { encoding: 'utf8' });
            fs_1.default.writeFileSync(`${resourcesPath}/views/admin/${this.kebabCase(model)}/edit.edge`, editContent);
            let indexContent = fs_1.default.readFileSync(`${Application_1.default.appRoot}/Commands/RestStuff/Admin/index.edge`, { encoding: 'utf8' });
            fs_1.default.writeFileSync(`${resourcesPath}/views/admin/${this.kebabCase(model)}/index.edge`, indexContent);
            let detailContent = fs_1.default.readFileSync(`${Application_1.default.appRoot}/Commands/RestStuff/Admin/detail.edge`, { encoding: 'utf8' });
            fs_1.default.writeFileSync(`${resourcesPath}/views/admin/${this.kebabCase(model)}/detail.edge`, detailContent);
        }
    }
    kebabCase(string) {
        return string.split('').map((letter, idx) => {
            return letter.toUpperCase() === letter
                ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
                : letter;
        }).join('');
    }
}
exports.default = RestModule;
RestModule.commandName = 'rest:api';
RestModule.description = 'Generate Rest Api Resource';
RestModule.settings = {
    loadApp: false,
    stayAlive: false,
};
//# sourceMappingURL=RestModule.js.map