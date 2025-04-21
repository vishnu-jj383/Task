import React, { useState } from "react";
import axios from "axios";
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { Form, Input, Button, Select, message } from "antd";

const { Option } = Select;

const Add = () => {
  const navigate = useNavigate();
  const sideBarState = useSelector((state) => state?.sidebar?.sideBar);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const url = import.meta.env.VITE_API_URL;
  let addUrl = `${url}api/tasks/`;

  const handleSubmit = async (values) => {
    setLoading(true);
    const token = Cookies.get("access");

    if (!token) {
      message.error("Authentication token not found. Please login.");
      setLoading(false);
      navigate("/");
      return;
    }

    try {
      const response = await axios.post(
        addUrl,
        {
          title: values.title,
          description: values.description || "",
          priority: values.priority,
          status: values.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Task created successfully!");
      navigate("/Lists"); // Assuming "/Lists" is your task list route
      form.resetFields();
      // if (onTaskCreated) {
      //   onTaskCreated(response.data);
      // }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create task. Please try again.";
      message.error(errorMessage);
      if (error.response?.status === 401) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`wrapper ${sideBarState ? "sidebar_minimize" : ""}`}>
      <SideBar />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="card">
              <div className="card-header">
                <center>
                  <h5 style={{ color: "black" }}>Create New Task</h5>
                </center>
              </div>
              <div className="card-body">
                <div className="create-task">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ priority: "medium", status: "pending" }}
                  >
                    <Form.Item
                      label="Title"
                      name="title"
                      rules={[
                        {
                          required: true,
                          message: "Please enter a title!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter task title" />
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                      <Input.TextArea
                        placeholder="Enter task description"
                        rows={4}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Priority"
                      name="priority"
                      rules={[
                        {
                          required: true,
                          message: "Please select a priority!",
                        },
                      ]}
                    >
                      <Select>
                        <Option value="low">Low</Option>
                        <Option value="medium">Medium</Option>
                        <Option value="high">High</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Status"
                      name="status"
                      rules={[
                        {
                          required: true,
                          message: "Please select a status!",
                        },
                      ]}
                    >
                      <Select>
                        <Option value="pending">Pending</Option>
                        <Option value="completed">Completed</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                          style={{ width: "100%", maxWidth: "200px" }} // Optional: limit button width
                        >
                          {loading ? "Creating..." : "Create Task"}
                        </Button>
                      </div>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Add;
