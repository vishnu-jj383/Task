import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Form, Input, Button, Select, message } from "antd";
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";

const { Option } = Select;

const Edit = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // Indicate data loading
  const { id } = useParams(); // Get task ID from URL
  const navigate = useNavigate();
  const sideBarState = useSelector(
    (state) => state.sidebar?.isMinimized || false
  ); // Adjust based on your Redux store
  const url = import.meta.env.VITE_API_URL;
  const fetchTask = async () => {
    const token = Cookies.get("access");
    if (!token) {
      message.error("Please log in to continue.");
      navigate("/");
      return;
    }

    try {
      setFetching(true);
      const response = await axios.get(`${url}api/tasks/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched Task Data:", response.data); // Verify data
      form.setFieldsValue({
        title: response.data.title,
        description: response.data.description,
        priority: response.data.priority,
        status: response.data.status,
      });
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
      message.error("Failed to load task data. Please try again.");
      navigate("/");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const token = Cookies.get("access");

    try {
      await axios.put(
        `http://localhost:8000/api/tasks/${id}/`,
        {
          title: values.title,
          description: values.description,
          priority: values.priority,
          status: values.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Task updated successfully!");
      navigate("/Lists");
    } catch (error) {
      console.error("Update Error:", error.response?.data || error.message);
      message.error("Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

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
                  <h5 style={{ color: "black" }}>Edit Task</h5>
                </center>
              </div>
              <div className="card-body">
                {fetching ? (
                  <p>Loading task data...</p>
                ) : (
                  <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                      label="Title"
                      name="title"
                      rules={[
                        { required: true, message: "Please enter a title!" },
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

                    <Form.Item label="Priority" name="priority">
                      <Select>
                        <Option value="low">Low</Option>
                        <Option value="medium">Medium</Option>
                        <Option value="high">High</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item label="Status" name="status">
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
                         {loading ? "Updating..." : "Update Task"}
                        </Button>
                      </div>
                      
                    {/* <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                      >
                        {loading ? "Updating..." : "Update Task"}
                      </Button> */}
                    </Form.Item>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Edit;
