import React, { useContext } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Context } from "../../utils/LoginProvider";
import { serviceConfig } from "../../appSettings/serviceConfig";
import { optionsErrorToast } from "../../helper/toastOptions";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";

const Navbar = () => {
  const [login, setLogin] = useContext(Context);
  const [user, setUser] = useState(localStorage.getItem("usernameOfLoggedUser"))

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

  const menuItems = [
    {
      label: "Birthday - Submenu",
      key: "birthdaySubmenu",
      children: [
        {
          label: (
            <>
              <span>Create birthday event</span>
              <Link to="/createBirthdayEvent" />
            </>
          ),
          key: "/createBirthdayEvent",
        },
        {
          label: (
            <>
              <span>Upcoming birthdays</span>
              <Link to="/upcomingBirthdays" />
            </>
          ),
          key: "/upcomingBirthdays",
        },
        {
          label: (
            <>
              <span>All and open birthday events</span>
              <Link to="/allAndOpenBirthdayEvents" />
            </>
          ),
          key: "/allAndOpenBirthdayEvents",
        },
      ],
    },
    {
      label: "Item - Submenu",
      key: "itemSubmenu",
      children: [
        {
          label: (
            <>
              <span>All items</span>
              <Link to="/allItems" />
            </>
          ),
          key: "/allItems",
        },
        {
          label: (
            <>
              <span>Add item</span>
              <Link to="/addItem" />
            </>
          ),
          key: "/addItem",
        },
        {
          label: (
            <>
              <span>My wish list</span>
              <Link to="/myWishList" />
            </>
          ),
          key: "/myWishList",
        },
      ],
    },
    {
      label: <>{user}</>,
      key: "userSubmenu",
      icon: <UserOutlined />,
      children: [
        {
          label: (
            <>
              <span onClick={signOut}>Sign out</span>
            </>
          ),
          key: "/signOut",
          icon: <LogoutOutlined />,
          danger: true,
        },
      ],
    },
  ];

  return (
    <Menu mode="horizontal" items={menuItems} className="navbar-menu"></Menu>
  );
};

export default Navbar;
