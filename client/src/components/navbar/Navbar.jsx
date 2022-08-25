import React, { useContext } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import { Context } from "../../utils/LoginProvider";
import { serviceConfig } from "../../appSettings/serviceConfig";
import { optionsErrorToast } from "../../helper/toastOptions";
import { toast } from "react-toastify";
import axios from "axios";

// U OKVIRU JEDNE TABELE PRIKAZATI ALL I OPEN BIRTHDAY EVENT-E TAKO STO NA OSNOVU JEDNOG SWITCH BUTTON-A MENJATI SA ALL NA OPEN I SA OPEN NA ALL
// DODATI FORMU ZA DODAVANJE BIRTHDAY EVENT-A
// DODATI FORMU ZA DODAVANJE PRESENT-A ZA NEKI BIRTHDAY EVENT (TO BI MOGLO NPR DA U OKVIRU TABELE OPEN BIRTHDAY EVENT BUDE JEDNA KOLONA KAO BTN ZA DODAVANJE ZA KUPOVINU PRESENT-A)
// TAKODJE U OKVIRU TE TABELE ZA PRIKAZ SVIH OPEN BIRTHDAY EVENT-A JEDNO DUGME ZA DODAVANJE ULOGOVANOG USER-A KAO PARTICIPANT-A
// KADA SE KORISNIK ULOGUJE DA MU ODE NA STRANICU HOME KOJA BI IMALA U SEBI NAVBAR I POCETNU STRANICU KOJA BI BILA PRIKAZ LISTE SA SVIM RODJENDANIMA
// KAD SE SVE TO GORE URADI ONDA MOZE DA SE REDOM SVE FUNCKIONALNOSTI SA BACKEND-A PRIKAZUJU NA FRONTEND
// ANTD CHILDREN WILL BE REMOVED U KONZOLI PISE PA VIDETI TO KAKO DA SE RESI

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
        <Menu.Item key="/upcomingBirthdays">
          <span>Upcoming birthdays</span>
          <Link to="/upcomingBirthdays" />
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
