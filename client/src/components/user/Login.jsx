import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { serviceConfig } from "../../appSettings/serviceConfig";
import { useContext } from "react";
import { Context } from "../../utils/LoginProvider";
import { Form, Input, Button, DatePicker, Select } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { optionsErrorToast } from "../../helper/toastOptions";
import moment from "moment";

function Login() {
  const [user, setUser] = useState({
    username: "",
  });
  const [registerUser, setRegisterUser] = useState({
    name: "",
    birthDate: "",
    wishlist: [],
  });
  const [allItems, setAllItems] = useState([]);
  const [login, setLogin] = useContext(Context);
  const [isSignIn, setIsSignIn] = useState(true);

  const initalRegisterState = {
    name: "",
    birthDate: "",
    wishlist: [],
  };

  useEffect(() => {
    getAllItems();
  }, []);

  const handleSubmitSignIn = (event) => {
    event.preventDefault();

    signIn();
  };

  const handleSubmitRegister = (event) => {
    event.preventDefault();
    register();
  };

  const signIn = async () => {
    await axios
      .post(`${serviceConfig.baseURL}/users/login?name=${user.username}`)
      .then((res) => {
        localStorage.setItem("usernameOfLoggedUser", user.username);
        setLogin(!login);
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message, optionsErrorToast);
      });
  };

  const register = async () => {
    await axios
      .post(`${serviceConfig.baseURL}/users`, registerUser)
      .then((res) => {
        setIsSignIn(!isSignIn);
        toast.success("Successfully registered!");
        toast.info("You need to login now!");
        setRegisterUser(initalRegisterState);
        document.getElementById("register-user-form").reset();
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
      });
  };

  return (
    <>
      {isSignIn ? (
        <div className="form-container">
          <Form
            onSubmitCapture={handleSubmitSignIn}
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              <Button type="link" className="btn-link" onClick={() => setIsSignIn(!isSignIn)}>
                Register now!
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div className="form-container">
          <Form
            id="register-user-form"
            onSubmitCapture={handleSubmitRegister}
            className="login-form"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              name="namee"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Name"
                onChange={(e) =>
                  setRegisterUser({ ...registerUser, name: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item
              name="birthDate"
              rules={[
                {
                  required: true,
                  message: "Please pick you birth date!",
                },
              ]}
            >
              <DatePicker
                onChange={(value) =>
                  setRegisterUser({
                    ...registerUser,
                    birthDate: moment(value._d).format("YYYY-MM-DD"),
                  })
                }
              />
            </Form.Item>

            <Form.Item>
              <Select
                mode="multiple"
                maxTagCount={2}
                allowClear
                placeholder="Select wish items for present"
                onChange={(value) =>
                  setRegisterUser({ ...registerUser, wishlist: value })
                }
              >
                {allItems.map((item) => {
                  return (
                    <Select.Option key={item._id} value={item._id}>
                      {item.name}
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
                Register
              </Button>
              <Button type="link" className="btn-link" onClick={() => setIsSignIn(!isSignIn)}>
                Login now!
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
}

export default Login;
