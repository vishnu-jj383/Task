import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Input, message as AntMessage } from "antd";
import "./Signup.css"; // Import the CSS file

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const url = import.meta.env.VITE_API_URL;
  let register_Url =`${url}api/register/`

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Make the POST request to the Django register endpoint
      const response = await axios.post(register_Url, {
        username: values.username,
        password: values.password,
      });

      if (response.status === 201) {
        AntMessage.success("Signup successful! Redirecting to login...");
        form.resetFields(); // Reset form fields after successful signup
        setTimeout(() => navigate("/"), 2000); // Redirect to login after 2 seconds
      }
    } catch (error) {
      if (error.response) {
        AntMessage.error(
          error.response.data.username?.[0] || // Display specific error if username is taken
          error.response.data.detail || 
          "Signup failed. Please try again."
        );
      } else {
        AntMessage.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Card className="signup-card">
        <h2 className="signup-title">Create an Account</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required!" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          {/* Removed Email field since Django's UserSerializer doesn't use it */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required!" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" block htmlType="submit" loading={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </Form.Item>
        </Form>

        <p className="login-link">
          Already have an account? <a href="/">Login here</a>
        </p>
      </Card>
    </div>
  );
};

export default Signup;