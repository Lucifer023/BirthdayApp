import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { serviceConfig } from "../../appSettings/serviceConfig";
import { Form, Select, Button } from "antd";
import { optionsErrorToast } from "../../helper/toastOptions";
import { useLocation, useNavigate } from "react-router-dom";

const BuyPresent = () => {
  let navigate = useNavigate();
  const { state } = useLocation();
  const [present, setPresent] = useState({
    birthdayEventId: state,
    presentBought: "",
  });
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    getAllItems();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    buyPresent();
  };

  const getAllItems = async () => {
    await axios
      .get(`${serviceConfig.baseURL}/items/getAllItems`)
      .then((res) => {
        setAllItems(res.data);
      });
  };

  const buyPresent = async () => {
    await axios
      .post(`${serviceConfig.baseURL}/presents`, present)
      .then((res) => {
        toast.success("Successfully bought present");
        routeChange();
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };

  const routeChange = () => {
    let path = `/allAndOpenBirthdayEvents`;
    navigate(path);
  };
  return (
    <>
      <h1>Buy present</h1>
      <div className="form-container">
        <Form onSubmitCapture={handleSubmit} className="login-form">
          <Form.Item
            name="items"
            rules={[
              {
                required: true,
                message: "Please select one item!",
              },
            ]}
          >
            <Select
              allowClear
              placeholder="Select one item"
              onChange={(value) =>
                setPresent({ ...present, presentBought: value })
              }
              className="select-item-present"
            >
              {allItems.map((item) => {
                return (
                  <Select.Option key={item._id} value={item._id}>
                    {item.name} {"-"} {item.price} {"din"}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Buy present
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default BuyPresent;
