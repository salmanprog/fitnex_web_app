"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Index_1 = global[Symbol.for('ioc.use')]("App/Helpers/Index");
const passwordHash = require('password-hash');
class default_1 extends Seeder_1.default {
    async run() {
        await this.userGroup();
        await this.users();
        await this.cmsModules();
        await this.applicationSetting();
        await this.contentManagement();
    }
    async userGroup() {
        await Database_1.default.table('user_groups').insert([
            {
                title: 'Super Admin',
                slug: (0, Index_1.strSlug)('Super Admin'),
                type: 'admin',
                is_super_admin: '1',
                created_at: new Date(),
            },
            {
                title: 'Admin',
                slug: (0, Index_1.strSlug)('Admin'),
                type: 'admin',
                is_super_admin: '0',
                created_at: new Date(),
            },
            {
                title: 'Contractor',
                slug: (0, Index_1.strSlug)('contractor'),
                type: 'user',
                is_super_admin: '0',
                created_at: new Date(),
            },
            {
                title: 'Center',
                slug: (0, Index_1.strSlug)('manager'),
                type: 'user',
                is_super_admin: '0',
                created_at: new Date(),
            },
            {
                title: 'Customer',
                slug: (0, Index_1.strSlug)('customer'),
                type: 'user',
                is_super_admin: '0',
                created_at: new Date(),
            },
            {
                title: 'Crew',
                slug: (0, Index_1.strSlug)('crew'),
                type: 'user',
                is_super_admin: '0',
                created_at: new Date(),
            },
            {
                title: 'App User',
                slug: (0, Index_1.strSlug)('App User'),
                type: 'user',
                is_super_admin: '0',
                created_at: new Date(),
            }
        ]);
    }
    async users() {
        await Database_1.default.table('users').insert([
            {
                user_group_id: 1,
                user_type: 'admin',
                name: 'Super Admin',
                username: 'superadmin',
                slug: 'superadmin',
                email: 'superadmin@admin.com',
                dob: '1996-05-20',
                age: 29,
                gender: 'Male',
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
                dob: '1996-05-20',
                age: 29,
                gender: 'Male',
                password: await passwordHash.generate('Admin@123$'),
                is_email_verify: '1',
                email_verify_at: new Date(),
                created_at: new Date()
            }
        ]);
    }
    async cmsModules() {
        await Database_1.default.table('cms_modules').insert([
            {
                id: 1,
                name: 'Dashboard',
                route_name: 'admin/dashboard',
                icon: 'DashboardOutlined',
                status: '1',
                sort_order: 1,
                created_at: new Date()
            },
            {
                id: 2,
                name: 'Dashboard',
                route_name: 'admin/contractor-dashboard',
                icon: 'DashboardOutlined',
                status: '1',
                sort_order: 1,
                created_at: new Date()
            },
            {
                id: 3,
                name: 'Dashboard',
                route_name: 'admin/customer-dashboard',
                icon: 'DashboardOutlined',
                status: '1',
                sort_order: 1,
                created_at: new Date()
            },
            {
                id: 4,
                name: 'Dashboard',
                route_name: 'admin/manager-dashboard',
                icon: 'DashboardOutlined',
                status: '1',
                sort_order: 1,
                created_at: new Date()
            },
            {
                id: 5,
                name: 'Dashboard',
                route_name: 'admin/crew-dashboard',
                icon: 'DashboardOutlined',
                status: '1',
                sort_order: 1,
                created_at: new Date()
            },
            {
                id: 6,
                name: 'Contractor Management',
                route_name: 'admin/contractor',
                icon: 'UsergroupDeleteOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 7,
                name: 'Crew Management',
                route_name: '#',
                icon: 'UsergroupAddOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 8,
                parent_id: 7,
                name: 'Create Crew',
                route_name: 'admin/crew',
                icon: 'UsergroupAddOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 9,
                parent_id: 7,
                name: 'Invite Crew',
                route_name: 'admin/invitecrew',
                icon: 'UsergroupAddOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 10,
                name: 'Crew Management',
                route_name: 'admin/contractor-crew',
                icon: 'UsergroupAddOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 11,
                name: 'Service Management',
                route_name: 'admin/services',
                icon: 'SisternodeOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 12,
                name: 'Customer Management',
                route_name: 'admin/customer',
                icon: 'UsergroupDeleteOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 13,
                name: 'Centers Management',
                route_name: 'admin/manager',
                icon: 'UsergroupDeleteOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 14,
                name: 'Centers Management',
                route_name: 'admin/contractor-centers',
                icon: 'UsergroupDeleteOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 15,
                name: 'E-Commerce Management',
                route_name: '#',
                icon: 'ShopOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 16,
                parent_id: 15,
                name: 'Product Category',
                route_name: 'admin/product-category',
                icon: 'ForkOutlined',
                status: '1',
                sort_order: 1,
                created_at: new Date()
            },
            {
                id: 17,
                parent_id: 15,
                name: 'Products',
                route_name: 'admin/product',
                icon: 'ShoppingCartOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 18,
                name: 'Feedback Management',
                route_name: '#',
                icon: 'ReadOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 19,
                parent_id: 18,
                name: 'Questions',
                route_name: 'admin/feedback_question',
                icon: 'ReadOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 20,
                parent_id: 18,
                name: 'Users Feedbacks',
                route_name: 'admin/users-feedbacks',
                icon: 'ReadOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 21,
                name: 'Order Management',
                route_name: 'admin/orders',
                icon: 'ClusterOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 22,
                name: 'Feed Back',
                route_name: 'admin/feedback',
                icon: 'ReadOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 23,
                name: 'Store',
                route_name: 'admin/store',
                icon: 'ApartmentOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 24,
                name: 'Orders',
                route_name: 'admin/user-orders',
                icon: 'InboxOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 25,
                name: 'Job Management',
                route_name: 'admin/job',
                icon: 'SwitcherOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 26,
                name: 'Job Management',
                route_name: 'admin/customer-job',
                icon: 'SwitcherOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 27,
                name: 'Job Management',
                route_name: 'admin/contractor-job',
                icon: 'SwitcherOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 28,
                name: 'Job Management',
                route_name: 'admin/admin-job',
                icon: 'SwitcherOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 29,
                name: 'Job',
                route_name: 'admin/crew-job',
                icon: 'SwitcherOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 30,
                name: 'Building Types',
                route_name: 'admin/building_types',
                icon: 'TableOutlined',
                status: '1',
                sort_order: 2,
                created_at: new Date()
            },
            {
                id: 31,
                name: 'Application Setting',
                route_name: 'admin/application-setting',
                icon: 'SettingOutlined',
                status: '1',
                sort_order: 7,
                created_at: new Date()
            },
            {
                id: 32,
                name: 'Profile Settings',
                route_name: 'admin/profilesettings',
                icon: 'UserOutlined',
                status: '1',
                sort_order: 8,
                created_at: new Date()
            },
            {
                id: 33,
                name: 'Change Password',
                route_name: 'admin/changepassword',
                icon: 'UnlockOutlined',
                status: '1',
                sort_order: 9,
                created_at: new Date()
            }
        ]);
    }
    async applicationSetting() {
        await Database_1.default.table('application_settings').insert([
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
        ]);
    }
    async contentManagement() {
        let content = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
        await Database_1.default.table('content_managements').insert([
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
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=DatabaseSeeder.js.map