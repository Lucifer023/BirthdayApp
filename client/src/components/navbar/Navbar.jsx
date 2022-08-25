import React, { useContext } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import { Context } from "../../utils/LoginProvider";
import { serviceConfig } from "../../appSettings/serviceConfig";
import { optionsErrorToast } from "../../helper/toastOptions";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const [login, setLogin] = useContext(Context);

  const signOut = async () => {
    await axios
      .post(`${serviceConfig.baseURL}/users/logout`)
      .then((res) => {
        localStorage.removeItem("usernameOfLoggedUser");
        setLogin(!login);
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };
  return (
    <Menu mode="horizontal">
      <Menu.SubMenu key="birthdaySubmenu" title="Birthday - Submenu">
        <Menu.Item key="/createBirthdayEvent">
          <span>Create birthday event</span>
          <Link to="/createBirthdayEvent" />
        </Menu.Item>

        <Menu.Item key="/upcomingBirthdays">
          <span>Upcoming birthdays</span>
          <Link to="/upcomingBirthdays" />
        </Menu.Item>

        <Menu.Item key="/allAndOpenBirthdayEvents">
          <span>All and open birthday events</span>
          <Link to="/allAndOpenBirthdayEvents" />
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="itemSubmenu" title="Items - Submenu">
        <Menu.Item key="/allItems">
          <span>All items</span>
          <Link to="/allItems" />
        </Menu.Item>

        <Menu.Item key="/addItem">
          <span>Add item</span>
          <Link to="/addItem" />
        </Menu.Item>

        <Menu.Item key="/myWishList">
          <span>My wish list</span>
          <Link to="/myWishList" />
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="userSubmenu" title="User" icon={<SettingOutlined />}>
        <Menu.Item key="signOut" icon={<AppstoreOutlined />} onClick={signOut}>
          SignOut
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export default Navbar;
