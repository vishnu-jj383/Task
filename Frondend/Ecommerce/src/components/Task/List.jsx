import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { List, Button, message, Typography, Pagination, Input, Select } from "antd";
import "./List.css"; // Import the CSS file
import { IoEye } from "react-icons/io5";
const { Paragraph } = Typography;
const { Option } = Select;

const TaskList = () => {
  const navigate = useNavigate();
  const sideBarState = useSelector((state) => state?.sidebar?.sideBar);
  const [allTasks, setAllTasks] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [titleFilter, setTitleFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const pageSize = 3;
  const url = import.meta.env.VITE_API_URL;
  const fetchAllTasks = async () => {
    setLoading(true);
    const token = Cookies.get("access");

    if (!token) {
      message.error("Please login to view tasks");
      navigate("/");
      return;
    }

    let tasks = [];
 
    let nextUrl =`${url}api/tasks/`

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
        setTotalTasks(response.data.count);
      }
      setAllTasks(tasks);
      applyFiltersAndPaginate(tasks, "", "", 1);
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
      message.error("Failed to load tasks. Please try again.");
      if (error.response?.status === 401) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndPaginate = (tasks, title, priority, page) => {
    let filteredTasks = tasks;
    if (title) {
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(title.toLowerCase())
      );
    }
    if (priority) {
      filteredTasks = filteredTasks.filter((task) => task.priority === priority);
    }

    const filteredTotal = filteredTasks.length;
    setTotalTasks(filteredTotal);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedTasks(filteredTasks.slice(startIndex, endIndex));
    setCurrentPage(page);
  };

  const handleDelete = async (taskId) => {
    const token = Cookies.get("access");

    if (!token) {
      message.error("Please login to delete tasks");
      navigate("/");
      return;
    }

    try {
      await axios.delete(`${url}api/tasks/${taskId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      message.success("Task deleted successfully!");
      const updatedTasks = allTasks.filter((task) => task.id !== taskId);
      setAllTasks(updatedTasks);
      applyFiltersAndPaginate(updatedTasks, titleFilter, priorityFilter, currentPage);
    } catch (error) {
      message.error("Failed to delete task.");
    }
  };

  const handlePageChange = (page) => {
    applyFiltersAndPaginate(allTasks, titleFilter, priorityFilter, page);
  };

  const handleTitleFilterChange = (e) => {
    const newTitle = e.target.value;
    setTitleFilter(newTitle);
    applyFiltersAndPaginate(allTasks, newTitle, priorityFilter, 1);
  };

  const handlePriorityFilterChange = (value) => {
    setPriorityFilter(value);
    applyFiltersAndPaginate(allTasks, titleFilter, value, 1);
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  return (
    <div className={`wrapper ${sideBarState ? "sidebar_minimize" : ""}`}>
      <SideBar pageName="tasks" />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h3 className="fw-bold mb-3">Task List</h3>
            </div>

            <div className="filters-container">
              <div className="filter-item">
                <Input
                  className="task-filter"
                  placeholder="Search by title..."
                  value={titleFilter}
                  onChange={handleTitleFilterChange}
                  allowClear
                />
              </div>
              <div className="filter-item">
                <Select
                  className="task-filter"
                  placeholder="Filter by priority"
                  value={priorityFilter || undefined}
                  onChange={handlePriorityFilterChange}
                  allowClear
                >
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                </Select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <List
                      loading={loading}
                      dataSource={displayedTasks}
                      renderItem={(task) => (
                        <List.Item
                          actions={[
                            <Button
                            type="link"
                            icon={<IoEye />}
                            onClick={() => navigate(`/tasks/view/${task.id}`)}
                          >
                            View
                          </Button>,
                            <Button
                              type="link"
                              icon={<FaEdit />}
                              onClick={() => navigate(`/tasks/edit/${task.id}`)}
                            >
                              Edit
                            </Button>,
                            <Button
                              type="link"
                              danger
                              icon={<FaTrash />}
                              onClick={() => handleDelete(task.id)}
                            >
                              Delete
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            title={task.title}
                            description={
                              <>
                                <Paragraph>
                                  <strong>Description:</strong>{" "}
                                  {task.description || "No description provided"}
                                </Paragraph>
                                <Paragraph>
                                <strong>Created Date:</strong> {task.created_at} |{" "}
                                </Paragraph>
                                <Paragraph>
                                  <strong>Priority:</strong> {task.priority} |{" "}
                                  
                                  <strong>Status:</strong> {task.status}
                                </Paragraph>
                              </>
                            }
                          />
                        </List.Item>
                      )}
                    />
                    <div className="pagination-container">
                      <Pagination
                        className="task-pagination"
                        current={currentPage}
                        total={totalTasks}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper
                        showTotal={(total) => `Total ${total} tasks`}
                        responsive
                      />
                    </div>
                  </div>
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

export default TaskList;