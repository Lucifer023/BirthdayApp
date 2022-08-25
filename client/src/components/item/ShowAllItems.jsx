import axios from "axios";
import React, { useState, useEffect } from "react";
import { serviceConfig } from "../../appSettings/serviceConfig";
import { toast } from "react-toastify";
import { optionsErrorToast } from "../../helper/toastOptions";
import { Table, Card, Typography, Button } from "antd";

const ShowAllItems = () => {
  const [allItems, setAllItems] = useState([]);
  const { Title } = Typography;

  useEffect(() => {
    getAllItems();
  }, [allItems]);

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

  const addItemToWishList = async (dataId) => {
    await axios
      .get(`${serviceConfig.baseURL}/users/addItemToWishList/${dataId}`)
      .then((res) => {
        toast.success("You successufully added item to your wish list!");
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
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        return <p>{price} din</p>;
      },
    },
    {
      title: "Image",
      dataIndex: "urlLink",
      key: "urlLink",
      render: (urlLink) => {
        return <img className="itemImageUrl" src={urlLink} alt="imageOfItem" />;
      },
    },
    {
      title: "Add item to your wish list",
      dataIndex: "",
      key: "x",
      render: (data) => {
        return (
          <Button type="primary" onClick={() => addItemToWishList(data._id)}>
            Add
          </Button>
        );
      },
    },
    {
      title: "Delete item",
      dataIndex: "",
      key: "x",
      render: (data) => {
        return (
          <Button type="danger" onClick={() => deleteItem(data._id)}>
            Delete
          </Button>
        );
      },
    },
  ];

  const deleteItem = async (dataId) => {
    await axios
      .delete(`${serviceConfig.baseURL}/items/${dataId}`)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };

  return (
    <>
      <React.Fragment>
        <Card>
          <Title level={3}>List of all items</Title>
          <Table
            columns={columns}
            dataSource={allItems}
            rowKey={(data) => data._id}
          ></Table>
        </Card>
      </React.Fragment>
    </>
  );
};

export default ShowAllItems;
