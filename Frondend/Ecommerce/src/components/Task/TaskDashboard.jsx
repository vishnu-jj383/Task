import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Col, Row, Statistic, message } from "antd";

const TaskDashboard = () => {
  const navigate = useNavigate();
  const sideBarState = useSelector((state) => state?.sidebar?.sideBar);
  const [loading, setLoading] = useState(false);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  const fetchAllTasks = async () => {
    setLoading(true);
    const token = Cookies.get("access");

    if (!token) {
      message.error("Please login to view dashboard");
      navigate("/");
      return;
    }

    let tasks = [];
    let nextUrl = "http://localhost:8000/api/tasks/";

    try {
      while (nextUrl) {
        const response = await axios.get(nextUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        tasks = [...tasks, ...response.data.results];
        nextUrl = response.data.next;
      }

      // Calculate counts
      const total = tasks.length;
      const pending = tasks.filter((task) => task.status === "pending").length;
      const completed = tasks.filter(
        (task) => task.status === "completed"
      ).length;

      setTaskStats({ total, pending, completed });
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
      message.error("Failed to load dashboard data.");
      if (error.response?.status === 401) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  return (
    <div className={`wrapper ${sideBarState ? "sidebar_minimize" : ""}`}>
      <SideBar pageName="dashboard" />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h3 className="fw-bold mb-3">Dashboard</h3>
            </div>
            <Row gutter={16}>
              <Col span={8}>
                <Card loading={loading}>
                  <Statistic
                    title="Total Tasks"
                    value={taskStats.total}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card loading={loading}>
                  <Statistic
                    title="Pending Tasks"
                    value={taskStats.pending}
                    valueStyle={{ color: "#cf1322" }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card loading={loading}>
                  <Statistic
                    title="Completed Tasks"
                    value={taskStats.completed}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TaskDashboard;
