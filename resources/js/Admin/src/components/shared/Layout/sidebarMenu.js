import React from 'react';
import { Link } from 'react-router-dom';
import * as AntIcons from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import HttpRequest from "../../../repositories";
import api from "../../../repositories/api";
import Helper from "../../../helpers";

const { SubMenu } = Menu;

const iconStyle = {
  fontSize: 17
}

const logout = async () => {
  let { method, url } = api.logout;
  let params = { device_type: "web", device_token: "1234567890" };
  await HttpRequest.makeRequest(method, window.constants.api_base_url + url, params).then(
    async (response) => {
      if (response.code !== 200) {
        Helper.sendNotification("error", response.code, response.message);
      } else {
        Helper.removeStorageData();
      }
    }
  );
};

function SidebarMenu() {
  let user = window.helpers.getStorageData('session');
  const adminSideBar = [];
  let total_menu = parseInt(user.cms_modules.length) + parseInt(1);

  // Loop through the user's modules and create the menu
  user.cms_modules.map((module) => {
    let Icon = AntIcons[module.icon] || AntIcons['AppstoreOutlined'];  // Fallback icon
    let submenuItems = [];

    // Check if the module has submodules
    if (module.submodules && module.submodules.length > 0) {
      // Loop through submodules and create SubMenu items
      
      module.submodules.map((submodule) => (
        submenuItems.push({
          key: module.sort_order,
          icon: <Icon />,
          label: module.name,
          label: (
            <Link to={'/' + submodule.route_name}>
              {submodule.name}
            </Link>
          ),
        })
      ));
      // Add SubMenu to the menu
      adminSideBar.push({
        key: module.sort_order,
        icon: <Icon />,
        label: module.name,
        children: submenuItems, // Nested items
      });
    } else {
      // If no submodules, just add a regular menu item
      adminSideBar.push({
        key: module.sort_order,
        icon: <Icon />,
        label: (
          <Link to={'/' + module.route_name}>
            {module.name}
          </Link>
        ),
      });
    }
  });

  // Adding the logout menu item
  let Lgout = AntIcons['LogoutOutlined'];
  adminSideBar.push({
    key: `logout-${total_menu}`,
    icon: <Lgout />,
    label: (
      <Link onClick={logout}>
        Logout
      </Link>
    ),
  });

  return (
    <Menu theme="light" mode="inline" items={adminSideBar} />
  );
}

export default SidebarMenu;
