import Application from '@ioc:Adonis/Core/Application'
import { BaseCommand } from '@adonisjs/core/build/standalone'
import fs from 'fs';


export default class RestModule extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'rest:api'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Generate Rest Api Resource'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: false,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
      const model = await this.prompt.ask('Enter Model Name')
      const type  = await this.prompt.ask('Enter Type eg: api | admin')

      this.logger.info(`${model} rest module is generating`)
      if( type == 'api' ){
          await this.generateApiRestModule(model);
      } else {
        await this.generateAdminRestModule(model);
      }
      this.logger.success(`${model} rest module has been generated successfully`)
  }

  private async generateApiRestModule(model:string)
    {
        await this.generateModel(model);
        await this.generateApiHook(model);
        await this.generateApiController(model);
        await this.generateApiResource(model);
    }

    private async generateAdminRestModule(model:string)
    {
        await this.generateModel(model);
        await this.generateAdminHook(model);
        await this.generateAdminController(model);
        await this.generateCrudFile(model);
    }

    private async generateModel(model:string)
    {
      if (!fs.existsSync(`${Application.appRoot}/App/Models/${model}.ts`)){
        let modelContent = fs.readFileSync(`${Application.appRoot}/Commands/RestStuff/SampleModel.stuff`,{ encoding: 'utf8' });
            modelContent = modelContent.replaceAll('[MODEL]',model);
            fs.writeFileSync(`${Application.appRoot}/App/Models/${model}.ts`,modelContent);
      }
    }

    private async generateApiHook(model:string)
    {
      if (!fs.existsSync(`${Application.appRoot}/App/Models/Hooks/Api/${model}Hook.ts`)){
        let modelContent = fs.readFileSync(`${Application.appRoot}/Commands/RestStuff/api/SampleHook.stuff`,{ encoding: 'utf8' });
            modelContent =  modelContent.replaceAll('[MODEL]',model);
            fs.writeFileSync(`${Application.appRoot}/App/Models/Hooks/Api/${model}Hook.ts`,modelContent);
      }
    }

    private async generateApiController(model:string)
    {
      if (!fs.existsSync(`${Application.appRoot}/App/Controllers/Http/Api/${model}Controller.ts`)){
        let modelContent = fs.readFileSync(`${Application.appRoot}/Commands/RestStuff/api/SampleRestController.stuff`,{ encoding: 'utf8' });
            modelContent =  modelContent.replaceAll('[MODEL]',model);
            fs.writeFileSync(`${Application.appRoot}/App/Controllers/Http/Api/${model}Controller.ts`,modelContent);
      }
    }

    private async generateApiResource(model:string)
    {
      if (!fs.existsSync(`${Application.appRoot}/App/Controllers/Http/Resource/${model}.ts`)){
        let modelContent = fs.readFileSync(`${Application.appRoot}/Commands/RestStuff/api/SampleResource.stuff`,{ encoding: 'utf8' });
            modelContent =  modelContent.replaceAll('[MODEL]',model);
            fs.writeFileSync(`${Application.appRoot}/App/Controllers/Http/Resource/${model}.ts`,modelContent);
      }
    }

    private async generateAdminHook(model:string)
    {
      if (!fs.existsSync(`${Application.appRoot}/App/Models/Hooks/Admin/${model}Hook.ts`)){
        let modelContent = fs.readFileSync(`${Application.appRoot}/Commands/RestStuff/Admin/SampleHook.stuff`,{ encoding: 'utf8' });
            modelContent =  modelContent.replaceAll('[MODEL]',model);
            fs.writeFileSync(`${Application.appRoot}/App/Models/Hooks/Admin/${model}Hook.ts`,modelContent);
      }
    }

    private async generateAdminController(model:string)
    {
      if (!fs.existsSync(`${Application.appRoot}/App/Controllers/Http/Admin/${model}Controller.ts`)){
        let modelContent = fs.readFileSync(`${Application.appRoot}/Commands/RestStuff/admin/SampleCrudController.stuff`,{ encoding: 'utf8' });
            modelContent =  modelContent.replaceAll('[MODEL]',model);
            fs.writeFileSync(`${Application.appRoot}/App/Controllers/Http/Admin/${model}Controller.ts`,modelContent);
      }
    }

    private async generateCrudFile(model:string)
    {
        let resourcesPath = Application.resourcesPath();
        let dir = resourcesPath + '/views/admin/' + this.kebabCase(model);
        if ( !fs.existsSync(dir) ) {
            //create dir
            fs.mkdirSync(dir);
            //create add
            let addContent = fs.readFileSync(`${Application.appRoot}/Commands/RestStuff/Admin/add.edge`,{ encoding: 'utf8' });
            fs.writeFileSync(`${resourcesPath}/views/admin/${this.kebabCase(model)}/add.edge`,addContent);
            //create edit
            let editContent = fs.readFileSync(`${Application.appRoot}/Commands/RestStuff/Admin/edit.edge`,{ encoding: 'utf8' });
            fs.writeFileSync(`${resourcesPath}/views/admin/${this.kebabCase(model)}/edit.edge`,editContent);
             //create index
             let indexContent = fs.readFileSync(`${Application.appRoot}/Commands/RestStuff/Admin/index.edge`,{ encoding: 'utf8' });
             fs.writeFileSync(`${resourcesPath}/views/admin/${this.kebabCase(model)}/index.edge`,indexContent);
             //create detail
             let detailContent = fs.readFileSync(`${Application.appRoot}/Commands/RestStuff/Admin/detail.edge`,{ encoding: 'utf8' });
             fs.writeFileSync(`${resourcesPath}/views/admin/${this.kebabCase(model)}/detail.edge`,detailContent);
        }
    }

    private kebabCase(string:string)
    {
        return string.split('').map((letter, idx) => {
          return letter.toUpperCase() === letter
          ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
          : letter;
        }).join('');
    }
}
