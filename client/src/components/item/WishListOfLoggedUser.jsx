import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { serviceConfig } from "../../appSettings/serviceConfig";
import { optionsErrorToast } from "../../helper/toastOptions";

const WishListOfLoggedUser = () => {
  const [allItems, setAllItems] = useState([]);
  const [userWishList, setUserWishList] = useState([]);
  let itemNames = [];

  useEffect(() => {
    getLoggedInUser();
    getAllItems();
  }, []);

  const getLoggedInUser = async () => {
    const username = localStorage.getItem("usernameOfLoggedUser");
    await axios
      .get(`${serviceConfig.baseURL}/users/${username}`)
      .then((res) => {
        setUserWishList(res.data.wishlist);
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };

  const getAllItems = async () => {
    await axios
      .get(`${serviceConfig.baseURL}/items/getAllItems`)
      .then((res) => {
        setAllItems(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };

  return (
    <div>
      <h1 style={{ display: "flex", justifyContent: "center" }} >My wish list</h1>
      {allItems.map((item, index) => {
        for (let i = 0; i < userWishList.length; i++) {
          if (item._id === userWishList[i]) {
            itemNames.push(item.name);
          }
        }
      })}

      {itemNames.map((item, index) => {
        return <p key={index} style={{ display: "flex", justifyContent: 'center' }} >{item}</p>
      })}
    </div>
  );
};

export default WishListOfLoggedUser;
