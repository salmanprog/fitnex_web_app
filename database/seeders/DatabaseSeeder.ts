import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
//import Hash from '@ioc:Adonis/Core/Hash'
import { strSlug } from 'App/Helpers/Index';
const passwordHash = require('password-hash')
export default class extends BaseSeeder {
  public async run () {
    await this.userGroup();
    await this.users();
    await this.cmsModules();
    await this.applicationSetting();
    await this.contentManagement();
    
  }

  private async userGroup()
  {
    await Database.table('user_groups').insert([
      {
        title: 'Super Admin',
        slug: strSlug('Super Admin'),
        type: 'admin',
        is_super_admin: '1',
        created_at: new Date(),
      },
      {
        title: 'Admin',
        slug: strSlug('Admin'),
        type: 'admin',
        is_super_admin: '0',
        created_at: new Date(),
      },
      {
        title: 'Contractor',
        slug: strSlug('contractor'),
        type: 'user',
        is_super_admin: '0',
        created_at: new Date(),
      },
      {
        title: 'Center',
        slug: strSlug('manager'),
        type: 'user',
        is_super_admin: '0',
        created_at: new Date(),
      },
      {
        title: 'Customer',
        slug: strSlug('customer'),
        type: 'user',
        is_super_admin: '0',
        created_at: new Date(),
      },
      {
        title: 'Crew',
        slug: strSlug('crew'),
        type: 'user',
        is_super_admin: '0',
        created_at: new Date(),
      },
      {
        title: 'App User',
        slug: strSlug('App User'),
        type: 'user',
        is_super_admin: '0',
        created_at: new Date(),
      }
    ]);
  }

  private async users()
  {
    await Database.table('users').insert([
        {
            user_group_id: 1,
            user_type: 'admin',
            name: 'Super Admin',
            username: 'superadmin',
            slug: 'superadmin',
            email: 'superadmin@admin.com',
            dob:'1996-05-20',
            age:29,
            gender:'Male',
            password: await passwordHash.generate('Superadmin@123$'),
            is_email_verify: '1',
            email_verify_at: new Date(),
            created_at: new Date()
        },
        {
          user_group_id: 2,
          user_type: 'admin',
          name: 'Admin',
          username: 'admin',
          slug: 'admin',
          email: 'admin@cks.com',
          dob:'1996-05-20',
          age:29,
          gender:'Male',
          password: await passwordHash.generate('Admin@123$'),
          is_email_verify: '1',
          email_verify_at: new Date(),
          created_at: new Date()
      }
    ])
  }

  private async cmsModules()
  {
    await Database.table('cms_modules').insert([
      {
        id:1,
        name: 'Dashboard',
        route_name: 'admin/dashboard',
        icon: 'DashboardOutlined',
        status: '1',
        sort_order: 1,
        created_at: new Date()
      },
      {
        id:2,
        name: 'Dashboard',
        route_name: 'admin/contractor-dashboard',
        icon: 'DashboardOutlined',
        status: '1',
        sort_order: 1,
        created_at: new Date()
      },
      {
        id:3,
        name: 'Dashboard',
        route_name: 'admin/customer-dashboard',
        icon: 'DashboardOutlined',
        status: '1',
        sort_order: 1,
        created_at: new Date()
      },
      {
        id:4,
        name: 'Dashboard',
        route_name: 'admin/manager-dashboard',
        icon: 'DashboardOutlined',
        status: '1',
        sort_order: 1,
        created_at: new Date()
      },
      {
        id:5,
        name: 'Dashboard',
        route_name: 'admin/crew-dashboard',
        icon: 'DashboardOutlined',
        status: '1',
        sort_order: 1,
        created_at: new Date()
      },
      {
        id:6, //2 admin
        name: 'Contractor Management',
        route_name: 'admin/contractor',
        icon: 'UsergroupDeleteOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:7, //2 admin
        name: 'Crew Management',
        route_name: '#',
        icon: 'UsergroupAddOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:8, //2 admin
        parent_id:7,
        name: 'Create Crew',
        route_name: 'admin/crew',
        icon: 'UsergroupAddOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:9, //2 admin
        parent_id:7,
        name: 'Invite Crew',
        route_name: 'admin/invitecrew',
        icon: 'UsergroupAddOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:10, //2 contractor
        name: 'Crew Management',
        route_name: 'admin/contractor-crew',
        icon: 'UsergroupAddOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:11, //2 admin
        name: 'Service Management',
        route_name: 'admin/services',
        icon: 'SisternodeOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:12, //3 contractor
        name: 'Customer Management',
        route_name: 'admin/customer',
        icon: 'UsergroupDeleteOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:13, //5 Customer
        name: 'Centers Management',
        route_name: 'admin/manager',
        icon: 'UsergroupDeleteOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:14, //5 Contractor
        name: 'Centers Management',
        route_name: 'admin/contractor-centers',
        icon: 'UsergroupDeleteOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:15, //2 admin
        name: 'E-Commerce Management',
        route_name: '#',
        icon: 'ShopOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:16, //2 admin
        parent_id:15,
        name: 'Product Category',
        route_name: 'admin/product-category',
        icon: 'ForkOutlined',
        status: '1',
        sort_order: 1,
        created_at: new Date()
      },
      {
        id:17, //2 admin
        parent_id:15,
        name: 'Products',
        route_name: 'admin/product',
        icon: 'ShoppingCartOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:18, //2 admin
        name: 'Feedback Management',
        route_name: '#',
        icon: 'ReadOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:19, //2 admin
        parent_id:18,
        name: 'Questions',
        route_name: 'admin/feedback_question',
        icon: 'ReadOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:20, //2 admin
        parent_id:18,
        name: 'Users Feedbacks',
        route_name: 'admin/users-feedbacks',
        icon: 'ReadOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:21, //2 admin
        name: 'Order Management',
        route_name: 'admin/orders',
        icon: 'ClusterOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:22, // users
        name: 'Feed Back',
        route_name: 'admin/feedback',
        icon: 'ReadOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:23, // users
        name: 'Store',
        route_name: 'admin/store',
        icon: 'ApartmentOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:24, //users
        name: 'Orders',
        route_name: 'admin/user-orders',
        icon: 'InboxOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:25, //4 Centers
        name: 'Job Management',
        route_name: 'admin/job',
        icon: 'SwitcherOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:26, //5 customer
        name: 'Job Management',
        route_name: 'admin/customer-job',
        icon: 'SwitcherOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:27, //3 contractor
        name: 'Job Management',
        route_name: 'admin/contractor-job',
        icon: 'SwitcherOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:28, //2 admin
        name: 'Job Management',
        route_name: 'admin/admin-job',
        icon: 'SwitcherOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:29, //6 crew
        name: 'Job',
        route_name: 'admin/crew-job',
        icon: 'SwitcherOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:30, //2 admin
        name: 'Building Types',
        route_name: 'admin/building_types',
        icon: 'TableOutlined',
        status: '1',
        sort_order: 2,
        created_at: new Date()
      },
      {
        id:31,
        name: 'Application Setting',
        route_name: 'admin/application-setting',
        icon: 'SettingOutlined',
        status: '1',
        sort_order: 7,
        created_at: new Date()
      },
      {
        id:32,
        name: 'Profile Settings',
        route_name: 'admin/profilesettings',
        icon: 'UserOutlined',
        status: '1',
        sort_order: 8,
        created_at: new Date()
      },
      {
        id:33,
        name: 'Change Password',
        route_name: 'admin/changepassword',
        icon: 'UnlockOutlined',
        status: '1',
        sort_order: 9,
        created_at: new Date()
      }
    ])
  }

  private async applicationSetting()
  {
    await Database.table('application_settings').insert([
      {
        identifier: 'application_setting',
        meta_key: 'favicon',
        value: '/images/favicon.png',
        is_file: '1',
        created_at: new Date(),
      },
      {
        identifier: 'application_setting',
        meta_key: 'logo',
        value: '/images/logo.jpg',
        is_file: '1',
        created_at: new Date(),
      },
      {
        identifier: 'application_setting',
        meta_key: 'application_name',
        value: 'CKS Portal',
        is_file: '0',
        created_at: new Date(),
      }
    ])
  }

  private async contentManagement()
  {
    let content = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
    await Database.table('content_managements').insert([
      {
        title: 'About US',
        slug: 'about-us',
        content: content,
        status: '1',
        created_at: new Date(),
      },
      {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content: content,
        status: '1',
        created_at: new Date(),
      },
      {
        title: 'Terms & Conditions',
        slug: 'terms-conditions',
        content: content,
        status: '1',
        created_at: new Date(),
      }
    ])
  }
  
}
