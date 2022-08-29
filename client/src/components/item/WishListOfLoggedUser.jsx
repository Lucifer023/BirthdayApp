import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { serviceConfig } from "../../appSettings/serviceConfig";
import { optionsErrorToast } from "../../helper/toastOptions";
import { Table, Card, Typography } from "antd";

const WishListOfLoggedUser = () => {
  const [allItems, setAllItems] = useState([]);
  const [userWishList, setUserWishList] = useState([]);
  const { Title } = Typography;
  let loggedUserWishList = [];

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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Image",
      dataIndex: "urlLink",
      key: "urlLink",
      align: "center",
      render: (urlLink) => {
        return <img className="itemImageUrl" src={urlLink} alt="imageOfItem" />;
      },
    },
  ];

  return (
    <>
      {allItems.filter((item) => {
        for (let i = 0; i < userWishList.length; i++) {
          if (item._id === userWishList[i]) {
            loggedUserWishList.push(item);
          }
        }
      })}
      
      <React.Fragment>
        <Card>
          <Title level={3}>Your wish list</Title>
          <Table
            columns={columns}
            dataSource={loggedUserWishList}
            rowKey={(data) => data._id}
          ></Table>
        </Card>
      </React.Fragment>
    </>
  );
};

export default WishListOfLoggedUser;
