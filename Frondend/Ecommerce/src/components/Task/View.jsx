import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import "./View.css"; // Reuse your CSS with minor adjustments

function View() {
  const navigate = useNavigate();
  const sideBarState = useSelector((state) => state?.sidebar?.sideBar);
  const { id } = useParams();

  // Define the API URL for tasks
  const API_URL = `http://localhost:8000/api/tasks/${id}/`;

  // State variables
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = Cookies.get("access");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchTask = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setTask(response.data);
        } else {
          throw new Error("Invalid API response structure");
        }
      } catch (err) {
        console.error("Error fetching task data:", err);
        setError(err.response?.data?.message || "Failed to fetch task details.");

        if (err.response?.status === 401) {
          Swal.fire("Session Expired", "Please log in again.", "warning");
          Cookies.remove("access");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [navigate, id]);

  return (
    <div className={`wrapper ${sideBarState ? "sidebar_minimize" : ""}`}>
      <SideBar pageName="tasks" />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="task-card">
              <h2 className="card-title">Task Details</h2>

              {loading && (
                <p className="loading-text">Loading task details...</p>
              )}

              {error && <p className="error">{error}</p>}

              {task && !loading && !error && (
                <>
                  <div className="task-detail">
                    <span className="label">Title:</span>
                    <span className="value">{task.title}</span>
                  </div>

                  <div className="task-detail">
                    <span className="label">Description:</span>
                    <span className="value">
                      {task.description || "No description provided"}
                    </span>
                  </div>

                  <div className="task-detail">
                    <span className="label">Priority:</span>
                    <span className="value">{task.priority}</span>
                  </div>

                  <div className="task-detail">
                    <span className="label">Status:</span>
                    <span className="value">{task.status}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default View;