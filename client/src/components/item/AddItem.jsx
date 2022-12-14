import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { serviceConfig } from "../../appSettings/serviceConfig";
import { Form, Input, Button, InputNumber } from "antd";
import { optionsErrorToast } from "../../helper/toastOptions";
import { useNavigate } from "react-router-dom";

const AddItemToWishList = () => {
  let navigate = useNavigate();
  const [item, setItem] = useState({
    name: "",
    price: 0,
    urlLink: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    addItem();
  };

  const addItem = async () => {
    await axios
      .post(`${serviceConfig.baseURL}/items`, item)
      .then((res) => {
        toast.success("Successfully added item!");
        routeChange();
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };

  const routeChange = () => {
    let path = `/allItems`;
    navigate(path);
  };

  const isImage = (url) => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  };

  return (
    <>
      <h1>Add item</h1>
      <div className="main-container">
        <Form
          onSubmitCapture={handleSubmit}
          className="form-container-item"
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            name="itemName"
            rules={[
              {
                required: true,
                message: "Please input name of item!",
              },
            ]}
          >
            <Input
              placeholder="name of item"
              onChange={(e) =>
                setItem({
                  ...item,
                  name: e.target.value,
                })
              }
            />
          </Form.Item>

          <Form.Item
            name="itemPrice"
            rules={[
              {
                required: true,
                message: "Please input price for item!",
              },
            ]}
          >
            <InputNumber
              placeholder="price"
              onChange={(value) => setItem({ ...item, price: value })}
            />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            rules={[
              {
                required: true,
                message: "Please input image url of item!",
              },
            ]}
          >
            <Input
              placeholder="Image url of item"
              onChange={(e) => {
                if (isImage(e.target.value)) {
                  setItem({ ...item, urlLink: e.target.value });
                }
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Add item
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddItemToWishList;
