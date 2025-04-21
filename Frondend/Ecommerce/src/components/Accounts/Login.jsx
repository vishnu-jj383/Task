import axios from "axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../Accounts/Login.css";
import { Card, Button, Form, Input } from "antd";
import { Link } from "react-router-dom"; // Import Link for navigation
import OIP from "./oip.jpg"; // Ensure this image path is correct

const Login = () => {
  const [form] = Form.useForm();
  const [warningMessage, setWarningMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate
  const url = import.meta.env.VITE_API_URL;
  let loginUrl =`${url}api/login/`

  const handleSubmit = async (values) => {
    try {
      // Log the form values for debugging
      console.log("Form Values: ", values);

      // Make the POST request to your Django backend login endpoint
      const response = await axios.post(loginUrl, {
        username: values.username, // Match Django's expected field
        password: values.password,
      });

      // Store JWT tokens in cookies
      Cookies.set("access", response.data.access, { expires: 1 }); // Access token expires in 1 day
      Cookies.set("refresh", response.data.refresh, { expires: 7 }); // Refresh token expires in 7 days
      Cookies.set("username",values.username, { expires: 1 }); // 1 day
     
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        setWarningMessage("Invalid login credentials");
      } else if (error.request) {
        setWarningMessage("No response from server. Please try again.");
      } else {
        setWarningMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="col-6 image-container">
            <img alt="Logo" src={OIP} className="login-image" />
          </div>
          <div className="col-6 form-container">
            <Card hoverable className="card">
              <br />
              <h3 className="login-title">Welcome Back</h3>
              <div className="warning-container">
                {warningMessage && (
                  <div className="alert alert-danger" role="alert">
                    {warningMessage}
                  </div>
                )}
              </div>
              <Form
                form={form}
                name="login_form"
                onFinish={handleSubmit}
                layout="vertical"
              >
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: "Please enter your username!" },
                  ]}
                >
                  <Input placeholder="Enter Username" className="login-input" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please enter your password!" },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter Password"
                    className="login-input"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    block
                    htmlType="submit"
                    className="login-btn"
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>

              <div className="signup-link">
                <p>
                  Don't have an account?{" "}
                  <Link to="/signup" className="signup-link-text">
                    Sign up here
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;