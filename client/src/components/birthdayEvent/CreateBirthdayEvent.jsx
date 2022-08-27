import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { serviceConfig } from "../../appSettings/serviceConfig";
import { optionsErrorToast } from "../../helper/toastOptions";
import moment from "moment";
import { Form, Input, Button, InputNumber, Select } from "antd";
import { useNavigate } from "react-router-dom";

const CreateBirthdayEvent = () => {
  let navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState({});
  const [usersWithUpcomingBirthdays, setUsersWithUpcomingBirthdays] = useState([]);
  const [birthdayEvent, setBirthdayEvent] = useState({
    birthdayPerson: "",
    totalMoneyAmount: "",
    notes: "",
    eventCreator: "",
    eventDate: moment(loggedUser.birthDate)
      .set(`year`, new Date().getFullYear())
      .format("YYYY-MM-DD"),
  });

  useEffect(() => {
    getLoggedInUser();
    getAllUpcomingBirthdays();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    createBirthdayEvent();
  };

  const getLoggedInUser = async () => {
    const username = localStorage.getItem("usernameOfLoggedUser");
    await axios
      .get(`${serviceConfig.baseURL}/users/${username}`)
      .then((res) => {
        setLoggedUser(res.data);
        setBirthdayEvent((state) => ({
          ...state,
          eventCreator: res.data._id,
        }));
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };

  const getAllUpcomingBirthdays = async () => {
    await axios
      .get(`${serviceConfig.baseURL}/users/upcomingBirthdays`)
      .then((res) => {
        setUsersWithUpcomingBirthdays(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };

  const routeChange = () => {
    let path = `/allAndOpenBirthdayEvents`;
    navigate(path);
  };

  const createBirthdayEvent = async () => {
    await axios
      .post(`${serviceConfig.baseURL}/birthdayEvents`, birthdayEvent)
      .then((res) => {
        toast.success("Successfully created birthday event");
        routeChange();
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };

  return (
    <>
      <h1>Create birthday event</h1>
      <div className="main-container">
        <Form
          onSubmitCapture={handleSubmit}
          className="form-container-item"
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            name="birthdayPerson"
            rules={[
              {
                required: true,
                message: "Please select birthday person!",
              },
            ]}
          >
            <Select
              allowClear
              placeholder="Select person which you want to create birthday event"
              onChange={(value) =>
                setBirthdayEvent({ ...birthdayEvent, birthdayPerson: value })
              }
              className="select-person"
            >
              {usersWithUpcomingBirthdays.map((user) => {
                return (
                  <Select.Option key={user._id} value={user._id}>
                    {user.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="totalMoneyAmount"
            rules={[
              {
                required: true,
                message: "Please input total money amount!",
              },
            ]}
          >
            <InputNumber
              placeholder="Total money amount"
              className="totalMoneyAmount-field"
              onChange={(value) =>
                setBirthdayEvent({ ...birthdayEvent, totalMoneyAmount: value })
              }
            />
          </Form.Item>

          <Form.Item name="notes">
            <Input
              placeholder="Note for birthday event"
              onChange={(e) =>
                setBirthdayEvent({ ...birthdayEvent, notes: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Create birthday event
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreateBirthdayEvent;
