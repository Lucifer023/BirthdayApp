import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { serviceConfig } from "../../appSettings/serviceConfig";
import { Form, Input, Button, InputNumber } from "antd";
import { optionsErrorToast } from "../../helper/toastOptions";
import { useLocation, useNavigate } from "react-router-dom";

const AddParticipantToBirthdayEvent = () => {
  let navigate = useNavigate();
  const { state } = useLocation();
  const [userPayment, setUserPayment] = useState({
    birthdayEventId: state,
    amount: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    addParticipantToBirthdayEvent();
  };

  const addParticipantToBirthdayEvent = async () => {
    await axios
      .post(
        `${serviceConfig.baseURL}/birthdayEvents/updateWithParticipant`,
        userPayment
      )
      .then((res) => {
        toast.success("Succesfully added as participant");
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
      <h1>Add yourself as participant</h1>
      <div className="main-container">
        <Form
          onSubmitCapture={handleSubmit}
          className="form-container-item"
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input amount!",
              },
            ]}
          >
            <InputNumber
              placeholder="Amount"
              onChange={(value) =>
                setUserPayment({ ...userPayment, amount: value })
              }
            />
          </Form.Item>

          <Form.Item name="message">
            <Input
              placeholder="Birthday message"
              onChange={(e) =>
                setUserPayment({ ...userPayment, message: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Add yourself as participant
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddParticipantToBirthdayEvent;
